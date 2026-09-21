import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// 데이터를 기다리는 동안 실제 레이아웃 모양대로 보여주는 자리표시. 페이지마다 이 조각들을 조합한다.

// StatCard 모양 요약 카드 묶음. grid 열 구성은 페이지의 실제 그리드 클래스를 그대로 넘긴다.
export function StatCardsSkeleton({ count, className }: { count: number; className: string }) {
  return (
    <div className={cn("grid gap-3", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="glass-card rounded-2xl p-4 sm:p-5">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="mt-2.5 h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

// 멤버·인증 목록 한 줄 모양의 카드 여러 개.
export function ListSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="glass-card rounded-2xl border border-white/5 px-4 sm:px-5 py-3.5 flex items-center gap-3">
          <Skeleton className="h-3 w-4" />
          <Skeleton className="size-6 rounded-full" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-4 w-28" />
            <div className="mt-2 flex gap-1">
              <Skeleton className="h-3.5 w-10" />
              <Skeleton className="h-3.5 w-10" />
              <Skeleton className="h-3.5 w-12" />
            </div>
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}

// 차트·달력처럼 큰 카드. 높이는 className 으로 준다.
export function BlockSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("glass-card rounded-2xl p-5 sm:p-6", className)}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-2 h-3 w-32" />
      <Skeleton className="mt-5 h-[calc(100%-3.5rem)] w-full rounded-xl" />
    </div>
  );
}
