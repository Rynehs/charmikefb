import { cn } from "@/utils/cn";

export default function Card({
  children,
  className,
}) {
  return (
    <div
      className={cn(
        "bg-surface rounded-3xl shadow-card p-6 transition-all duration-300 hover:shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}