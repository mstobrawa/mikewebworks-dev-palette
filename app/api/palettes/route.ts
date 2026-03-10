import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Palette } from "@/types/palette";

type SavePayload = {
  name: string;
  colors: Palette;
};

export async function POST(request: Request) {
  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 },
    );
  }

  const payload = (await request.json()) as SavePayload;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const insertPayload = {
    user_id: user?.id ?? null,
    name: payload.name ?? "Shared palette",
    colors: payload.colors,
  };

  const client = user ? supabase : createAdminClient();

  if (!client) {
    return NextResponse.json(
      { error: "Anonymous sharing requires SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 },
    );
  }

  const { data, error } = await (client as any)
    .from("palettes")
    .insert(insertPayload)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data?.id }, { status: 201 });
}
