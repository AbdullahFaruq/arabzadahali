import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { MongoClient } from "mongodb";

// Minimal .env.local loader so this script can run standalone via `npm run seed`
// without pulling in Next.js's env machinery.
function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI (set it in .env.local)");
  const dbName = process.env.MONGODB_DB || "arabzada";

  const { products } = await import("../app/data/products");
  const { initialSlides, initialDiscoverSlides } = await import("../app/data/slides");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  await db.collection("products").createIndex({ id: 1 }, { unique: true });
  await db.collection("slides").createIndex({ id: 1 }, { unique: true });
  await db.collection("discoverSlides").createIndex({ id: 1 }, { unique: true });

  const productCount = await db.collection("products").countDocuments();
  if (productCount === 0) {
    await db.collection("products").insertMany(products);
    console.log(`Seeded ${products.length} products`);
  } else {
    console.log(`Skipping products seed — ${productCount} already present`);
  }

  const slideCount = await db.collection("slides").countDocuments();
  if (slideCount === 0) {
    await db
      .collection("slides")
      .insertMany(initialSlides.map((s, i) => ({ ...s, order: i })));
    console.log(`Seeded ${initialSlides.length} hero slides`);
  } else {
    console.log(`Skipping hero slides seed — ${slideCount} already present`);
  }

  const discoverCount = await db.collection("discoverSlides").countDocuments();
  if (discoverCount === 0) {
    await db.collection("discoverSlides").insertMany(initialDiscoverSlides);
    console.log(`Seeded ${initialDiscoverSlides.length} discovery slides`);
  } else {
    console.log(`Skipping discovery slides seed — ${discoverCount} already present`);
  }

  const settingsCollection = db.collection<{ _id: string; banner: string }>("settings");
  const settings = await settingsCollection.findOne({ _id: "site" });
  if (!settings) {
    await settingsCollection.insertOne({
      _id: "site",
      banner: "🎁 Free shipping on orders over ₺500 · Use code CARPET20 for 20% off",
    });
    console.log("Seeded default settings");
  } else {
    console.log("Skipping settings seed — already present");
  }

  await client.close();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
