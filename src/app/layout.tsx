import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-arabic",
  subsets: ["arabic", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "بكالوريا بيه | منصة التعليم المصريية الأولى",
  description:
    "منصة بكالوريا بيه - منصة تعليمية مصرية متكاملة لطلاب الثانوية العامة والبكالوريا. كورسات أونلاين بفيديوهات محمية، جودة 480p لتوفير باقة الإنترنت، وأفضل المدرسين في مصر.",
  keywords: [
    "بكالوريا بيه",
    "تعليم مصر",
    "الثانوية العامة",
    "كورسات أونلاين",
    "فيديوهات محمية",
    "مدرسين مصر",
    "Baccalaureate Bey",
    "Egypt education",
    "online courses Egypt",
  ],
  authors: [{ name: "بكالوريا بيه" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "بكالوريا بيه | منصة التعليم المصرية",
    description:
      "تعلم من أفضل المدرسين المصريين بكورسات عالية الجودة وفيديوهات محمية توفر باقة الإنترنت.",
    url: "https://bakaloriaa-bey.com",
    siteName: "بكالوريا بيه",
    type: "website",
    locale: "ar_EG",
  },
  twitter: {
    card: "summary_large_image",
    title: "بكالوريا بيه",
    description: "منصة التعليم المصرية الأولى لطلاب الثانوية العامة",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1A5F7A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${ibmPlexArabic.variable} antialiased bg-background text-foreground font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
