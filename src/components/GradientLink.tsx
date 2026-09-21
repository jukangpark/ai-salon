import { cn } from "@/lib/utils";

// 브랜드 그라데이션 외부 링크 버튼 (오픈채팅 참여 등). 색은 globals.css 토큰.
export default function GradientLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 overflow-hidden",
        className,
      )}
      style={{ background: "linear-gradient(135deg, var(--brand-grad-from), var(--brand-grad-to))" }}
    >
      <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
      {children}
    </a>
  );
}
