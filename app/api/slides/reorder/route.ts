import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { requireAdmin } from "../../../lib/adminAuth";
import { Slide } from "../../../data/slides";

type SlideDoc = Slide & { order: number };

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { ids } = (await req.json()) as { ids: number[] };

  const db = await getDb();
  await Promise.all(
    ids.map((id, index) =>
      db.collection<SlideDoc>("slides").updateOne({ id }, { $set: { order: index } })
    )
  );

  return NextResponse.json({ ok: true });
}
