"use client";

import Link from "next/link";
import { useRef } from "react";
import { images } from "@/data/assets";
import { site } from "@/data/home.en";
import { MediaImage } from "@/components/ui/MediaImage";
import { SvgWordmark } from "@/components/ui/SvgWordmark";
import { registerGsapPlugins, useGSAP } from "@/motion/core/gsap";
import { useMotionContext } from "@/motion/core/MotionContext";
import { bindFooterParallaxSceneMatchMedia } from "@/motion/patterns/FooterParallaxScene";

export function FooterScrollScene() {
  const sceneRef = useRef<HTMLElement>(null);
  const { enhanced, ready } = useMotionContext();

  useGSAP(
    () => {
      const scene = sceneRef.current;
      if (!scene) return;

      if (!enhanced || !ready) {
        scene.dataset.footerMode = "static";
        return;
      }

      registerGsapPlugins();
      scene.dataset.footerMode = "desktop-parallax";

      const atmosphere = scene.querySelector<HTMLElement>(
        "[data-footer-atmosphere]",
      );
      const content = scene.querySelector<HTMLElement>("[data-footer-content]");
      if (!atmosphere) return;

      const unbind = bindFooterParallaxSceneMatchMedia({
        scene,
        atmosphere,
        content: content ?? undefined,
      });

      return () => {
        unbind();
        scene.dataset.footerMode = "static";
      };
    },
    { scope: sceneRef, dependencies: [enhanced, ready] },
  );

  return (
    <footer
      ref={sceneRef}
      id="contact"
      className="sd-section sd-footer theme-dark"
      data-theme="dark"
      data-header-theme="dark"
      data-footer-scene
      data-footer-mode="static"
    >
      <div className="sd-footer__bg" data-footer-atmosphere>
        <MediaImage src={images.footer.mountain} alt="" sizes="100vw" />
      </div>
      <div className="sd-footer__veil" aria-hidden="true" />

      <div className="sd-container sd-footer__content" data-footer-content>
        <div className="sd-grid-12 sd-footer__top">
          <div className="sd-col-1-5 sd-footer__block">
            <h2 className="h4">LOCATION</h2>
            <p className="p5 sd-footer__address">
              I. Petrasha St., 6/3, Yaremche, Ivano-Frankivsk region
            </p>
          </div>
          <div className="sd-col-8-13 sd-footer__block sd-footer__block--end">
            <h2 className="h4">SALES DEPARTMENTS</h2>
            <p className="p5 sd-footer__address">
              Ivano-Frankivsk 35 Konovaltsya St.
            </p>
            <h3 className="p4 sd-footer__subhead">YAREMCHE</h3>
            <p className="p5">260 Svobody St.</p>
            <p className="p5">Svobody St., 280/1</p>
          </div>
        </div>

        <div className="sd-footer__center">
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="p3 sd-footer__contact">
            {site.phone}
          </a>
          <a href={`mailto:${site.email}`} className="p3 sd-footer__contact">
            {site.email}
          </a>
        </div>

        <div className="sd-footer__bot">
          <div className="sd-footer__wordmark">
            <SvgWordmark />
          </div>
          <p className="p6">© 2026 SON DAVEN. ALL RIGHTS RESERVED</p>
          <div className="sd-footer__links p6">
            <a href="https://www.instagram.com/">Instagram</a>
            <a href="https://www.facebook.com/">Facebook</a>
            <a href="https://www.youtube.com/">Youtube</a>
            <Link href="/">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
