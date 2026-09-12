"use client";

import { useMotionContext } from "@/motion/core/MotionContext";

export function useMotionReady(): boolean {
  return useMotionContext().ready;
}
