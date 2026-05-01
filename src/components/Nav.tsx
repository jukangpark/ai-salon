"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between glass-card rounded-2xl px-5 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/instagram_profile.png" alt="AI 살롱 광주" className="w-7 h-7" />
          <span className="font-bold text-slate-100 text-sm">AI 살롱 광주</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/"
                ? "text-white bg-white/8"
                : "text-slate-400 hover:text-white"
            }`}
          >
            홈
          </Link>
          <Link
            href="/rules"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/rules"
                ? "text-pink-300 bg-pink-500/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            회칙
          </Link>
        </div>
      </div>
    </nav>
  );
}
