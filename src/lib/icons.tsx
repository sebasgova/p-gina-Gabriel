import type { ComponentType } from "react";
import {
  Scissors,
  Sparkles,
  Wand2,
  Palette,
  Smartphone,
  Film,
  Target,
  Mail,
  MessageCircle,
  Globe,
} from "lucide-react";
import {
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaBehance,
  FaWhatsapp,
  FaTiktok,
  FaFacebookF,
} from "react-icons/fa6";

export type IconComponent = ComponentType<{ size?: number; className?: string }>;

export const ICONS: Record<string, IconComponent> = {
  Scissors,
  Sparkles,
  Wand2,
  Palette,
  Smartphone,
  Film,
  Target,
  Mail,
  MessageCircle,
  Globe,
  Youtube: FaYoutube,
  Instagram: FaInstagram,
  Linkedin: FaLinkedinIn,
  Behance: FaBehance,
  WhatsApp: FaWhatsapp,
  TikTok: FaTiktok,
  Facebook: FaFacebookF,
};

export const PLATFORMS = ["TikTok", "Youtube", "Instagram", "Facebook"] as const;
export type Platform = (typeof PLATFORMS)[number];

export function getIcon(name: string): IconComponent {
  return ICONS[name] ?? Sparkles;
}
