import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { requireAdmin } from "../../../lib/adminAuth";
import { Slide } from "../../../data/slides";

type SlideDoc = Slide & { order: number };

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = (await req.json()) as Omit<Slide, "id">;

  const db = await getDb();
  const result = await db
    .collection<SlideDoc>("slides")
    .findOneAndUpdate(
      { id: Number(id) },
      { $set: body },
      { returnDocument: "after", projection: { _id: 0, order: 0 } }
    );

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
  const result = await db.collection<SlideDoc>("slides").deleteOne({ id: Number(id) });

  if (result.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
