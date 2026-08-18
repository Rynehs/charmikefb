"use client";

import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/api";

export function Pagination({
  meta,
  onPageChange,
}: {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}) {
  if (meta.last_page <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-sm text-muted-foreground">
        Page {meta.current_page} of {meta.last_page} ({meta.total} total)
      </p>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={meta.current_page <= 1}
          onClick={() => onPageChange(meta.current_page - 1)}
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={meta.current_page >= meta.last_page}
          onClick={() => onPageChange(meta.current_page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
