export interface Slide {
  id: number;
  image: string;
  tag: string;
  title: string;
  sub: string;
  cta: string;
  href: string;
  accent: string;
}

export const initialSlides: Slide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=1600&q=85",
    tag: "New Collection 2025",
    title: "Persian Royal\nMasterpieces",
    sub: "Hand-knotted by master artisans. Each rug tells a thousand-year story.",
    cta: "Explore Collection",
    href: "/shop?category=Persian",
    accent: "from-amber-500 to-orange-500",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=85",
    tag: "Limited Time — Up to 40% Off",
    title: "Moroccan Berber\nLuxury",
    sub: "Authentic Atlas Mountain wool. Warmth and texture for every home.",
    cta: "Shop the Sale",
    href: "/shop?category=Moroccan",
    accent: "from-rose-500 to-pink-500",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85",
    tag: "Premium Selection",
    title: "Modern Silk\nBlend Rugs",
    sub: "Contemporary designs with a luminous silk finish. Elevate any space.",
    cta: "View Modern Rugs",
    href: "/shop?category=Modern",
    accent: "from-violet-500 to-blue-500",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=85",
    tag: "Eco Conscious",
    title: "Vintage Overdyed\nCollection",
    sub: "Upcycled vintage rugs reimagined with bold contemporary colors.",
    cta: "Discover Vintage",
    href: "/shop?category=Vintage",
    accent: "from-teal-500 to-emerald-500",
  },
];

export const accentOptions = [
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-violet-500 to-blue-500",
  "from-teal-500 to-emerald-500",
  "from-sky-500 to-cyan-500",
  "from-red-500 to-orange-500",
];
