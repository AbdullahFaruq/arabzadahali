export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  category: string;
  color: string;
  size: string;
  material: string;
  image: string;
  images: string[];
  badge?: string;
  description: string;
  features: string[];
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
}
