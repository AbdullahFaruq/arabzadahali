import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../lib/mongodb";
import { requireAdmin } from "../../lib/adminAuth";
import { Slide } from "../../data/slides";

type SlideDoc = Slide & { order: number };

export async function GET() {
  const db = await getDb();
  const slides = await db
    .collection<SlideDoc>("slides")
    .find({}, { projection: { _id: 0, order: 0 } })
    .sort({ order: 1 })
    .toArray();
  return NextResponse.json(slides);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json()) as Omit<Slide, "id">;
  const id = Date.now();
  const slide: Slide = { ...body, id };

  const db = await getDb();
  await db.collection<SlideDoc>("slides").insertOne({ ...slide, order: id });

  return NextResponse.json(slide, { status: 201 });
}
