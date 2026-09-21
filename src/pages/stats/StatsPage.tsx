import { useEffect, useState } from "react";
import { Link } from "react-router";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import Notice from "@/components/Notice";
import { BlockSkeleton, StatCardsSkeleton } from "@/components/Skeletons";
import StatCard from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card as CardRoot, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MEDALS, WEEKDAYS } from "@/lib/constants";
import { STATS_API_URL, fetchJson, peekJson } from "@/lib/api";
import { MEMBERS_API_URL, fmtAgo, parseNick, type Member } from "@/lib/members";
import { ColumnChart, DonutChart, HBarChart, TrendChart } from "./charts";

// 살롱봇 서버(no-more-chatbot-server)의 공개 읽기 전용 API. 재실 멤버·봇 제외 기준, 시각은 unix 초.

type Stats = {
  generatedAt: number;
  members: { total: number; parsed: number; male: number; female: number; avgAge: number; medianAge: number };
  ages: { bucket: string; 남: number; 여: number }[];
  regions: { region: string; 남: number; 여: number; total: number }[];
  ranks: { rank: string; emoji: string; minLevel: number; count: number }[];
  chat: {
    total: number;
    top: { userId: string; name: string; count: number; level: number }[];
    active: { d7: number; d30: number };
    activity: ChatActivity;
  };
  profile: { job: number; introduction: number; mbti: number; hobby: number; any: number };
  mbti: { type: string; count: number }[];
  joins: { month: string; count: number }[];
  study: {
    periodStart: number;
    periodEnd: number;
    required: number;
    achieved: number;
    inProgress: number;
    totalCerts: number;
    participants: number;
    top: { name: string; count: number }[];
  };
  moim?: MoimStats; // 서버 배포 전 응답엔 없을 수 있다
};

// 정모(벙) — 벙별 인원은 나간 분도 포함, TOP 은 재실 멤버만. date 는 KST YYYY-MM-DD.
type MoimStats = {
  total: number;
  attendances: number;
  avgAttendees: number;
  participants: number;
  list: { postId: string; date: string | null; title: string | null; location: string | null; count: number }[];
  top: { userId: string; name: string; count: number }[];
  locations: { location: string; count: number }[];
};

type MonthlyRankRow = { month: string; userId: string; name: string; count: number; present: boolean };

type ChatActivity = {
  totalMessages: number;
  firstDay: string | null;
  averages: { perDay30: number; perDayAll: number; speakers30: number; perSpeaker30: number; perMember: number };
  peakHour: number | null;
  peakWeekday: number | null;
  busiestDay: { day: string; count: number } | null;
  hourly: { hour: number; count: number }[];
  weekday: { weekday: number; count: number }[];
  daily: { day: string; count: number; speakers: number }[];
  monthly: {
    months: { month: string; total: number; participants: number }[];
    ranking: Record<string, MonthlyRankRow[]>;
  };
};

const fmtHour = (h: number) => `${h < 12 ? "오전" : "오후"} ${h % 12 || 12}시`;
const fmtDay = (d: string) => {
  const [, m, day] = d.split("-");
  return `${Number(m)}/${Number(day)}`;
};
const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);
// KST 날짜(YYYY-MM-DD) 로부터 며칠 지났나
const daysAgo = (ymd: string) => Math.floor((Date.now() - new Date(`${ymd}T00:00:00+09:00`).getTime()) / 86400000);
const fmtMonth = (ym: string) => {
  const [y, m] = ym.split("-");
  return `${y.slice(2)}.${m}`;
};
// 광주 5개 구. 닉네임에 "광산"처럼 '구'를 빼고 적은 경우를 합친다. 색은 구마다 고정.
const DISTRICTS = ["북구", "서구", "광산구", "남구", "동구"];
// Tailwind 가 안 쓰인 CSS 변수를 지우므로 변수 이름을 조합하지 말고 그대로 적는다.
const DISTRICT_COLORS = [
  "var(--chart-region-1)",
  "var(--chart-region-2)",
  "var(--chart-region-3)",
  "var(--chart-region-4)",
  "var(--chart-region-5)",
];
const normalizeRegion = (region: string) => (DISTRICTS.includes(`${region}구`) ? `${region}구` : region);
const mergeRegions = (regions: Stats["regions"]) => {
  const byName = new Map<string, Stats["regions"][number]>();
  for (const r of regions) {
    const name = normalizeRegion(r.region);
    const prev = byName.get(name);
    byName.set(
      name,
      prev
        ? { region: name, 남: prev.남 + r.남, 여: prev.여 + r.여, total: prev.total + r.total }
        : { ...r, region: name },
    );
  }
  return [...byName.values()].sort((a, b) => b.total - a.total);
};
const regionColor = (region: string) => {
  const i = DISTRICTS.indexOf(region);
  return DISTRICT_COLORS[i] ?? "var(--chart-other)";
};

