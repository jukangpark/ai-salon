import { useId } from "react";
import { Area, AreaChart, Bar, BarChart, Cell, Label, LabelList, Pie, PieChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

// 차트 한 칸. tooltipLabel: 툴팁 제목(없으면 label), note: 툴팁 값 옆 보조 정보, highlight: 강조색.
export type ChartRow = {
  key: string;
  label: string;
  value: number;
  tooltipLabel?: string;
  note?: string;
  highlight?: boolean;
};

const tooltipLabel = (_: unknown, payload: readonly { payload?: ChartRow }[]) => {
  const row = payload?.[0]?.payload;
  return row ? (row.tooltipLabel ?? row.label) : null;
};

// 툴팁 한 줄: 계열 이름(흐리게) + 값·단위(진하게) + 보조 정보.
const tooltipRow = (unit: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function TooltipRow(value: any, name: any, item: any) {
    return (
      <div className="flex w-full items-center gap-2">
        <span className="h-0.5 w-3 shrink-0 rounded-full" style={{ background: item.color ?? item.payload?.fill }} />
        <span className="text-muted-foreground">{name}</span>
        <span className="ml-auto font-mono font-medium tabular-nums text-foreground">
          {Number(value).toLocaleString()}
          {unit}
          {item.payload?.note ? <span className="text-muted-foreground"> · {item.payload.note}</span> : null}
        </span>
      </div>
    );
  };

// 세로 막대. showValues: 막대 위 숫자 (칸이 좁은 24시간 차트는 끈다), tickEvery: 아래 라벨 간격.
export function ColumnChart({
  data,
  name,
  unit,
  color = "var(--chart-1)",
  showValues = true,
  tickEvery = 1,
  className = "h-40",
}: {
  data: ChartRow[];
  name: string;
  unit: string;
  color?: string;
  showValues?: boolean;
  tickEvery?: number;
  className?: string;
}) {
  const config = { value: { label: name, color } } satisfies ChartConfig;
  return (
    <ChartContainer config={config} className={cn("aspect-auto w-full", className)}>
      <BarChart data={data} margin={{ top: showValues ? 18 : 4, left: 0, right: 0, bottom: 0 }} barCategoryGap={2}>
        <XAxis dataKey="label" tickLine={false} axisLine={false} interval={tickEvery - 1} tickMargin={6} fontSize={10} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent labelFormatter={tooltipLabel} formatter={tooltipRow(unit)} />}
        />
        <Bar dataKey="value" name={name} fill="var(--color-value)" radius={[4, 4, 0, 0]}>
          {data.map((d) => (
            <Cell key={d.key} fill={d.highlight ? "var(--chart-highlight)" : "var(--color-value)"} />
          ))}
          {showValues && (
            <LabelList
              dataKey="value"
              position="top"
              fontSize={10}
              className="fill-slate-400 tabular-nums"
              formatter={(v) => (v ? Number(v).toLocaleString() : "")}
            />
          )}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

// 시간 추이. 선 + 옅은 면, 포인터 위치의 값을 툴팁으로.
export function TrendChart({
  data,
  name,
  unit,
  tickEvery,
  className = "h-40",
}: {
  data: ChartRow[];
  name: string;
  unit: string;
  tickEvery: number;
  className?: string;
}) {
  const fillId = `trend-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const config = { value: { label: name, color: "var(--chart-1)" } } satisfies ChartConfig;
  return (
    <ChartContainer config={config} className={cn("aspect-auto w-full", className)}>
      <AreaChart data={data} margin={{ top: 8, left: 0, right: 8, bottom: 0 }}>
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          interval={tickEvery - 1}
          tickMargin={6}
          fontSize={10}
          padding={{ left: 16, right: 16 }}
        />
        <ChartTooltip
          cursor={{ stroke: "var(--border)" }}
          content={<ChartTooltipContent labelFormatter={tooltipLabel} formatter={tooltipRow(unit)} />}
        />
        <Area
          dataKey="value"
          name={name}
          type="linear"
          stroke="var(--color-value)"
          strokeWidth={2}
          fill={`url(#${fillId})`}
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}

const ROW_HEIGHT = 26;

// 가로 막대. 값은 오른쪽 축에 적는다 (막대 끝 라벨은 폭 0인 막대에서 안 그려져서 0명 줄이 비었다).
export function HBarChart({ data, name, unit = "명" }: { data: ChartRow[]; name: string; unit?: string }) {
  const config = { value: { label: name, color: "var(--chart-1)" } } satisfies ChartConfig;
  const height = data.length * ROW_HEIGHT;

  return (
    <ChartContainer config={config} className="aspect-auto w-full" style={{ height }}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, left: 0, right: 0, bottom: 0 }} barCategoryGap={6}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="label" width={80} tickLine={false} axisLine={false} fontSize={11} />
        <YAxis
          yAxisId="total"
          orientation="right"
          type="category"
          dataKey="label"
          width={44}
          tickLine={false}
          axisLine={false}
          fontSize={11}
          tick={{ className: "fill-slate-300 tabular-nums" }}
          tickFormatter={(_, i) => `${data[i]?.value}${unit}`}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={tooltipRow(unit)} />} />
        <Bar dataKey="value" name={name} fill="var(--color-value)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

export type SliceRow = { key: string; label: string; value: number; color: string };

// 도넛. 조각마다 이름·비율을 바깥에 직접 적어서 색이 비슷해도 구분된다. 가운데는 합계.
export function DonutChart({ data, unit = "명", className = "h-64" }: { data: SliceRow[]; unit?: string; className?: string }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const config: ChartConfig = Object.fromEntries(data.map((d) => [d.label, { label: d.label, color: d.color }]));
  return (
    <ChartContainer config={config} className={cn("aspect-auto w-full", className)}>
      <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <ChartTooltip content={<ChartTooltipContent hideLabel formatter={tooltipRow(unit)} />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius="45%"
          outerRadius="68%"
          paddingAngle={2}
          stroke="none"
          labelLine={{ stroke: "var(--border)" }}
          label={({ x, y, textAnchor, name, percent }) => (
            <text x={x} y={y} textAnchor={textAnchor} dominantBaseline="central" fontSize={11} className="fill-slate-300">
              {name} {Math.round((percent ?? 0) * 100)}%
            </text>
          )}
        >
          {data.map((d) => (
            <Cell key={d.key} fill={d.color} />
          ))}
          <Label
            content={({ viewBox }) =>
              viewBox && "cx" in viewBox ? (
                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                  <tspan x={viewBox.cx} dy={-4} className="fill-slate-100 text-lg font-semibold tabular-nums">
                    {total}
                  </tspan>
                  <tspan x={viewBox.cx} dy={18} className="fill-slate-500 text-[11px]">
                    {unit}
                  </tspan>
                </text>
              ) : null
            }
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
