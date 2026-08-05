export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "emerald",
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-card">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {value}
          </h2>

        </div>

        {Icon && (
          <div className={`rounded-2xl bg-${color}-100 p-4`}>
            <Icon
              size={28}
              className={`text-${color}-600`}
            />
          </div>
        )}

      </div>

    </div>
  );
}