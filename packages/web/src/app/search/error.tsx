'use client';

import ErrorState from "@/components/ui/ErrorState";
import { useEffect } from "react";

export default function SearchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Search error:", error);
  }, [error]);

  return <ErrorState error={error} reset={reset} />;
}
