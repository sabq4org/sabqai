export interface Category {
  id: string;
  name_ar: string;
  name_en?: string;
  slug: string;
  description?: string;
  color_hex: string;
  icon?: string;
  parent_id?: string | null;
  position?: number;
  is_active: boolean;
  articles_count?: number;
  article_count?: number;
  can_delete?: boolean;
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
  canonical_url?: string;
  noindex?: boolean;
  og_type?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  children?: Category[];
} 