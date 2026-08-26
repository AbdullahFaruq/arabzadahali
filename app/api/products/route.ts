import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../lib/mongodb";
import { requireAdmin } from "../../lib/adminAuth";
import { Product } from "../../types";

export async function GET() {
  const db = await getDb();
  const products = await db
    .collection<Product>("products")
    .find({}, { projection: { _id: 0 } })
    .sort({ id: 1 })
    .toArray();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json()) as Omit<Product, "id">;
  const product: Product = { ...body, id: Date.now() };

  const db = await getDb();
  await db.collection<Product>("products").insertOne(product);

  return NextResponse.json(product, { status: 201 });
}
