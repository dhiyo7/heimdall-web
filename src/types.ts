export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  date?: string;
  imageUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl?: string;
}

export interface NavLink {
  label: string;
  href: string;
}