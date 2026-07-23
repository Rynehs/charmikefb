import { Loader2 } from "lucide-react";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center p-6">
      <Loader2
        className="animate-spin text-[#50C878]"
        size={32}
      />
    </div>
  );
}