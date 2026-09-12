"use client";

import { useSyncExternalStore } from "react";
import {
  getReducedMotionPreference,
  subscribeReducedMotion,
} from "@/motion/core/reducedMotion";

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionPreference,
    () => false,
  );
}