const fmtPeriod = (sec: number) =>
  new Date(sec * 1000).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul", month: "numeric", day: "numeric" });

// 월 선택 탭 — 활성 달만 옅은 흰 배경.
const MONTH_TAB =
  "h-auto flex-none rounded-lg px-2.5 py-1 text-xs tabular-nums text-slate-500 hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-white/10";

function Card({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <CardRoot className="glass-card gap-4 rounded-2xl p-5 shadow-none sm:p-6">
      <CardHeader className="flex items-baseline justify-between gap-3 px-0">
        <CardTitle className="text-base text-slate-100">{title}</CardTitle>
        {sub && <CardDescription className="text-xs text-slate-500 text-right">{sub}</CardDescription>}
      </CardHeader>
      <CardContent className="px-0">{children}</CardContent>
    </CardRoot>
  );
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(() => peekJson<Stats>(STATS_API_URL) ?? null);
  const [members, setMembers] = useState<Member[] | null>(
    () => peekJson<{ members: Member[] }>(MEMBERS_API_URL)?.members ?? null,
  );
  const [error, setError] = useState(false);
  const [rankMonth, setRankMonth] = useState<string | null>(null);

  useEffect(() => {
    fetchJson<Stats>(STATS_API_URL)
      .then((json) => setStats(json))
      .catch(() => setError(true));
  }, []);

  // 벙 참석 현황은 멤버 API 에만 있어서(통계 API 는 TOP 만 준다) 따로 받아 온다.
  useEffect(() => {
    fetchJson<{ members: Member[] }>(MEMBERS_API_URL)
      .then((json) => setMembers(json.members))
      .catch(() => setMembers([]));
  }, []);

  const maxChat = stats ? Math.max(1, ...stats.chat.top.map((c) => c.count)) : 1;
  const recentJoins = stats ? stats.joins.slice(-12) : [];
  const regions = stats ? mergeRegions(stats.regions) : [];
  const act = stats?.chat.activity;
  const rankMonths = act ? act.monthly.months.map((m) => m.month).filter((m) => act.monthly.ranking[m]?.length) : [];
  const shownRankMonth = rankMonth ?? rankMonths[rankMonths.length - 1] ?? null;
  const moim = stats?.moim;
  const maxMoim = moim ? Math.max(1, ...moim.top.map((t) => t.count)) : 1;
  // 날짜 없는 정모(날짜가 안 잡힌 공지글 등)가 섞여 들어오므로, 있는 날짜만으로 기간을 만든다.
  const moimDates = (moim?.list ?? []).map((m) => m.date).filter((d): d is string => !!d).sort();
  const moimRange = moimDates.length ? `${fmtDay(moimDates[0])} ~ ${fmtDay(moimDates[moimDates.length - 1])}` : null;
  // 벙에 안 온 지 오래된 순 — 한 번도 안 온 분(합류 오래된 순)이 먼저, 그다음 마지막 참석이 오래된 순.
  const absentees = (members ?? [])
    .map((m) => ({ m, last: m.recentMoims?.[0]?.date ?? null }))
    .sort((a, b) => {
      if (!a.last !== !b.last) return a.last ? 1 : -1;
      if (!a.last || !b.last) return (a.m.firstSeenAt ?? 0) - (b.m.firstSeenAt ?? 0);
      return a.last.localeCompare(b.last);
    });
  const neverCount = absentees.filter((a) => !a.last).length;

  return (
    <PageShell>
      <PageHeader
        className="pb-10"
        badge={`📊 현재 방 기준 ${stats ? `${stats.members.total}명` : ""}`}
        title="통계"
        description="살롱에 지금 함께 있는 멤버들의 구성과 활동을 숫자로 봐요. 나간 분은 집계에서 빠져요."
      />

      <section className="relative px-4 sm:px-6 pb-32">
        <div className="max-w-3xl mx-auto">
          {error && <Notice className="text-slate-400">통계를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</Notice>}
          {!stats && !error && (
            <div className="flex flex-col gap-4">
              <StatCardsSkeleton count={4} className="grid-cols-2 sm:grid-cols-4" />
              <BlockSkeleton className="h-72" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BlockSkeleton className="h-72" />
                <BlockSkeleton className="h-72" />
              </div>
            </div>
          )}

          {stats && (
            <div className="flex flex-col gap-4">
              {/* 요약 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard label="멤버" value={`${stats.members.total}명`} />
                <StatCard
                  label="성비 (남 : 여)"
                  value={`${stats.members.male} : ${stats.members.female}`}
                />
                <StatCard label="평균 나이" value={`${stats.members.avgAge}세`} />
                <StatCard label="누적 채팅" value={`${stats.chat.total.toLocaleString()}회`} tone="text-cyan-300" />
              </div>

              {/* 성비 */}
              <Card title="👫 성비" sub={`정규 닉 ${stats.members.parsed}명 기준`}>
                <DonutChart
                  data={[
                    { key: "male", label: "남", value: stats.members.male, color: "var(--chart-male)" },
                    { key: "female", label: "여", value: stats.members.female, color: "var(--chart-female)" },
                  ]}
                />
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 나이대 */}
                <Card title="🎂 나이대" sub={`중앙값 ${stats.members.medianAge}세`}>
                  <HBarChart
                    name="인원"
                    data={stats.ages.map((a) => ({ key: a.bucket, label: a.bucket, value: a.남 + a.여 }))}
                  />
                </Card>

                {/* 지역 */}
                <Card title="📍 지역" sub="닉네임 기준">
                  <HBarChart
                    name="인원"
                    data={regions.slice(0, 8).map((r) => ({ key: r.region, label: r.region, value: r.total }))}
                  />
                </Card>
              </div>

              {/* 지역 비율 */}
              <Card title="🗺️ 지역 비율" sub={`닉네임 기준 ${regions.reduce((s, r) => s + r.total, 0)}명`}>
                <DonutChart
                  data={regions.map((r) => ({
                    key: r.region,
                    label: r.region,
                    value: r.total,
                    color: regionColor(r.region),
                  }))}
                />
              </Card>

              {/* 계급 분포 */}
              <Card title="🏅 계급 분포" sub="채팅 수로 오르는 레벨의 티어">
                <HBarChart
                  name="인원"
                  data={stats.ranks.map((r) => ({ key: r.rank, label: `${r.emoji} ${r.rank}`, value: r.count }))}
                />
              </Card>

              {/* 정모 */}
              {moim && moim.total > 0 && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard label="정모 횟수" value={`${moim.total}회`} tone="text-violet-300" />
                    <StatCard label="누적 참석" value={`${moim.attendances}명`} tone="text-violet-300" />
                    <StatCard label="평균 참석" value={`${moim.avgAttendees}명`} tone="text-violet-300" />
                    <StatCard label="한 번이라도 온 사람" value={`${moim.participants}명`} tone="text-violet-300" />
                  </div>

                  <Card title="☕ 정모별 참석 인원" sub={moimRange ?? undefined}>
                    <ColumnChart
                      name="참석"
                      unit="명"
                      data={moim.list.map((m) => ({
                        key: m.postId,
                        label: m.date ? fmtDay(m.date) : "?",
                        value: m.count,
                        tooltipLabel: [m.date, m.title].filter(Boolean).join(" "),
                      }))}
                    />
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card title="🏆 벙 참석 TOP 10" sub="지금 방에 있는 멤버 기준">
                      <ol className="space-y-2">
                        {moim.top.map((t, i) => (
                          <li key={t.userId} className="flex items-center gap-3 text-sm">
                            <span className="w-6 shrink-0 text-center text-xs text-slate-500">{MEDALS[i] ?? i + 1}</span>
                            <Link
                              to={`/members/${t.userId}`}
                              className="w-20 shrink-0 truncate text-slate-200 hover:text-violet-300 transition-colors"
                            >
                              {parseNick(t.name).name}
                            </Link>
                            <Progress
                              value={(t.count / maxMoim) * 100}
                              className="flex-1 bg-white/5"
                              indicatorClassName="bg-gradient-to-r from-violet-500 to-violet-400"
                            />
                            <span className="w-10 shrink-0 text-right text-xs text-slate-400 tabular-nums">{t.count}회</span>
                          </li>
                        ))}
                      </ol>
                    </Card>

                    <Card title="📍 정모 장소" sub={`${moim.locations.length}곳`}>
                      <ol className="space-y-1.5">
                        {moim.locations.map((l) => (
                          <li key={l.location} className="flex items-center gap-3 text-sm">
                            <span className="flex-1 min-w-0 truncate text-slate-300">{l.location}</span>
                            <span className="text-xs text-slate-400 tabular-nums">{l.count}회</span>
                          </li>
                        ))}
                      </ol>
                    </Card>
                  </div>

                </>
              )}

              {/* 대화 활동 */}
              {act && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard label="하루 평균 발화 (최근 30일)" value={`${act.averages.perDay30}회`} tone="text-cyan-300" />
                    <StatCard label="하루 평균 발화 (전체)" value={`${act.averages.perDayAll}회`} tone="text-violet-300" />
                    <StatCard
                      label="최근 30일 말한 사람"
                      value={`${act.averages.speakers30}명 · 1인 ${act.averages.perSpeaker30}회`}
                      tone="text-cyan-300"
                    />
                    <StatCard
                      label="가장 활발했던 날"
                      value={act.busiestDay ? `${fmtDay(act.busiestDay.day)} · ${act.busiestDay.count}회` : "-"}
                      tone="text-cyan-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card
                      title="🕒 시간대별 발화량"
                      sub={act.peakHour !== null ? `가장 활발: ${fmtHour(act.peakHour)}` : undefined}
                    >
                      <ColumnChart
                        name="발화"
                        unit="회"
                        showValues={false}
                        tickEvery={3}
                        data={act.hourly.map((h) => ({
                          key: String(h.hour),
                          label: String(h.hour),
                          value: h.count,
                          highlight: h.hour === act.peakHour,
                          tooltipLabel: fmtHour(h.hour),
                        }))}
                      />
                    </Card>
                    <Card
                      title="📅 요일별 발화량"
                      sub={act.peakWeekday !== null ? `가장 활발: ${WEEKDAYS[act.peakWeekday]}요일` : undefined}
                    >
                      <ColumnChart
                        name="발화"
                        unit="회"
                        data={act.weekday.map((w) => ({
                          key: String(w.weekday),
                          label: WEEKDAYS[w.weekday],
                          value: w.count,
                          highlight: w.weekday === act.peakWeekday,
                          tooltipLabel: `${WEEKDAYS[w.weekday]}요일`,
                        }))}
                      />
                    </Card>
                  </div>

                  <Card
                    title="📈 최근 60일 발화 추이"
                    sub={`60일 합계 ${act.daily.reduce((s, d) => s + d.count, 0).toLocaleString()}회`}
                  >
                    <TrendChart
                      name="발화"
                      unit="회"
                      tickEvery={10}
                      data={act.daily.map((d) => ({
                        key: d.day,
                        label: fmtDay(d.day),
                        value: d.count,
                        tooltipLabel: d.day,
                        note: `${d.speakers}명`,
                      }))}
                    />
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card title="🗓️ 월별 발화량" sub={act.firstDay ? `${fmtDay(act.firstDay)} 부터 집계` : undefined}>
                      <ColumnChart
                        name="발화"
                        unit="회"
                        data={act.monthly.months.map((m) => ({
                          key: m.month,
                          label: fmtMonth(m.month),
                          value: m.total,
                          note: `${m.participants}명`,
                        }))}
                      />
                    </Card>

                    <Card title="🏆 월별 채팅 랭킹" sub="나간 분도 그 달 기록엔 남아요">
                      {shownRankMonth ? (
                        <Tabs value={shownRankMonth} onValueChange={setRankMonth} className="gap-3">
                          <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0 group-data-[orientation=horizontal]/tabs:h-auto">
                            {rankMonths.map((m) => (
                              <TabsTrigger key={m} value={m} className={MONTH_TAB}>
                                {fmtMonth(m)}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                          <TabsContent value={shownRankMonth}>
                            <ol className="space-y-1.5">
                              {act.monthly.ranking[shownRankMonth].map((r, i) => (
                                <li key={r.userId} className="flex items-center gap-3 text-sm">
                                  <span className="w-6 shrink-0 text-center text-xs text-slate-500">{MEDALS[i] ?? i + 1}</span>
                                  {r.present ? (
                                    <Link
                                      to={`/members/${r.userId}`}
                                      className="flex-1 truncate text-slate-200 hover:text-violet-300 transition-colors"
                                    >
                                      {parseNick(r.name).name}
                                    </Link>
                                  ) : (
                                    <span className="flex-1 truncate text-slate-500">
                                      {parseNick(r.name).name} <span className="text-[11px]">(나감)</span>
                                    </span>
                                  )}
                                  <span className="text-xs text-slate-400 tabular-nums">{r.count.toLocaleString()}회</span>
                                </li>
                              ))}
                            </ol>
                          </TabsContent>
                        </Tabs>
                      ) : (
                        <p className="text-sm text-slate-500">아직 집계된 달이 없어요.</p>
                      )}
                    </Card>
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 채팅 TOP */}
                <Card title="💬 누적 채팅 TOP 10" sub={`최근 7일 활동 ${stats.chat.active.d7}명 · 30일 ${stats.chat.active.d30}명`}>
                  <ol className="space-y-2">
                    {stats.chat.top.map((c, i) => {
                      const p = parseNick(c.name);
                      return (
                        <li key={c.userId} className="flex items-center gap-3 text-sm">
                          <span className="w-6 shrink-0 text-center text-xs text-slate-500">{MEDALS[i] ?? i + 1}</span>
                          <Link
                            to={`/members/${c.userId}`}
                            className="w-24 shrink-0 truncate text-slate-200 hover:text-violet-300 transition-colors"
                          >
                            {p.name}
                          </Link>
                          <Progress
                            value={(c.count / maxChat) * 100}
                            className="flex-1 bg-white/5"
                            indicatorClassName="bg-gradient-to-r from-cyan-400 to-violet-400"
                          />
                          <span className="w-16 shrink-0 text-right text-xs text-slate-400 tabular-nums">
                            {c.count.toLocaleString()}회
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </Card>

                {/* MBTI */}
                <Card title="🧠 MBTI" sub={`등록 ${stats.profile.mbti}명`}>
                  {stats.mbti.length === 0 ? (
                    <p className="text-sm text-slate-500">아직 등록된 MBTI가 없어요.</p>
                  ) : (
                    <HBarChart
                      name="인원"
                      data={stats.mbti.slice(0, 8).map((m) => ({ key: m.type, label: m.type, value: m.count }))}
                    />
                  )}
                </Card>
              </div>

              {/* 프로필 등록률 */}
              <Card title="🪪 프로필 등록률" sub={`하나라도 등록 ${pct(stats.profile.any, stats.members.total)}%`}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(
                    [
                      ["직업", stats.profile.job],
                      ["자기소개", stats.profile.introduction],
                      ["MBTI", stats.profile.mbti],
                      ["취미", stats.profile.hobby],
                    ] as const
                  ).map(([label, n]) => (
                    <CardRoot key={label} className="gap-1 rounded-xl border-white/5 bg-white/[0.03] p-3 shadow-none">
                      <CardDescription className="text-xs text-slate-500">{label}</CardDescription>
                      <CardTitle className="text-sm text-slate-200 tabular-nums">
                        {n}명 <span className="text-xs text-slate-500 font-normal">({pct(n, stats.members.total)}%)</span>
                      </CardTitle>
                    </CardRoot>
                  ))}
                </div>
                <p className="mt-3 text-xs text-slate-600">
                  카톡에서 <span className="text-slate-400">/살롱봇 직업등록 [내용]</span> 처럼 등록할 수 있어요.
                </p>
              </Card>

              {/* 합류 추이 */}
              <Card title="🌱 월별 합류" sub="봇이 처음 본 시점 기준 · 최근 12개월">
                {recentJoins.length === 0 ? (
                  <p className="text-sm text-slate-500">아직 데이터가 없어요.</p>
                ) : (
                  <ColumnChart
                    name="합류"
                    unit="명"
                    data={recentJoins.map((j) => ({
                      key: j.month,
                      label: fmtMonth(j.month),
                      value: j.count,
                      tooltipLabel: j.month,
                    }))}
                  />
                )}
              </Card>

              {/* 스터디 */}
              <Card
                title="📚 스터디 인증"
                sub={`이번 기간 ${fmtPeriod(stats.study.periodStart)} ~ ${fmtPeriod(stats.study.periodEnd - 1)}`}
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <StatCard label={`이번 기간 달성 (${stats.study.required}회↑)`} value={`${stats.study.achieved}명`} tone="text-emerald-300" />
                  <StatCard label="진행 중" value={`${stats.study.inProgress}명`} />
                  <StatCard label="누적 인증" value={`${stats.study.totalCerts}회`} />
                  <StatCard label="참여 멤버" value={`${stats.study.participants}명`} />
                </div>
                {stats.study.top.length > 0 && (
                  <ol className="space-y-1.5">
                    {stats.study.top.map((m, i) => (
                      <li key={`${m.name}-${i}`} className="flex items-center gap-3 text-sm">
                        <span className="w-6 text-center text-xs text-slate-500">{MEDALS[i] ?? i + 1}</span>
                        <span className="flex-1 truncate text-slate-300">{parseNick(m.name).name}</span>
                        <span className="text-xs text-slate-400 tabular-nums">{m.count}회</span>
                      </li>
                    ))}
                  </ol>
                )}
                <p className="mt-3 text-xs text-slate-600">
                  달력과 전체 현황은{" "}
                  <Link to="/study" className="text-emerald-300/80 hover:text-emerald-200">
                    스터디 페이지
                  </Link>
                  에서 볼 수 있어요.
                </p>
              </Card>

              {/* 벙 미참석 */}
              {absentees.length > 0 && (
                <Card
                  title="🪑 벙에 오래 안 온 멤버"
                  sub={`한 번도 안 온 ${neverCount}명 먼저 · 마지막 참석 오래된 순`}
                >
                  <ol className="space-y-1.5">
                    {absentees.map((a, i) => (
                      <li key={a.m.userId} className="flex items-center gap-3 text-sm">
                        <span className="w-6 shrink-0 text-center text-xs text-slate-500 tabular-nums">{i + 1}</span>
                        <Link
                          to={`/members/${a.m.userId}`}
                          className="min-w-0 flex-1 truncate text-slate-200 hover:text-violet-300 transition-colors"
                        >
                          {parseNick(a.m.name).name}
                          <span className="ml-2 text-xs text-slate-600">합류 {fmtAgo(a.m.firstSeenAt) ?? "-"}</span>
                        </Link>
                        {a.last ? (
                          <span className="shrink-0 text-xs text-slate-400 tabular-nums">
                            {fmtDay(a.last)} · {daysAgo(a.last)}일 전
                            <span className="ml-1.5 text-xs text-slate-600">({a.m.moimCount ?? 0}회)</span>
                          </span>
                        ) : (
                          <Badge className="rounded-md bg-rose-500/10 px-1.5 py-0.5 text-xs font-normal text-rose-300">
                            참석 없음
                          </Badge>
                        )}
                      </li>
                    ))}
                  </ol>
                </Card>
              )}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
