"use client";

import type { ReactNode } from "react";
import { MotionProvider } from "@/motion/core/MotionProvider";

/** Client boundary for global motion infrastructure. */
export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionProvider>{children}</MotionProvider>;
}
