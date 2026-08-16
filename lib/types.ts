export interface AdminUser {
  id: number;
  username: string;
  password: string;
  enabled: boolean;
}

export interface IptvUser {
  id: number;
  username: string;
  password: string;
  banquetId: number;
  enabled: boolean;
  expiresAt: string | null;
  maxConnections: number;
  createdAt: string;
}

export interface Channel {
  id: number;
  name: string;
  streamId: number;
  stream_type: "live" | "movie" | "series";
  streamUrl: string;
  logoUrl: string;
  categoryId: number;
  enabled: boolean;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  enabled: boolean;
  createdAt: string;
}

export interface Banquet {
  id: number;
  name: string;
  description: string;
  access: "all" | "selected";
  allowedCategories?: number[];
  enabled: boolean;
  createdAt: string;
}