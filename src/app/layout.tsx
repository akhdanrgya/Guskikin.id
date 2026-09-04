import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "guskikin.id — Khazanah Pemikiran & Dakwah",
  description: "Portal resmi khazanah pemikiran, gagasan kebangsaan, dan rekam jejak dakwah K.H. Abdul Hakim Mahfudz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${jakarta.variable} font-body-md antialiased bg-cream-bg text-on-surface`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
