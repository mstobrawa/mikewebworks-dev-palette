import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Palette } from "@/types/palette";

type SavePayload = {
  name: string;
  colors: Palette;
  public?: boolean;
};

export async function POST(request: Request) {
  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const payload = (await request.json()) as SavePayload;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!payload.public && !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("palettes" as any)
    .insert({
      user_id: payload.public ? null : user?.id ?? null,
      name: payload.name,
      colors: payload.colors,
    } as any)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
