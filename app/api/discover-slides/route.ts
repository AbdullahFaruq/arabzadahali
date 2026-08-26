import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../lib/mongodb";
import { requireAdmin } from "../../lib/adminAuth";
import { DiscoverSlide } from "../../data/slides";

export async function GET() {
  const db = await getDb();
  const slides = await db
    .collection<DiscoverSlide>("discoverSlides")
    .find({}, { projection: { _id: 0 } })
    .sort({ id: 1 })
    .toArray();
  return NextResponse.json(slides);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json()) as Omit<DiscoverSlide, "id">;
  const slide: DiscoverSlide = { ...body, id: Date.now() };

  const db = await getDb();
  await db.collection<DiscoverSlide>("discoverSlides").insertOne(slide);

  return NextResponse.json(slide, { status: 201 });
}
