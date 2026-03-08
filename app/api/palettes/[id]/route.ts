import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { PublicPaletteRecord } from "@/types/palette";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("palettes")
    .select("id, name, colors, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Palette not found." }, { status: 404 });
  }

  return NextResponse.json(data as PublicPaletteRecord);
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: existingPalette, error: existingPaletteError } = await supabase
    .from("palettes")
    .select("id, user_id")
    .eq("id", id)
    .maybeSingle<{ id: string; user_id: string | null }>();

  if (existingPaletteError) {
    return NextResponse.json({ error: existingPaletteError.message }, { status: 500 });
  }

  if (!existingPalette) {
    return NextResponse.json({ error: "Palette not found." }, { status: 404 });
  }

  if (existingPalette.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("palettes").delete().eq("id", id).eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
