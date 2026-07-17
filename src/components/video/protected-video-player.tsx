"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Loader2,
  Lock,
  Gauge,
  Wifi,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { VideoQuality } from "@/types";

interface ProtectedVideoPlayerProps {
  src: string; // HLS .m3u8 URL
  title?: string;
  studentName: string;
  studentEmail: string;
  lessonDuration?: number; // seconds
  initialPosition?: number; // seconds
  dataSaverMode: boolean;
  onProgress?: (position: number, watchedMB: number) => void;
  onComplete?: () => void;
  className?: string;
}

// Bitrate estimates in MB per minute
const BITRATE_MAP: Record<VideoQuality, number> = {
  LOW_DATA: 2.0,
  "480P": 3.5,
  "720P": 7.0,
  AUTO: 3.5,
};

const LEVEL_MAP: Record<VideoQuality, number> = {
  LOW_DATA: 0, // force lowest
  "480P": 0,
  "720P": 1,
  AUTO: -1, // auto
};

export function ProtectedVideoPlayer({
  src,
  title,
  studentName,
  studentEmail,
  lessonDuration = 0,
  initialPosition = 0,
  dataSaverMode,
  onProgress,
  onComplete,
  className,
}: ProtectedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(lessonDuration);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quality, setQuality] = useState<VideoQuality>(dataSaverMode ? "LOW_DATA" : "480P");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [watchedMB, setWatchedMB] = useState(0);
  const [completedTriggered, setCompletedTriggered] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Watermark text - mix of name + email, scrambled positions
  const watermarkText = `${studentName} | ${studentEmail}`;

  // Initialize HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 30,
        maxBufferLength: 30,
      });
      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        applyQualityLevel(hls, quality);
        if (initialPosition > 0 && video) {
          video.currentTime = initialPosition;
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setIsLoading(false);
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS (Safari)
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        if (initialPosition > 0) {
          video.currentTime = initialPosition;
        }
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Apply quality level
  const applyQualityLevel = (hls: Hls, q: VideoQuality) => {
    const level = LEVEL_MAP[q];
    if (q === "AUTO") {
      hls.currentLevel = -1;
    } else {
      hls.currentLevel = level;
    }
  };

  const handleQualityChange = (q: VideoQuality) => {
    setQuality(q);
    if (hlsRef.current) {
      applyQualityLevel(hlsRef.current, q);
    }
  };

  // Sync data saver mode
  useEffect(() => {
    if (dataSaverMode && quality !== "LOW_DATA") {
      handleQualityChange("LOW_DATA");
    }
  }, [dataSaverMode, quality]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // Trigger completion at 90%
      if (
        duration > 0 &&
        video.currentTime >= duration * 0.9 &&
        !completedTriggered
      ) {
        setCompletedTriggered(true);
        onComplete?.();
      }
    };
    const onLoadedMetadata = () => {
      setDuration(video.duration || lessonDuration);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);
    const onVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("volumechange", onVolumeChange);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("volumechange", onVolumeChange);
    };
  }, [duration, lessonDuration, completedTriggered, onComplete]);

  // Data consumption tracker
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const ratePerMin = BITRATE_MAP[quality];
      const increment = (ratePerMin / 60) * 5; // every 5 seconds
      setWatchedMB((prev) => {
        const next = prev + increment;
        onProgress?.(currentTime, next);
        return next;
      });
    }, 5000);
    progressIntervalRef.current = interval;
    return () => clearInterval(interval);
  }, [isPlaying, quality, currentTime, onProgress]);

  // Fullscreen tracking
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Auto-hide controls
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  useEffect(() => {
    showControlsTemporarily();
  }, [isPlaying, showControlsTemporarily]);

  // Playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.pause();
    else video.play();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    // RTL: seek direction is reversed visually
    const x = rect.right - e.clientX;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    video.currentTime = pct * duration;
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const qualityLabel: Record<VideoQuality, string> = {
    AUTO: "تلقائي",
    "480P": "480p",
    "720P": "720p",
    LOW_DATA: "توفير الباقة",
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative aspect-video w-full overflow-hidden rounded-xl bg-black",
        className,
      )}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        ref={videoRef}
        className="h-full w-full"
        playsInline
        onClick={togglePlay}
        style={{ pointerEvents: "auto" }}
      />

      {/* Watermark overlay */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="video-watermark">{watermarkText}</div>
        <div className="video-watermark" style={{ top: "20%", left: "20%", fontSize: "1rem", transform: "rotate(-15deg)" }}>
          {studentEmail}
        </div>
        <div className="video-watermark" style={{ top: "75%", left: "70%", fontSize: "1.1rem", transform: "rotate(-25deg)" }}>
          {studentName}
        </div>
      </div>

      {/* Protected badge */}
      <div className="absolute right-3 top-3 z-20 flex gap-2">
        <div className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] text-white backdrop-blur" title="هذا المحتوى محمي بتقنية تشفير HLS ومتوفر فقط للطلاب المسجلين">
          <Lock className="h-3 w-3" />
          محتوى محمي
        </div>
        <div className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] text-white backdrop-blur" title="جودة الفيديو الحالية">
          <Gauge className="h-3 w-3" />
          {qualityLabel[quality]}
        </div>
      </div>

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
        </div>
      )}

      {/* Big play button when paused */}
      {!isPlaying && !isLoading && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 transition hover:bg-black/40"
          aria-label="تشغيل"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient shadow-lg transition hover:scale-110">
            <Play className="h-7 w-7 fill-white text-white" />
          </div>
        </button>
      )}

      {/* Title overlay */}
      {title && showControls && (
        <div className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/70 to-transparent p-3 pt-12">
          <h3 className="text-sm font-medium text-white line-clamp-1">{title}</h3>
        </div>
      )}

      {/* Controls bar */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-8 transition-opacity",
          !showControls && "opacity-0 pointer-events-none",
        )}
      >
        {/* Seek bar */}
        <div
          onClick={handleSeek}
          className="group/seek relative mb-2 h-1.5 cursor-pointer rounded-full bg-white/20"
        >
          <div
            className="absolute right-0 h-full rounded-full bg-brand-gradient"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow opacity-0 group-hover/seek:opacity-100"
            style={{ right: `calc(${duration ? (currentTime / duration) * 100 : 0}% - 6px)` }}
          />
        </div>

        {/* Buttons row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button onClick={togglePlay} className="text-white hover:text-primary transition" aria-label={isPlaying ? "إيقاف" : "تشغيل"}>
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>

            <div className="flex items-center gap-1">
              <button onClick={toggleMute} className="text-white hover:text-primary transition" aria-label={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}>
                {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (videoRef.current) {
                    videoRef.current.volume = v;
                    videoRef.current.muted = v === 0;
                  }
                }}
                className="hidden w-16 accent-primary sm:block"
              />
            </div>

            <div className="text-xs text-white tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Data consumption */}
            <div className="hidden items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-white sm:flex">
              {dataSaverMode ? <Leaf className="h-3 w-3 text-emerald-400" /> : <Wifi className="h-3 w-3" />}
              <span className="tabular-nums">{watchedMB.toFixed(1)} MB</span>
            </div>

            {/* Speed selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded px-1.5 py-1 text-xs text-white hover:bg-white/10" aria-label="سرعة التشغيل">
                  {playbackSpeed}x
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>سرعة التشغيل</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                  <DropdownMenuItem
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={speed === playbackSpeed ? "bg-accent/10" : ""}
                  >
                    {speed}x {speed === 1 && "(عادي)"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quality selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 rounded px-1.5 py-1 text-xs text-white hover:bg-white/10" aria-label="الجودة">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">{qualityLabel[quality]}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>جودة الفيديو</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(["AUTO", "720P", "480P", "LOW_DATA"] as VideoQuality[]).map((q) => (
                  <DropdownMenuItem
                    key={q}
                    onClick={() => handleQualityChange(q)}
                    className={q === quality ? "bg-accent/10" : ""}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{qualityLabel[q]}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {q === "AUTO" && "تلقائي"}
                        {q === "720P" && "~7 MB/د"}
                        {q === "480P" && "~3.5 MB/د"}
                        {q === "LOW_DATA" && "~2 MB/د"}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <div className="px-2 py-1 text-[10px] text-muted-foreground">
                  💡 وضع توفير الباقة يجبر الجودة على 480p لتقليل استهلاك الإنترنت
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <button onClick={toggleFullscreen} className="text-white hover:text-primary transition" aria-label="ملء الشاشة">
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
