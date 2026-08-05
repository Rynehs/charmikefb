import Button from "@/components/ui/Button";

export default function PageHeader({
  title,
  subtitle,
  actionText,
  onAction,
}) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {title}
        </h1>

        <p className="mt-1 text-slate-500">
          {subtitle}
        </p>
      </div>

      {actionText && (
        <Button onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}