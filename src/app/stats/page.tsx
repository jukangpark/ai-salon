"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import { parseNick } from "@/lib/members";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

const stagger = {
  visible: { transition: { staggerChildren: 0.05 } },
};

// 살롱봇 서버(no-more-chatbot-server)의 공개 읽기 전용 API. 재실 멤버·봇 제외 기준, 시각은 unix 초.
const STATS_API_URL = "https://no-more.app/api/aisalon/stats";

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
};

const MEDALS = ["🥇", "🥈", "🥉"];
const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);
const fmtMonth = (ym: string) => {
  const [y, m] = ym.split("-");
  return `${y.slice(2)}.${m}`;
};
const fmtPeriod = (sec: number) =>
  new Date(sec * 1000).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul", month: "numeric", day: "numeric" });

function Card({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5 sm:p-6">
      <div className="flex items-baseline justify-between mb-4 gap-3">
        <p className="text-base font-semibold text-slate-100">{title}</p>
        {sub && <p className="text-xs text-slate-500 text-right">{sub}</p>}
      </div>
      {children}
    </motion.div>
  );
}

function Stat({ label, value, tone = "text-slate-200" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-sm font-semibold tabular-nums ${tone}`}>{value}</p>
    </div>
  );
}

// 가로 막대 한 줄. 남/여 스택은 segments 로, 단일 값은 value 로.
function BarRow({
  label,
  value,
  max,
  segments,
  suffix = "명",
}: {
  label: string;
  value: number;
  max: number;
  segments?: { value: number; className: string }[];
  suffix?: string;
}) {
  const width = max ? Math.max(value ? 2 : 0, (value / max) * 100) : 0;
  return (
    <li className="flex items-center gap-3 text-sm">
      <span className="w-16 shrink-0 text-slate-400 text-xs truncate">{label}</span>
      <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden flex">
        {segments ? (
          segments.map((s, i) => (
            <div
              key={i}
              className={`h-full ${s.className}`}
              style={{ width: `${max ? (s.value / max) * 100 : 0}%` }}
            />
          ))
        ) : (
          <div className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400" style={{ width: `${width}%` }} />
        )}
      </div>
      <span className="w-12 shrink-0 text-right text-slate-300 tabular-nums text-xs">
        {value}
        {suffix}
      </span>
    </li>
  );
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(STATS_API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((json: Stats) => setStats(json))
      .catch(() => setError(true));
  }, []);

  const maxAge = stats ? Math.max(1, ...stats.ages.map((a) => a.남 + a.여)) : 1;
  const maxRegion = stats ? Math.max(1, ...stats.regions.map((r) => r.total)) : 1;
  const maxRank = stats ? Math.max(1, ...stats.ranks.map((r) => r.count)) : 1;
  const maxMbti = stats ? Math.max(1, ...stats.mbti.map((m) => m.count)) : 1;
  const maxJoin = stats ? Math.max(1, ...stats.joins.map((j) => j.count)) : 1;
  const maxChat = stats ? Math.max(1, ...stats.chat.top.map((c) => c.count)) : 1;
  const recentJoins = stats ? stats.joins.slice(-12) : [];

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Nav />

      <div className="fixed inset-0 pointer-events-none">
        <div className="animate-float absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="animate-float-delay absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>
      <div className="fixed inset-0 noise opacity-50 pointer-events-none" />

      <section className="relative pt-32 pb-10 px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-slate-400 font-medium">
              📊 현재 방 기준 {stats ? `${stats.members.total}명` : ""}
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            <span className="gradient-text">통계</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-slate-500 text-sm">
            살롱에 지금 함께 있는 멤버들의 구성과 활동을 숫자로 봐요. 나간 분은 집계에서 빠져요.
          </motion.p>
        </motion.div>
      </section>

      <section className="relative px-6 pb-32">
        <div className="max-w-3xl mx-auto">
          {error && (
            <div className="glass-card rounded-2xl p-6 text-center text-sm text-slate-400">
              통계를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
            </div>
          )}
          {!stats && !error && (
            <div className="glass-card rounded-2xl p-6 text-center text-sm text-slate-500">불러오는 중…</div>
          )}

          {stats && (
            <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col gap-4">
              {/* 요약 */}
              <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Stat label="멤버" value={`${stats.members.total}명`} />
                <Stat
                  label="성비 (남 : 여)"
                  value={`${stats.members.male} : ${stats.members.female}`}
                  tone="text-pink-300"
                />
                <Stat label="평균 나이" value={`${stats.members.avgAge}세`} tone="text-amber-300" />
                <Stat label="누적 채팅" value={`${stats.chat.total.toLocaleString()}회`} tone="text-cyan-300" />
              </motion.div>

              {/* 성비 */}
              <Card title="👫 성비" sub={`정규 닉 ${stats.members.parsed}명 기준`}>
                <div className="h-3 rounded-full overflow-hidden flex bg-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-sky-400"
                    style={{ width: `${pct(stats.members.male, stats.members.parsed)}%` }}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-rose-400"
                    style={{ width: `${pct(stats.members.female, stats.members.parsed)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-400">
                  <span>
                    남 {stats.members.male}명 ({pct(stats.members.male, stats.members.parsed)}%)
                  </span>
                  <span>
                    여 {stats.members.female}명 ({pct(stats.members.female, stats.members.parsed)}%)
                  </span>
                </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 나이대 */}
                <Card title="🎂 나이대" sub={`중앙값 ${stats.members.medianAge}세`}>
                  <ul className="space-y-2">
                    {stats.ages.map((a) => (
                      <BarRow
                        key={a.bucket}
                        label={a.bucket}
                        value={a.남 + a.여}
                        max={maxAge}
                        segments={[
                          { value: a.남, className: "bg-sky-400" },
                          { value: a.여, className: "bg-rose-400" },
                        ]}
                      />
                    ))}
                  </ul>
                  <p className="mt-3 text-[11px] text-slate-600">
                    <span className="inline-block w-2 h-2 rounded-full bg-sky-400 mr-1" />남
                    <span className="inline-block w-2 h-2 rounded-full bg-rose-400 ml-3 mr-1" />여
                  </p>
                </Card>

                {/* 지역 */}
                <Card title="📍 지역" sub="닉네임 기준">
                  <ul className="space-y-2">
                    {stats.regions.slice(0, 8).map((r) => (
                      <BarRow
                        key={r.region}
                        label={r.region}
                        value={r.total}
                        max={maxRegion}
                        segments={[
                          { value: r.남, className: "bg-sky-400" },
                          { value: r.여, className: "bg-rose-400" },
                        ]}
                      />
                    ))}
                  </ul>
                </Card>
              </div>

              {/* 계급 분포 */}
              <Card title="🏅 계급 분포" sub="채팅 수로 오르는 레벨의 티어">
                <ul className="space-y-2">
                  {stats.ranks.map((r) => (
                    <BarRow key={r.rank} label={`${r.emoji} ${r.rank}`} value={r.count} max={maxRank} />
                  ))}
                </ul>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 채팅 TOP */}
                <Card title="💬 채팅 TOP 10" sub={`최근 7일 활동 ${stats.chat.active.d7}명 · 30일 ${stats.chat.active.d30}명`}>
                  <ol className="space-y-2">
                    {stats.chat.top.map((c, i) => {
                      const p = parseNick(c.name);
                      return (
                        <li key={c.userId} className="flex items-center gap-3 text-sm">
                          <span className="w-6 shrink-0 text-center text-xs text-slate-500">{MEDALS[i] ?? i + 1}</span>
                          <Link
                            href={`/members/${c.userId}`}
                            className="w-24 shrink-0 truncate text-slate-200 hover:text-violet-300 transition-colors"
                          >
                            {p.name}
                          </Link>
                          <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-400 to-violet-400"
                              style={{ width: `${(c.count / maxChat) * 100}%` }}
                            />
                          </div>
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
                    <ul className="space-y-2">
                      {stats.mbti.slice(0, 8).map((m) => (
                        <BarRow key={m.type} label={m.type} value={m.count} max={maxMbti} />
                      ))}
                    </ul>
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
                    <div key={label} className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
                      <p className="text-xs text-slate-500 mb-1">{label}</p>
                      <p className="text-sm font-semibold text-slate-200 tabular-nums">
                        {n}명 <span className="text-xs text-slate-500 font-normal">({pct(n, stats.members.total)}%)</span>
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[11px] text-slate-600">
                  카톡에서 <span className="text-slate-400">/살롱봇 직업등록 [내용]</span> 처럼 등록할 수 있어요.
                </p>
              </Card>

              {/* 합류 추이 */}
              <Card title="🌱 월별 합류" sub="봇이 처음 본 시점 기준 · 최근 12개월">
                {recentJoins.length === 0 ? (
                  <p className="text-sm text-slate-500">아직 데이터가 없어요.</p>
                ) : (
                  <div>
                    <div className="flex gap-1.5">
                      {recentJoins.map((j) => (
                        <span key={j.month} className="flex-1 min-w-0 text-center text-[10px] text-slate-400 tabular-nums">
                          {j.count || ""}
                        </span>
                      ))}
                    </div>
                    {/* 막대는 고정 높이 컨테이너의 직접 자식이어야 % 높이가 풀린다 (flex-col 안에 넣으면 0 이 된다) */}
                    <div className="flex items-end gap-1.5 h-28 mt-1">
                      {recentJoins.map((j) => (
                        <div
                          key={j.month}
                          className="flex-1 min-w-0 rounded-t-md bg-gradient-to-t from-emerald-500/60 to-emerald-300"
                          style={{ height: `${Math.max(j.count ? 4 : 1, (j.count / maxJoin) * 100)}%` }}
                          title={`${j.month}: ${j.count}명`}
                        />
                      ))}
                    </div>
                    <div className="flex gap-1.5 mt-1">
                      {recentJoins.map((j) => (
                        <span key={j.month} className="flex-1 min-w-0 text-center text-[10px] text-slate-600 tabular-nums">
                          {fmtMonth(j.month)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* 스터디 */}
              <Card
                title="📚 스터디 인증"
                sub={`이번 기간 ${fmtPeriod(stats.study.periodStart)} ~ ${fmtPeriod(stats.study.periodEnd - 1)}`}
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <Stat label={`이번 기간 달성 (${stats.study.required}회↑)`} value={`${stats.study.achieved}명`} tone="text-emerald-300" />
                  <Stat label="진행 중" value={`${stats.study.inProgress}명`} />
                  <Stat label="누적 인증" value={`${stats.study.totalCerts}회`} />
                  <Stat label="참여 멤버" value={`${stats.study.participants}명`} />
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
                <p className="mt-3 text-[11px] text-slate-600">
                  달력과 전체 현황은{" "}
                  <Link href="/study" className="text-emerald-300/80 hover:text-emerald-200">
                    스터디 페이지
                  </Link>
                  에서 볼 수 있어요.
                </p>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
