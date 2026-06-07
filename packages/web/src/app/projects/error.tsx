'use client';

import ErrorState from "@/components/ui/ErrorState";
import { useEffect } from "react";

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Projects error:", error);
  }, [error]);

  return <ErrorState error={error} reset={reset} />;
}
