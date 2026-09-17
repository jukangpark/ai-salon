"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";

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
                  return (
                    <motion.div
                      key={`${m.name}-${i}`}
                      variants={fadeUp}
                      className={`glass-card rounded-2xl px-5 py-4 border ${
                        done ? "border-emerald-500/25" : "border-white/5"
                      }`}
                    >
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
