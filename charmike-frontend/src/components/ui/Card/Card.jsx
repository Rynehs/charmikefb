export default function Card({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        bg-white
        rounded-2xl
        shadow-sm
        p-6
        transition-all
        duration-200
        hover:shadow-md
        ${className}
      `}
    >
      {children}
    </div>
  );
}