import { Inter } from "next/font/google";

/* Theme kits are skinned by their own fonts, not Pavora's. The Filament Amber
   kit is tuned for Inter, so it's loaded here and exposed as --font-inter; the
   kit's font stack references it inside KitThemeScope. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function ThemeLayout({ children }: { children: React.ReactNode }) {
  return <div className={inter.variable}>{children}</div>;
}
