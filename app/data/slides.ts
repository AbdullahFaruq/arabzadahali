export interface Slide {
  id: number;
  image: string;
}

export interface DiscoverSlide {
  id: number;
  image: string;
}

export const initialSlides: Slide[] = [
  { id: 1, image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=1920&q=85" },
  { id: 2, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=85" },
  { id: 3, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=85" },
  { id: 4, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=85" },
];

export const initialDiscoverSlides: DiscoverSlide[] = [
  { id: 1, image: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1920&q=85" },
  { id: 2, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1920&q=85" },
  { id: 3, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=85" },
  { id: 4, image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1920&q=85" },
  { id: 5, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1920&q=85" },
];
