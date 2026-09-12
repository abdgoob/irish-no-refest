import type { ReactNode } from "react";
import { Container } from "./Container";
import {
  defaultHeaderThemeForSection,
  type HeaderTheme,
} from "@/motion/header/types";

type Theme = "light" | "dark" | "inverted";

export function SectionShell({
  id,
  theme = "light",
  headerTheme,
  className = "",
  children,
  containerClassName = "",
}: {
  id?: string;
  theme?: Theme;
  /** Header palette while this section is active (defaults from section theme). */
  headerTheme?: HeaderTheme;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}) {
  const themeClass =
    theme === "dark"
      ? "theme-dark"
      : theme === "inverted"
        ? "theme-inverted"
        : "theme-light";

  const resolvedHeaderTheme =
    headerTheme ?? defaultHeaderThemeForSection(theme);

  return (
    <section
      id={id}
      className={`sd-section ${themeClass} ${className}`.trim()}
      data-theme={theme}
      data-header-theme={resolvedHeaderTheme}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
