export type ProjectCategory =
  | "Motion Graphics"
  | "VFX"
  | "Color Grading"
  | "Short Form"
  | "Long Form"
  | "Ads"
  | "YouTube";

export type Project = {
  id: string;
  order: number;
  published: boolean;
  title: string;
  slug: string;
  client: string;
  category: ProjectCategory;
  software: string[];
  duration: string;
  year: number;
  thumbnailPalette: [string, string];
  thumbnailUrl?: string;
  videoUrl?: string;
  description: string;
  result: string;
  tools: string[];
  ctr?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  showBeforeAfter?: boolean;
};

export type Testimonial = {
  id: string;
  order: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarPalette: [string, string];
  avatarUrl?: string;
};

export type ClientPlatform = "TikTok" | "Youtube" | "Instagram" | "Facebook";

export type Client = {
  id: string;
  order: number;
  name: string;
  platform: ClientPlatform;
  followers: string;
  avatarPalette: [string, string];
  avatarUrl?: string;
};

export type Settings = {
  heroHeadline: string;
  heroSubheadline: string;
  showreelTitle: string;
  showreelDuration: string;
  showreelType: string;
  showreelSoftware: string[];
  stats: { label: string; value: number; suffix: string }[];
  services: { title: string; description: string; icon: string }[];
  socials: { label: string; href: string; icon: string }[];
  contactEmail: string;
  whatsapp: string;
};
