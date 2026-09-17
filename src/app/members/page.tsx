"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import { MEMBERS_API_URL, fmtAgo, parseNick, type Member } from "@/lib/members";

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

type SortKey = "chat" | "study" | "recent";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "chat", label: "💬 채팅순" },
  { key: "study", label: "📚 스터디순" },
  { key: "recent", label: "🕒 최근 활동순" },
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("chat");

  useEffect(() => {
    fetch(MEMBERS_API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((json: { members: Member[] }) => setMembers(json.members))
      .catch(() => setError(true));
  }, []);

  const list = useMemo(() => {
    if (!members) return [];
    const needle = query.trim().toLowerCase();
    const searched = needle
      ? members.filter((m) => {
          const p = parseNick(m.name);
          return [p.name, p.age, p.region, m.job, m.mbti, m.hobby, m.introduction].some((v) =>
            v?.toLowerCase().includes(needle),
          );
        })
      : members;
    // 서버가 채팅순으로 주므로 나머지 정렬만 여기서 한다. 같으면 채팅순 유지.
    if (sort === "study")
      return [...searched].sort((a, b) => b.studyCertCount - a.studyCertCount || b.chatCount - a.chatCount);
    if (sort === "recent")
      return [...searched].sort((a, b) => (b.lastSeenAt ?? 0) - (a.lastSeenAt ?? 0));
    return searched;
  }, [members, query, sort]);

  const totalChat = members?.reduce((s, m) => s + m.chatCount, 0) ?? 0;
  const totalStudy = members?.reduce((s, m) => s + m.studyCertCount, 0) ?? 0;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Nav />

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="animate-float absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="animate-float-delay absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[120px]" />
      </div>

      {/* Noise overlay */}
      <div className="fixed inset-0 noise opacity-50 pointer-events-none" />

      {/* Header */}
      <section className="relative pt-32 pb-10 px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-slate-400 font-medium">
              👥 현재 방에 있는 멤버 {members ? `${members.length}명` : ""}
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            <span className="gradient-text">둘러보기</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-slate-500 text-sm">
            채팅 수, 레벨, 스터디 인증까지 한눈에. 이름을 누르면 프로필로 이동해요.
          </motion.p>
        </motion.div>
      </section>

      <section className="relative px-6 pb-32">
        <div className="max-w-3xl mx-auto">
          {error && (
            <div className="glass-card rounded-2xl p-6 text-center text-sm text-slate-400">
              멤버 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
            </div>
          )}
          {!members && !error && (
            <div className="glass-card rounded-2xl p-6 text-center text-sm text-slate-500">불러오는 중…</div>
          )}

          {members && (
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              {/* Summary */}
              <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3 mb-6">
                <div className="glass-card rounded-2xl p-4 sm:p-5">
                  <p className="text-xs text-slate-500 mb-1">멤버</p>
                  <p className="text-sm font-semibold text-slate-200 tabular-nums">{members.length}명</p>
                </div>
                <div className="glass-card rounded-2xl p-4 sm:p-5">
                  <p className="text-xs text-slate-500 mb-1">누적 채팅</p>
                  <p className="text-sm font-semibold text-cyan-300 tabular-nums">{totalChat.toLocaleString()}회</p>
                </div>
                <div className="glass-card rounded-2xl p-4 sm:p-5">
                  <p className="text-xs text-slate-500 mb-1">누적 스터디 인증</p>
                  <p className="text-sm font-semibold text-emerald-300 tabular-nums">{totalStudy}회</p>
                </div>
              </motion.div>

              {/* Controls */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="이름, 나이, 지역, 직업으로 검색…"
                  className="flex-1 glass-card rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-violet-400/40"
                />
                <div className="flex gap-1 glass-card rounded-xl p-1">
                  {SORTS.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setSort(s.key)}
                      className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        sort === s.key ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* List */}
              {list.length === 0 ? (
                <div className="glass-card rounded-2xl p-8 text-center text-sm text-slate-500">
                  “{query}” 검색 결과가 없어요.
                </div>
              ) : (
                <div className="space-y-2">
                  {list.map((m, i) => {
                    const p = parseNick(m.name);
                    const tags = [
                      p.age ? `${p.age}년생` : null,
                      p.region,
                      p.gender === "남" ? "남자" : p.gender === "여" ? "여자" : null,
                      m.mbti,
                    ].filter(Boolean) as string[];
                    return (
                      <motion.div key={m.userId} variants={fadeUp}>
                        <Link
                          href={`/members/${encodeURIComponent(m.userId)}`}
                          className="glass-card rounded-2xl border border-white/5 hover:border-violet-400/30 transition-colors px-4 sm:px-5 py-3.5 flex items-center gap-3"
                        >
                          <span className="w-6 text-xs text-slate-500 tabular-nums">{i + 1}</span>
                          <span className="text-lg" title={`${m.tier} · Lv.${m.level}`}>
                            {m.tierEmoji}
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-slate-100">{p.name}</span>
                              <span className="text-[11px] text-slate-500">Lv.{m.level}</span>
                            </span>
                            <span className="flex flex-wrap gap-1 mt-1">
                              {tags.map((t) => (
                                <span
                                  key={t}
                                  className="px-1.5 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-400"
                                >
                                  {t}
                                </span>
                              ))}
                            </span>
                          </span>
                          <span className="shrink-0 flex flex-col items-end gap-0.5 text-xs tabular-nums">
                            <span className="text-cyan-300 font-semibold">💬 {m.chatCount.toLocaleString()}</span>
                            <span className="text-emerald-300">📚 {m.studyCertCount}</span>
                          </span>
                          <span className="hidden sm:block w-16 text-right text-[11px] text-slate-500 shrink-0">
                            {fmtAgo(m.lastSeenAt)}
                          </span>
                          <span className="text-slate-600">›</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
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
