"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ui/ErrorState";

export default function ArticleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Article error:", error);
  }, [error]);

  return <ErrorState error={error} reset={reset} />;
}
