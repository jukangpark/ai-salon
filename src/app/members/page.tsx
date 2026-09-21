"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import Notice from "@/components/Notice";
import StatCard from "@/components/StatCard";
import { fadeUp, stagger } from "@/lib/motion";
import { fetchJson, peekJson } from "@/lib/api";
import { MEMBERS_API_URL, fmtAgo, fmtMoimDate, koreanAge, moimHref, parseNick, type Member } from "@/lib/members";

type SortKey = "chat" | "study";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "chat", label: "💬 채팅순" },
  { key: "study", label: "📚 스터디순" },
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[] | null>(
    () => peekJson<{ members: Member[] }>(MEMBERS_API_URL)?.members ?? null,
  );
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("chat");

  useEffect(() => {
    fetchJson<{ members: Member[] }>(MEMBERS_API_URL)
      .then((json) => setMembers(json.members))
      .catch(() => setError(true));
  }, []);

  const list = useMemo(() => {
    if (!members) return [];
    const needle = query.trim().toLowerCase();
    const searched = needle
      ? members.filter((m) => {
          const p = parseNick(m.name);
          return [p.name, p.age, String(koreanAge(p.age) ?? ""), p.region, m.job, m.mbti, m.hobby, m.introduction].some((v) =>
            v?.toLowerCase().includes(needle),
          );
        })
      : members;
    // 서버가 채팅순으로 주므로 나머지 정렬만 여기서 한다. 같으면 채팅순 유지.
    if (sort === "study")
      return [...searched].sort((a, b) => b.studyCertCount - a.studyCertCount || b.chatCount - a.chatCount);
    return searched;
  }, [members, query, sort]);

  const totalChat = members?.reduce((s, m) => s + m.chatCount, 0) ?? 0;
  const totalStudy = members?.reduce((s, m) => s + m.studyCertCount, 0) ?? 0;

  return (
    <PageShell>
      <PageHeader
        className="pb-10"
        badge={`👥 현재 방에 있는 멤버 ${members ? `${members.length}명` : ""}`}
        title="둘러보기"
        description="채팅 수, 레벨, 스터디 인증, 벙 참석까지 한눈에. 이름을 누르면 프로필로 이동해요."
      />

      <section className="relative px-6 pb-32">
        <div className="max-w-3xl mx-auto">
          {error && <Notice className="text-slate-400">멤버 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</Notice>}
          {!members && !error && <Notice>불러오는 중…</Notice>}

          {members && (
            <motion.div initial="hidden" animate="visible" variants={stagger(0.05)}>
              {/* Summary */}
              <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3 mb-6">
                <StatCard label="멤버" value={`${members.length}명`} />
                <StatCard label="누적 채팅" value={`${totalChat.toLocaleString()}회`} tone="text-cyan-300" />
                <StatCard label="누적 스터디 인증" value={`${totalStudy}회`} tone="text-emerald-300" />
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
                <Notice className="p-8">“{query}” 검색 결과가 없어요.</Notice>
              ) : (
                <div className="space-y-2">
                  {list.map((m, i) => {
                    const p = parseNick(m.name);
                    const tags = [
                      p.age ? `${koreanAge(p.age)}살` : null,
                      p.region,
                      p.gender === "남" ? "남자" : p.gender === "여" ? "여자" : null,
                      m.mbti,
                    ].filter(Boolean) as string[];
                    return (
                      <motion.div key={m.userId} variants={fadeUp}>
                        <div className="relative glass-card rounded-2xl border border-white/5 hover:border-violet-400/30 transition-colors px-4 sm:px-5 py-3.5 flex items-center gap-3">
                          {/* 카드 전체가 프로필 링크 — 안쪽 「최근 벙」 칩은 달력으로 가야 해서 겹쳐 깐다 */}
                          <Link
                            href={`/members/${encodeURIComponent(m.userId)}`}
                            aria-label={`${p.name} 프로필`}
                            className="absolute inset-0 rounded-2xl"
                          />
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
                            {m.recentMoims && m.recentMoims.length > 0 && (
                              <span className="flex flex-wrap items-center gap-1 mt-1.5">
                                <span className="text-[10px] text-slate-600">최근 벙</span>
                                {m.recentMoims.map((mo) => {
                                  const chip = (
                                    <>
                                      <span className="tabular-nums">{fmtMoimDate(mo.date)}</span> {mo.title}
                                    </>
                                  );
                                  const title = [mo.date, mo.title, mo.location].filter(Boolean).join(" · ");
                                  const href = moimHref(mo.date);
                                  const cls =
                                    "max-w-[11rem] truncate px-1.5 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-400";
                                  // 날짜를 아는 벙은 달력의 그 날로 보낸다.
                                  return href ? (
                                    <Link
                                      key={mo.postId}
                                      href={href}
                                      title={`${title} · 달력에서 보기`}
                                      className={`${cls} relative hover:bg-violet-500/15 hover:text-violet-200 transition-colors`}
                                    >
                                      {chip}
                                    </Link>
                                  ) : (
                                    <span key={mo.postId} title={title} className={cls}>
                                      {chip}
                                    </span>
                                  );
                                })}
                              </span>
                            )}
                          </span>
                          {/* 이모지가 지표를 구분하므로 색은 쓰지 않고, 지금 정렬 중인 지표만 밝게 둔다. */}
                          <span className="shrink-0 flex flex-col items-end gap-0.5 text-xs tabular-nums text-slate-400">
                            <span className={sort === "chat" ? "text-slate-100 font-semibold" : undefined}>
                              💬 {m.chatCount.toLocaleString()}
                            </span>
                            <span className={sort === "study" ? "text-slate-100 font-semibold" : undefined}>
                              📚 {m.studyCertCount}
                            </span>
                            <span title="벙 참석">☕ {m.moimCount ?? 0}</span>
                          </span>
                          <span className="hidden sm:block w-16 text-right text-[11px] text-slate-500 shrink-0">
                            {fmtAgo(m.lastSeenAt)}
                          </span>
                          <span className="text-slate-600">›</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
