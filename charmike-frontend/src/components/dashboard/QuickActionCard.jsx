export default function QuickActionCard({
  title,
  description,
  icon: Icon,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-3xl bg-white p-6 text-left shadow-card transition hover:-translate-y-1"
    >
      {Icon && (
        <Icon
          size={30}
          className="mb-5 text-emerald-600"
        />
      )}

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </button>
  );
}