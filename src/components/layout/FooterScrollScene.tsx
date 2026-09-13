"use client";

import Link from "next/link";
import { useRef } from "react";
import { images } from "@/data/assets";
import { contact, restaurant } from "@/data/restaurant/home";
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
      scene.dataset.footerMode = "static";

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
            <h2 className="h4">{contact.heading}</h2>
            <p className="p5 sd-footer__address">{contact.address}</p>
          </div>
        </div>

        {contact.phone || contact.email ? (
          <div className="sd-footer__center">
            {contact.phone ? (
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="p3 sd-footer__contact"
              >
                {contact.phone}
              </a>
            ) : null}
            {contact.email ? (
              <a href={`mailto:${contact.email}`} className="p3 sd-footer__contact">
                {contact.email}
              </a>
            ) : null}
          </div>
        ) : null}

        <div className="sd-footer__bot">
          <div className="sd-footer__wordmark">
            <SvgWordmark />
          </div>
          <p className="p6">© 2026 {restaurant.name.toUpperCase()}. ALL RIGHTS RESERVED</p>
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
