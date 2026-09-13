"use client";

import { useCallback, useState } from "react";
import { EditorialMotionLayer } from "@/motion/editorial/EditorialMotionLayer";
import { HeaderThemeObserver } from "@/motion/header/HeaderThemeObserver";
import type { HeaderTheme } from "@/motion/header/types";
import { NoiseOverlay } from "@/components/layout/NoiseOverlay";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ConsultationModal } from "@/components/layout/ConsultationModal";
import { MenuModal } from "@/components/layout/MenuModal";
import { HeroSection } from "@/components/sections/HeroSection";
import { PrologueSection } from "@/components/sections/PrologueSection";
import { AboutTransition } from "@/components/sections/AboutTransition";
import { AboutSection } from "@/components/sections/AboutSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { ApartmentsSection } from "@/components/sections/ApartmentsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [headerTheme, setHeaderTheme] = useState<HeaderTheme>("dark");

  const onHeaderThemeChange = useCallback((theme: HeaderTheme) => {
    setHeaderTheme(theme);
  }, []);

  return (
    <>
      <NoiseOverlay />
      <HeaderThemeObserver onThemeChange={onHeaderThemeChange} />
      <SiteHeader
        theme={headerTheme}
        onMenuOpen={() => setMenuOpen(true)}
        onConsultationOpen={() => setConsultationOpen(true)}
      />
      <main>
        <EditorialMotionLayer />
        <HeroSection onConsultationOpen={() => setConsultationOpen(true)} />
        <PrologueSection />
        <AboutTransition />
        <AboutSection />
        <BenefitsSection />
        <ApartmentsSection />
        <FaqSection />
        <SiteFooter />
      </main>
      <MenuModal open={menuOpen} onClose={() => setMenuOpen(false)} />
      <ConsultationModal open={consultationOpen} onClose={() => setConsultationOpen(false)} />
    </>
  );
}
