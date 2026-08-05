export default function Topbar({ title }) {
  return (
    <header className="flex h-16 items-center justify-between bg-white px-6 shadow-sm">
      <h1 className="text-2xl font-semibold">
        {title}
      </h1>
    </header>
  );
}