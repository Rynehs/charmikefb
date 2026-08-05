export default function NavItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
        active
          ? "bg-emerald-100 text-emerald-700"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {Icon && <Icon size={20} />}

      <span className="font-medium">
        {label}
      </span>
    </button>
  );
}