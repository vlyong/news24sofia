import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL('https://news24sofia.eu'),
  title: {
    default: "News24Sofia - Последни новини от България и света",
    template: "%s | News24Sofia"
  },
  description: "Информационна агенция News24Sofia. Най-важните новини от София, Пловдив, Варна и страната. Ексклузивни репортажи, крими новини и анализи.",
  keywords: ["новини", "София", "България", "крими", "политика", "News24Sofia"],
  openGraph: {
    title: "News24Sofia - Последни новини",
    description: "Информационна агенция News24Sofia. Последни новини, анализи и репортажи.",
    url: 'https://news24sofia.eu',
    siteName: 'News24Sofia',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'News24Sofia Logo',
      },
    ],
    locale: 'bg_BG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'News24Sofia',
    description: 'Последни новини от България и света.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`${inter.variable} font-sans antialiased text-foreground bg-background transition-colors duration-300`}>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
