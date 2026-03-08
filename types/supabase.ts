import type { Palette } from "@/types/palette";

export type Database = {
  public: {
    Tables: {
      palettes: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          colors: Palette;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          colors: Palette;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          colors?: Palette;
          created_at?: string;
        };
      };
    };
  };
};
