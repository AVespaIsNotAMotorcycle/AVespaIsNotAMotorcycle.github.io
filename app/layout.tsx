import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sasha Madden Ebersole",
  description: "Seattle Machine Learning Engineer",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
