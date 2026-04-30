import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";

const inter = Inter({
  variable: "--font-inter",
  weight: ["500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const lubalin = localFont({
  src: "../assets/fonts/lubalin.ttf",
  variable: "--font-lubalin",
  display: "swap",
});

export const metadata = {
  title: "Altvue",
  description: "Your Alternative Focus App",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lubalin.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
