import { Suspense } from "react";
import ShopClient from "./ShopClient";

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="bg-stone-950 min-h-screen flex items-center justify-center text-stone-400">Loading...</div>}>
      <ShopClient />
    </Suspense>
  );
}
