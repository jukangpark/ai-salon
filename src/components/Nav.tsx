"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// 모바일에선 폭이 모자라 "홈"을 숨긴다 (로고가 홈 링크).
const LINKS = [
  { href: "/", label: "홈", active: "text-white bg-white/8", mobileHidden: true },
  { href: "/members", label: "둘러보기", active: "text-violet-300 bg-violet-500/10" },
  { href: "/commands", label: "명령어", active: "text-cyan-300 bg-cyan-500/10" },
  { href: "/study", label: "스터디", active: "text-emerald-300 bg-emerald-500/10" },
  { href: "/stats", label: "통계", active: "text-amber-300 bg-amber-500/10" },
  { href: "/calendar", label: "달력", active: "text-orange-300 bg-orange-500/10" },
  { href: "/rules", label: "회칙", active: "text-pink-300 bg-pink-500/10" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between glass-card rounded-2xl px-3 sm:px-5 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <img src="/instagram_profile.png" alt="AI 살롱 광주" className="w-7 h-7" />
          <span className="hidden sm:inline font-bold text-slate-100 text-sm whitespace-nowrap">AI 살롱 광주</span>
        </Link>
        <div className="flex items-center gap-0.5 sm:gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${link.mobileHidden ? "hidden sm:inline-block" : ""} px-2 sm:px-3 py-1.5 rounded-lg text-[13px] sm:text-sm font-medium whitespace-nowrap transition-colors ${
                pathname === link.href ? link.active : "text-slate-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
