import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Palette } from "@/types/palette";

type SavePayload = {
  name: string;
  colors: Palette;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as SavePayload;

  const { data, error } = await supabase
    .from("palettes")
    .insert({
      user_id: user.id,
      name: payload.name,
      colors: payload.colors
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
