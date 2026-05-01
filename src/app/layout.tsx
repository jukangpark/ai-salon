import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI 살롱 광주 — 함께 나누는 AI 이야기",
  description:
    "광주에서 AI 활용법을 함께 나누는 소셜 모임. ChatGPT, Claude, Gemini 꿀팁부터 사이드 프로젝트까지, AI 덕후들이 모이는 곳.",
  keywords: ["AI", "광주", "모임", "인공지능", "AI살롱", "사이드프로젝트"],
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
  },
  openGraph: {
    title: "AI 살롱 광주",
    description: "광주에서 AI 활용법을 함께 나누는 소셜 모임",
    type: "website",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#030712] text-slate-100">{children}</body>
    </html>
  );
}
