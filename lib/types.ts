export type Tribute = {
  id: string;
  slug: string;
  name: string;
  relationship: string;
  country: string;
  message: string;
  photoUrl?: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
  featured?: boolean;
  pinned?: boolean;
  candleCount?: number;
};

export type PhotoStory = {
  id: string;
  title: string;
  image: string;
  alt: string;
  year: string;
  story: string;
  quote?: string;
  featured?: boolean;
};

export type MemoryStory = {
  id: string;
  name: string;
  relationship: string;
  country: string;
  story: string;
  featured?: boolean;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
};

export type TimelineMilestone = {
  year: string;
  title: string;
  description: string;
  image?: string;
  quote?: string;
};

export type MapPin = {
  city: string;
  country: string;
  x: number;
  y: number;
  message: string;
};

export type GuestBookStats = {
  visitors: number;
  tributes: number;
  candles: number;
  flowers: number;
  countries: number;
};

export type SpecialDate = {
  label: string;
  message: string;
  month: number;
  day: number;
  enabled: boolean;
};
