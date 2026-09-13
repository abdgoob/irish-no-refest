import type { Metadata } from "next";
import { MotionRoot } from "@/motion/core/MotionRoot";
import "./globals.css";

export const metadata: Metadata = {
  title: "The House — A modern Irish public house in Austin",
  description:
    "A contemporary Irish public house in Austin, Texas. Good food. Good drink. Good company.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <MotionRoot>{children}</MotionRoot>
      </body>
    </html>
  );
}
