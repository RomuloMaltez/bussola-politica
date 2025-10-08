import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bússola Política",
  description: "Teste atualizado em 2025 para mapear sua ideologia no cenário político contemporâneo.",
  metadataBase: new URL('https://bussola-politica.vercel.app'),
  openGraph: {
    title: 'Bússola Política',
    description: 'Teste atualizado em 2025 para mapear sua ideologia no cenário político contemporâneo.',
    url: 'https://bussola-politica.vercel.app',
    siteName: 'Bússola Política',
    images: [
      {
        url: '/opengraph-image.png', 
        width: 1200,
        height: 630,
        alt: 'Bússola Política - Descubra seu posicionamento político',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bússola Política',
    description: 'Teste atualizado em 2025 para mapear sua ideologia no cenário político contemporâneo.',
    images: ['/opengraph-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}