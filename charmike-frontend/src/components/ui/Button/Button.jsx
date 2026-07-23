import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-[#50C878] text-white hover:bg-[#45B76B] shadow-sm",

  secondary:
    "bg-[#2E7D32] text-white hover:bg-[#256A2B]",

  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100",

  danger:
    "bg-red-600 text-white hover:bg-red-700",
};

export default function Button({
  children,
  variant = "primary",
  loading = false,
  fullWidth = false,
  className = "",
  ...props
}) {
  return (
    <button
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        px-5
        py-3
        text-sm
        font-semibold
        transition-all
        duration-200
        disabled:opacity-60
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <Loader2
          size={18}
          className="animate-spin"
        />
      )}

      {children}
    </button>
  );
}