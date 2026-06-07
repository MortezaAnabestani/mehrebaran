"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ui/ErrorState";

export default function VideoError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Video detail error:", error);
  }, [error]);

  return <ErrorState error={error} reset={reset} />;
}
