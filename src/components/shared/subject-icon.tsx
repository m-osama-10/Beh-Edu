"use client";

import {
  BookOpen,
  Globe,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Landmark,
  Map,
  ShieldCheck,
  Wifi,
  Award,
  Users,
  Headphones,
  BadgeDollarSign,
  UserPlus,
  CreditCard,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  Globe,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Landmark,
  Map,
  ShieldCheck,
  Wifi,
  Award,
  Users,
  Headphones,
  BadgeDollarSign,
  UserPlus,
  CreditCard,
  GraduationCap,
};

export function SubjectIcon({
  name,
  className,
  size = 24,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Icon = ICON_MAP[name] ?? BookOpen;
  return <Icon className={className} size={size} />;
}

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? BookOpen;
}
