import { cn } from "@/lib/utils";

// 라벨 + 숫자 요약 카드.
export default function StatCard({
  label,
  value,
  tone = "text-slate-200",
  className,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  tone?: string;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={cn("glass-card rounded-2xl p-4 sm:p-5", className)}>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={cn("text-sm font-semibold tabular-nums", tone, valueClassName)}>{value}</p>
    </div>
  );
}
