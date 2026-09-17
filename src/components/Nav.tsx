"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between glass-card rounded-2xl px-3 sm:px-5 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/instagram_profile.png" alt="AI 살롱 광주" className="w-7 h-7" />
          <span className="hidden sm:inline font-bold text-slate-100 text-sm whitespace-nowrap">AI 살롱 광주</span>
        </Link>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <Link
            href="/"
            className={`px-2 sm:px-3 py-1.5 rounded-lg text-[13px] sm:text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === "/"
                ? "text-white bg-white/8"
                : "text-slate-400 hover:text-white"
            }`}
          >
            홈
          </Link>
          <Link
            href="/members"
            className={`px-2 sm:px-3 py-1.5 rounded-lg text-[13px] sm:text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === "/members"
                ? "text-violet-300 bg-violet-500/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            둘러보기
          </Link>
          <Link
            href="/commands"
            className={`px-2 sm:px-3 py-1.5 rounded-lg text-[13px] sm:text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === "/commands"
                ? "text-cyan-300 bg-cyan-500/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            명령어
          </Link>
          <Link
            href="/study"
            className={`px-2 sm:px-3 py-1.5 rounded-lg text-[13px] sm:text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === "/study"
                ? "text-emerald-300 bg-emerald-500/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            스터디
          </Link>
          <Link
            href="/stats"
            className={`px-2 sm:px-3 py-1.5 rounded-lg text-[13px] sm:text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === "/stats"
                ? "text-amber-300 bg-amber-500/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            통계
          </Link>
          <Link
            href="/rules"
            className={`px-2 sm:px-3 py-1.5 rounded-lg text-[13px] sm:text-sm font-medium whitespace-nowrap transition-colors ${
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
