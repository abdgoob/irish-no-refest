import type { Metadata } from "next";
import { MotionRoot } from "@/motion/core/MotionRoot";
import "./globals.css";

export const metadata: Metadata = {
  title: "Son Daven — Design Resort Hotel in Yaremche",
  description:
    "Son Daven is a premium design resort hotel in Yaremche — investment project by blago.",
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
