import { cn } from "@/lib/utils";

// 불러오는 중 / 에러 / 빈 결과 안내 박스.
export default function Notice({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("glass-card rounded-2xl p-6 text-center text-sm text-slate-500", className)}>{children}</div>
  );
}
