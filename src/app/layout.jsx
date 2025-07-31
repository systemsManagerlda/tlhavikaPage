import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tlhavika",
  description:
    "A Tlhavika é uma empresa moçambicana dedicada à promoção de soluções sustentáveis nas áreas de energia renovável, tecnologia e desenvolvimento digital. Trabalhamos para transformar comunidades através de inovação acessível, confiável e adaptada às necessidades locais.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
