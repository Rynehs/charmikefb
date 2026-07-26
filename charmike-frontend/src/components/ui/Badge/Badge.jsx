import { cn } from "@/utils/cn";

const variants = {
  pending:
    "bg-yellow-100 text-yellow-700",

  approved:
    "bg-green-100 text-green-700",

  rejected:
    "bg-red-100 text-red-700",

  active:
    "bg-blue-100 text-blue-700",

  completed:
    "bg-emerald-100 text-emerald-700",
};

export default function Badge({
  status,
}) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold",
        variants[status]
      )}
    >
      {status}
    </span>
  );
}