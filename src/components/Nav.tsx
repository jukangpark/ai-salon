import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOIM_CALENDAR_API_URL, STATS_API_URL, STUDY_API_URL, STUDY_CALENDAR_URL, STUDY_RANKING_URL, warmApis } from "@/lib/api";
import { MEMBERS_API_URL } from "@/lib/members";

// 모바일에선 폭이 모자라 "홈"을 숨긴다 (로고가 홈 링크).
const LINKS = [
  { href: "/", label: "홈", mobileHidden: true },
  { href: "/members", label: "둘러보기" },
  { href: "/commands", label: "명령어" },
  { href: "/study", label: "스터디" },
  { href: "/stats", label: "통계" },
  { href: "/calendar", label: "달력" },
  { href: "/rules", label: "회칙" },
];

// 활성 탭은 브랜드 단색. 탭마다 색을 달리하지 않는다.
const ACTIVE = "text-violet-200 bg-violet-500/15 hover:bg-violet-500/15 hover:text-violet-200";


export default function Nav() {
  const { pathname } = useLocation();

  // 탭 데이터를 미리 받아둔다. 홈서버 API 가 요청마다 ~0.7초라 탭을 누른 뒤에 받으면 매번 기다리게 된다.
  useEffect(() => {
    warmApis([MEMBERS_API_URL, STATS_API_URL, MOIM_CALENDAR_API_URL, STUDY_API_URL, STUDY_CALENDAR_URL, STUDY_RANKING_URL]);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between glass-card backdrop-blur-md rounded-2xl px-3 sm:px-5 py-1.5 sm:py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <img src="/instagram_profile.png" alt="AI 살롱 광주" className="w-7 h-7" />
          <span className="hidden sm:inline font-bold text-slate-100 text-sm whitespace-nowrap">AI 살롱 광주</span>
        </Link>
        <div className="flex items-center gap-0.5 sm:gap-1">
          {LINKS.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              className={cn(
                "h-auto rounded-lg px-2 py-2.5 text-[13px] sm:px-3 sm:py-1.5 sm:text-sm",
                link.mobileHidden && "hidden sm:inline-flex",
                pathname === link.href ? ACTIVE : "text-slate-400 hover:bg-transparent hover:text-white",
              )}
            >
              <Link to={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
