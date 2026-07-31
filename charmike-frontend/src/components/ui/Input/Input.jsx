import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(function Input(
  { className, error = false, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl border bg-white px-4 py-3",
        "text-gray-900 placeholder:text-gray-400",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary",
        error
          ? "border-red-500"
          : "border-gray-200",
        className
      )}
      {...props}
    />
  );
});

export default Input;