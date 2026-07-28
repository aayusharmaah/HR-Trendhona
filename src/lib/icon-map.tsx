import {
  GraduationCap,
  FileSignature,
  Stamp,
  ShieldCheck,
  LogOut,
  FileText,
  Award,
  AlertTriangle,
  TrendingUp,
  IndianRupee,
  BadgeCheck,
  ScrollText,
  ThumbsUp,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  GraduationCap,
  FileSignature,
  Stamp,
  ShieldCheck,
  LogOut,
  FileText,
  Award,
  AlertTriangle,
  TrendingUp,
  IndianRupee,
  BadgeCheck,
  ScrollText,
  ThumbsUp,
  ClipboardList,
};

export function getDocIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? FileText;
}
