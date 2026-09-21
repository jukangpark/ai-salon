import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// 상단 배지 + 그라데이션 제목(+ 둘째 줄) + 설명.
export default function PageHeader({
  badge,
  title,
  subtitle,
  description,
  className,
}: {
  badge: React.ReactNode;
  title: string;
  subtitle?: string;
  description: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative pt-28 sm:pt-32 pb-12 px-4 sm:px-6 text-center", className)}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-6">
          <Badge variant="outline" className="glass-card gap-2 px-4 py-2 text-sm text-slate-400 whitespace-normal">
            {badge}
          </Badge>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          <span className="gradient-text">{title}</span>
          {subtitle && (
            <>
              <br />
              <span className="text-slate-100">{subtitle}</span>
            </>
          )}
        </h1>
        <p className="text-slate-500 text-sm">
          {description}
        </p>
      </div>
    </section>
  );
}
