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
    return NextResponse.json(
      { error: "Supabase client not available" },
      { status: 500 },
    );
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
    return NextResponse.json(
      { error: "Supabase client not available" },
      { status: 500 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("palettes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: "Palette not deleted (check RLS)." },
      { status: 403 },
    );
  }

  return NextResponse.json({ success: true });
}
