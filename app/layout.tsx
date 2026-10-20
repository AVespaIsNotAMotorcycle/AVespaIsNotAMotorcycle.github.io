import type { Metadata } from "next";
import "./globals.css";

import DotWaveBackground from './components/DotWaveBackground';

export const metadata: Metadata = {
  title: "Sasha Madden Ebersole",
  description: "Seattle Machine Learning Engineer",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
		<DotWaveBackground className="background" />
		{children}
	  </body>
    </html>
  );
}
