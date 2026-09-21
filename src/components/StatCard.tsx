import { Card, CardDescription, CardTitle } from "@/components/ui/card";
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
    <Card className={cn("glass-card gap-1 rounded-2xl p-4 shadow-none sm:p-5", className)}>
      <CardDescription className="text-xs text-slate-500">{label}</CardDescription>
      <CardTitle className={cn("text-sm tabular-nums", tone, valueClassName)}>{value}</CardTitle>
    </Card>
  );
}
