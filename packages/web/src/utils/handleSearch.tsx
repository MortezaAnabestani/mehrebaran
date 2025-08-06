import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function handleSearch(
  router: AppRouterInstance,
  term: string,
  onSearch?: (term: string) => void
): void {
  const trimmed = term.trim();
  if (!trimmed) return;

  if (onSearch) {
    onSearch(trimmed);
  } else {
    router.push(`/search?query=${encodeURIComponent(trimmed)}`);
  }
}
