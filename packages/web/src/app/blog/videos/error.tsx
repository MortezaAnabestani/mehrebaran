"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ui/ErrorState";

export default function VideosListError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Videos list error:", error);
  }, [error]);

  return <ErrorState error={error} reset={reset} />;
}
