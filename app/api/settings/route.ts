import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../lib/mongodb";
import { requireAdmin } from "../../lib/adminAuth";

const SETTINGS_ID = "site";
const DEFAULT_BANNER = "🎁 Free shipping on orders over ₺500 · Use code CARPET20 for 20% off";

interface SettingsDoc {
  _id: string;
  banner: string;
}

export async function GET() {
  const db = await getDb();
  const settings = await db.collection<SettingsDoc>("settings").findOne({ _id: SETTINGS_ID });
  return NextResponse.json({ banner: settings?.banner ?? DEFAULT_BANNER });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { banner } = (await req.json()) as { banner: string };

  const db = await getDb();
  await db
    .collection<SettingsDoc>("settings")
    .updateOne({ _id: SETTINGS_ID }, { $set: { banner } }, { upsert: true });

  return NextResponse.json({ banner });
}
