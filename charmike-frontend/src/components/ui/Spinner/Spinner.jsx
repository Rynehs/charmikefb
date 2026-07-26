export default function Spinner({
  size = "md",
  className = "",
}) {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 40,
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full ${className}`}
      style={{
        width: sizes[size],
        height: sizes[size],
        border: "3px solid rgba(80,200,120,.20)",
        borderTop: "3px solid #50C878",
      }}
    />
  );
}