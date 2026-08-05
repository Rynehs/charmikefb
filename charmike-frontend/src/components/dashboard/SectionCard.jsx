export default function SectionCard({
  title,
  children,
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-card">

      <h2 className="mb-6 text-xl font-semibold">
        {title}
      </h2>

      {children}

    </div>
  );
}