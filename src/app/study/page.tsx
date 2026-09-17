"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import { MEMBERS_API_URL, type Member } from "@/lib/members";

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

// 살롱봇 서버(no-more-chatbot-server)의 공개 읽기 전용 API. 시각은 unix 초.
const API_URL = "https://no-more.app/api/aisalon/study-cert";
const CALENDAR_URL = `${API_URL}/calendar`;
const RANKING_URL = `${API_URL}/ranking?limit=5`;

type StudyRanking = { members: { name: string; count: number }[] };

const MEDALS = ["🥇", "🥈", "🥉"];

// 전체 기간 인증 횟수 TOP5. 불러오지 못하거나 비어 있으면 아무것도 그리지 않는다.
function StudyRanking() {
  const [members, setMembers] = useState<StudyRanking["members"] | null>(null);

  useEffect(() => {
    fetch(RANKING_URL)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((json: StudyRanking) => setMembers(json.members))
      .catch(() => setMembers([]));
  }, []);

  if (!members || members.length === 0) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="glass-card rounded-2xl p-5 sm:p-6 mb-8"
    >
      <div className="flex items-baseline justify-between mb-4">
        <p className="text-base font-semibold text-slate-100">🏆 인증 랭킹 TOP 5</p>
        <p className="text-xs text-slate-500">전체 기간 누적</p>
      </div>
      <ol className="space-y-2">
        {members.map((m, i) => (
          <li
            key={`${m.name}-${i}`}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 border ${
              i === 0
                ? "border-amber-400/30 bg-amber-400/10"
                : "border-white/5 bg-white/[0.03]"
            }`}
          >
            <span className="w-7 text-center text-base tabular-nums">
              {MEDALS[i] ?? <span className="text-xs text-slate-500">{i + 1}</span>}
            </span>
            <span className="flex-1 min-w-0 truncate text-sm font-medium text-slate-200">
              {m.name}
            </span>
            <span
              className={`shrink-0 text-xs font-semibold tabular-nums ${
                i === 0 ? "text-amber-200" : "text-emerald-300"
              }`}
            >
              {m.count}회
            </span>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

type StudyCalendar = {
  month: string; // YYYY-MM (KST)
  firstMonth: string;
  currentMonth: string;
  days: { date: string; count: number; names: string[] }[];
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const shiftMonth = (month: string, diff: number) => {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + diff, 1));
  return d.toISOString().slice(0, 7);
};

// 그날 인증한 인원 수 → 히트맵 칸 색
const heatClass = (count: number) => {
  if (count === 0) return "bg-white/[0.03] text-slate-600";
  if (count === 1) return "bg-emerald-500/20 text-emerald-200";
  if (count === 2) return "bg-emerald-500/40 text-emerald-100";
  if (count === 3) return "bg-emerald-500/60 text-white";
  return "bg-emerald-400/85 text-slate-950";
};

function StudyHeatmap() {
  // null = 이번 달 (서버가 KST 기준으로 정한다)
  const [month, setMonth] = useState<string | null>(null);
  const [cal, setCal] = useState<StudyCalendar | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(month ? `${CALENDAR_URL}?month=${month}` : CALENDAR_URL)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((json: StudyCalendar) => {
        setCal(json);
        setError(false);
      })
      .catch(() => setError(true));
  }, [month]);

  const go = (diff: number) => {
    if (!cal) return;
    setSelected(null);
    setMonth(shiftMonth(cal.month, diff));
  };

  if (error && !cal) {
    return (
      <div className="glass-card rounded-2xl p-6 mb-8 text-center text-sm text-slate-400">
        달력을 불러오지 못했어요.
      </div>
    );
  }
  if (!cal) {
    return (
      <div className="glass-card rounded-2xl p-6 mb-8 text-center text-sm text-slate-500">
        달력 불러오는 중…
      </div>
    );
  }

  const [y, m] = cal.month.split("-").map(Number);
  const firstWeekday = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const byDate = new Map(cal.days.map((d) => [d.date, d]));
  const total = cal.days.reduce((sum, d) => sum + d.count, 0);
  const selectedDay = selected ? byDate.get(selected) : undefined;
  const canPrev = cal.month > cal.firstMonth;
  const canNext = cal.month < cal.currentMonth;

  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={!canPrev}
          aria-label="이전 달"
          className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5"
        >
          ‹
        </button>
        <div className="text-center">
          <p className="text-base font-semibold text-slate-100">
            {y}년 {m}월
          </p>
          <p className="text-xs text-slate-500">한 달 인증 {total}회</p>
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={!canNext}
          aria-label="다음 달"
          className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {WEEKDAYS.map((w) => (
          <span key={w} className="text-center text-[11px] text-slate-500">
            {w}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, i) => {
          if (day === null) return <span key={`blank-${i}`} />;
          const date = `${cal.month}-${String(day).padStart(2, "0")}`;
          const count = byDate.get(date)?.count ?? 0;
          return (
            <button
              key={date}
              type="button"
              onClick={() => setSelected(selected === date ? null : date)}
              title={`${m}월 ${day}일 · ${count}명 인증`}
              className={`aspect-square rounded-lg text-xs font-medium tabular-nums transition-transform hover:scale-105 ${heatClass(count)} ${
                selected === date ? "ring-2 ring-cyan-300" : ""
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-slate-500">
        <span>적음</span>
        {[0, 1, 2, 3, 4].map((c) => (
          <span key={c} className={`w-3 h-3 rounded ${heatClass(c)}`} />
        ))}
        <span>많음</span>
      </div>

      {selected && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-xs text-slate-500 mb-2">
            {Number(selected.slice(5, 7))}월 {Number(selected.slice(8))}일 인증{" "}
            {selectedDay?.count ?? 0}명
          </p>
          {selectedDay ? (
            <div className="flex flex-wrap gap-1.5">
              {selectedDay.names.map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-200"
                >
                  {name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-600">이날은 인증이 없어요.</p>
          )}
        </div>
      )}
    </div>
  );
}

type StudyCert = {
  periodStart: number;
  periodEnd: number;
  required: number;
  members: { name: string; count: number }[];
};

const fmtDate = (sec: number) =>
  new Date(sec * 1000).toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

const fmtRemaining = (secs: number) => {
  const d = Math.floor(secs / 86400);
  const h = Math.floor((secs % 86400) / 3600);
  if (d > 0) return `${d}일 ${h}시간`;
  const m = Math.floor((secs % 3600) / 60);
  return `${h}시간 ${m}분`;
};

export default function StudyPage() {
  const [data, setData] = useState<StudyCert | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [error, setError] = useState(false);
  // 스터디 인증 API엔 userId가 없어서 멤버 API의 닉네임으로 매칭한다. 못 찾으면 링크 없이 그린다.
  const [userIds, setUserIds] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    fetch(MEMBERS_API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((json: { members: Member[] }) =>
        setUserIds(new Map(json.members.map((m) => [m.name, m.userId]))),
      )
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((json: StudyCert) => {
        setData(json);
        // 기간 경계에서 음수가 되지 않게 0으로 막는다.
        setRemaining(Math.max(0, json.periodEnd - Math.floor(Date.now() / 1000)));
      })
      .catch(() => setError(true));
  }, []);

  const achieved = data?.members.filter((m) => m.count >= data.required).length ?? 0;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Nav />

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="animate-float absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[120px]" />
        <div className="animate-float-delay absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[120px]" />
      </div>

      {/* Noise overlay */}
      <div className="fixed inset-0 noise opacity-50 pointer-events-none" />

      {/* Header */}
      <section className="relative pt-32 pb-12 px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-3xl mx-auto"
        >
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-slate-400 font-medium">
              📚 2주에 {data?.required ?? 3}회 이상 &nbsp;·&nbsp; 하루 1회 인정
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
          >
            <span className="gradient-text">스터디 인증</span>
            <br />
            <span className="text-slate-100">이번 기간 현황</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-slate-500 text-sm">
            카카오톡 단톡방에서{" "}
            <code className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300 font-mono text-xs">
              /살롱봇 스터디인증
            </code>{" "}
            으로 인증하세요 ✨
          </motion.p>
        </motion.div>
      </section>

      <section className="relative px-6 pb-32">
        <div className="max-w-3xl mx-auto">
          <StudyRanking />
          <StudyHeatmap />

          {error && (
            <div className="glass-card rounded-2xl p-6 text-center text-sm text-slate-400">
              인증 현황을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
            </div>
          )}

          {!data && !error && (
            <div className="glass-card rounded-2xl p-6 text-center text-sm text-slate-500">
              불러오는 중…
            </div>
          )}

          {data && (
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              {/* Summary */}
              <motion.div
                variants={fadeUp}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
              >
                <div className="glass-card rounded-2xl p-5">
                  <p className="text-xs text-slate-500 mb-1">기간</p>
                  <p className="text-sm font-semibold text-slate-200">
                    {fmtDate(data.periodStart)} ~ {fmtDate(data.periodEnd - 1)}
                  </p>
                </div>
                <div className="glass-card rounded-2xl p-5">
                  <p className="text-xs text-slate-500 mb-1">남은 시간</p>
                  <p className="text-sm font-semibold text-cyan-300">
                    {fmtRemaining(remaining)}
                  </p>
                </div>
                <div className="glass-card rounded-2xl p-5">
                  <p className="text-xs text-slate-500 mb-1">달성 인원</p>
                  <p className="text-sm font-semibold text-emerald-300">
                    {achieved} / {data.members.length}명
                  </p>
                </div>
              </motion.div>

              {/* Members */}
              <div className="space-y-2">
                {data.members.map((m, i) => {
                  const done = m.count >= data.required;
                  const pct = Math.min(100, (m.count / data.required) * 100);
                  const userId = userIds.get(m.name);
                  const cardClass = `block glass-card rounded-2xl px-5 py-4 border ${
                    done ? "border-emerald-500/25" : "border-white/5"
                  }`;
                  const body = (
                    <>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-6 text-xs text-slate-500 tabular-nums">
                          {i + 1}
                        </span>
                        <span className="flex-1 min-w-0 truncate text-sm font-medium text-slate-200">
                          {m.name}
                        </span>
                        <span
                          className={`shrink-0 text-xs font-semibold tabular-nums ${
                            done ? "text-emerald-300" : "text-slate-400"
                          }`}
                        >
                          {done
                            ? `✅ ${m.count}회 달성`
                            : `${m.count}회 · ${data.required - m.count}회 남음`}
                        </span>
                      </div>
                      <div className="ml-9 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            done
                              ? "bg-gradient-to-r from-emerald-400 to-cyan-400"
                              : "bg-slate-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </>
                  );
                  return (
                    <motion.div key={`${m.name}-${i}`} variants={fadeUp}>
                      {userId ? (
                        <Link
                          href={`/members/${encodeURIComponent(userId)}`}
                          className={`${cardClass} hover:border-emerald-400/40 transition-colors`}
                        >
                          {body}
                        </Link>
                      ) : (
                        <div className={cardClass}>{body}</div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600 text-sm">
          <span className="font-semibold text-slate-500">AI 살롱 광주</span>
          <span>나 혼자 쓰면 기술, 함께 나누면 가치 🚀</span>
        </div>
      </footer>
    </main>
  );
}
