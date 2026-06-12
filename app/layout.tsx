import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { BackgroundProvider } from "@/components/BackgroundProvider";
import { CodeDialogProvider } from "@/components/CodeDialog";
import { SiteBackdrop } from "@/components/SiteBackdrop";
import { PreviewBar } from "@/components/PreviewBar";
import { CommandPalette } from "@/components/CommandPalette";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Motif — copy-paste UI backgrounds",
  description:
    "A free, open-source library of CSS and JS backgrounds. Preview any one across the whole page, then copy the code.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${hanken.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="relative min-h-full">
        <BackgroundProvider>
          <CodeDialogProvider>
            <SiteBackdrop />
            <Navbar />
            <main>{children}</main>
            <PreviewBar />
            <CommandPalette />
            <Toaster />
          </CodeDialogProvider>
        </BackgroundProvider>
      </body>
    </html>
  );
}
