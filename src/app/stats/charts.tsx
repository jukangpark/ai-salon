"use client";

import { useId } from "react";
import { Area, AreaChart, Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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
        <span className="h-0.5 w-3 shrink-0 rounded-full" style={{ background: item.color }} />
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

export type SplitRow = { label: string; 남: number; 여: number; total: number };

const ROW_HEIGHT = 26;

// 가로 막대. rows 가 SplitRow 면 남/여 누적, ChartRow 면 단일 값. 끝에 합계 라벨.
export function HBarChart(
  props:
    | { split: true; data: SplitRow[]; unit?: string }
    | { split?: false; data: ChartRow[]; name: string; unit?: string },
) {
  const unit = props.unit ?? "명";
  const label = (
    <LabelList
      dataKey={props.split ? "total" : "value"}
      position="right"
      fontSize={11}
      className="fill-slate-300 tabular-nums"
      formatter={(v) => `${v}${unit}`}
    />
  );
  const config: ChartConfig = props.split
    ? { 남: { label: "남", color: "var(--chart-male)" }, 여: { label: "여", color: "var(--chart-female)" } }
    : { value: { label: props.name, color: "var(--chart-1)" } };
  const height = props.data.length * ROW_HEIGHT + (props.split ? 32 : 0);

  return (
    <ChartContainer config={config} className="aspect-auto w-full" style={{ height }}>
      <BarChart data={props.data as object[]} layout="vertical" margin={{ top: 0, left: 0, right: 44, bottom: 0 }} barCategoryGap={6}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="label" width={80} tickLine={false} axisLine={false} fontSize={11} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={tooltipRow(unit)} />} />
        {props.split ? (
          <>
            <Bar dataKey="남" name="남" stackId="gender" fill="var(--color-남)" />
            <Bar dataKey="여" name="여" stackId="gender" fill="var(--color-여)" radius={[0, 4, 4, 0]}>
              {label}
            </Bar>
            <ChartLegend content={<ChartLegendContent />} />
          </>
        ) : (
          <Bar dataKey="value" name={props.name} fill="var(--color-value)" radius={[0, 4, 4, 0]}>
            {label}
          </Bar>
        )}
      </BarChart>
    </ChartContainer>
  );
}
