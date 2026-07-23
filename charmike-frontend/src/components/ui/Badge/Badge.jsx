const colors = {
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
  status = "pending",
}) {
  return (
    <span
      className={`
        inline-flex
        px-3
        py-1
        rounded-full
        text-xs
        font-medium
        ${colors[status]}
      `}
    >
      {status}
    </span>
  );
}