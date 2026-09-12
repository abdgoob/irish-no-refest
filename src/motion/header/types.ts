export type HeaderTheme = "dark" | "light" | "inverted";

export function parseHeaderTheme(value: string | null): HeaderTheme | null {
  if (value === "dark" || value === "light" || value === "inverted") {
    return value;
  }
  return null;
}

export function defaultHeaderThemeForSection(
  theme: "light" | "dark" | "inverted",
): HeaderTheme {
  if (theme === "light") return "light";
  if (theme === "inverted") return "inverted";
  return "dark";
}
