"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { registerMotionEases } from "@/motion/config/eases";
import { motionEnv } from "@/motion/config/motionEnv";

let pluginsRegistered = false;

/** Single client-side GSAP plugin registration (SSR-safe no-op on server). */
export function registerGsapPlugins(): void {
  if (pluginsRegistered || typeof window === "undefined") return;

  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  registerMotionEases();

  if (motionEnv.debug) {
    ScrollTrigger.defaults({ markers: true });
  }

  pluginsRegistered = true;
}

export { gsap, ScrollTrigger, SplitText, CustomEase, useGSAP };
