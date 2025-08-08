"use client";
import { useConvertNumbersToPersian } from "@/hooks/useConvertNumbersToPersian";

export default function ClientSideEffect() {
  useConvertNumbersToPersian();
  return null;
}
