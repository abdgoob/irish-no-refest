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
import { svg } from "@/data/assets";
import { AboutTransition } from "@/components/sections/AboutTransition";
import { AboutSection } from "@/components/sections/AboutSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { CommissioningSection } from "@/components/sections/CommissioningSection";
import { ApartmentsSection } from "@/components/sections/ApartmentsSection";
import { FinanceSection } from "@/components/sections/FinanceSection";
import { SeasonsSection } from "@/components/sections/SeasonsSection";
import { DeveloperSection } from "@/components/sections/DeveloperSection";
import { FactoidsSection } from "@/components/sections/FactoidsSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { BlogSection } from "@/components/sections/BlogSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ThemeTransition } from "@/components/ui/ThemeTransition";

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
        <ThemeTransition src={svg.transitionDark} />
        <LocationSection onConsultationOpen={() => setConsultationOpen(true)} />
        <BenefitsSection />
        <CommissioningSection />
        <ApartmentsSection />
        <ThemeTransition src={svg.transitionDark02} />
        <FinanceSection />
        <SeasonsSection onConsultationOpen={() => setConsultationOpen(true)} />
        <DeveloperSection />
        <FactoidsSection />
        <ThemeTransition src={svg.transitionDark03} />
        <GallerySection />
        <BlogSection />
        <CtaSection onConsultationOpen={() => setConsultationOpen(true)} />
        <FaqSection />
        <SiteFooter />
      </main>
      <MenuModal open={menuOpen} onClose={() => setMenuOpen(false)} />
      <ConsultationModal open={consultationOpen} onClose={() => setConsultationOpen(false)} />
    </>
  );
}
