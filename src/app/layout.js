import { Fira_Sans } from "next/font/google";
import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";

const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  weight: ["500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Altvue",
  description: "Altvue flight map",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${firaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
