import { WandSparkles } from "lucide-react";

type GenerateButtonProps = {
  onClick: () => void;
};

export function GenerateButton({ onClick }: GenerateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-canvas transition hover:scale-[1.01] hover:shadow-[0_0_0_6px_rgba(255,255,255,0.05)]"
    >
      <WandSparkles className="h-4 w-4" />
      Generate Palette
    </button>
  );
}
