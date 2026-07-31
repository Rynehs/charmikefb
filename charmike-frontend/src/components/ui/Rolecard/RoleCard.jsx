import { CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/cn";

export default function RoleCard({
  title,
  description,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full rounded-2xl border p-6 text-left transition-all duration-200",
        "hover:-translate-y-1 hover:shadow-lg",
        selected
          ? "border-primary bg-primary/10 shadow-md"
          : "border-gray-200 bg-white hover:border-primary/40"
      )}
    >
      {selected && (
        <CheckCircle2
          className="absolute right-4 top-4 text-primary"
          size={22}
        />
      )}

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        {description}
      </p>
    </button>
  );
}