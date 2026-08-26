import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { requireAdmin } from "../../../lib/adminAuth";
import { Product } from "../../../types";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = (await req.json()) as Omit<Product, "id">;
  const product: Product = { ...body, id: Number(id) };

  const db = await getDb();
  const result = await db
    .collection<Product>("products")
    .findOneAndReplace({ id: Number(id) }, product, { returnDocument: "after", projection: { _id: 0 } });

  if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(result);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const db = await getDb();
  const result = await db.collection<Product>("products").deleteOne({ id: Number(id) });

  if (result.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
