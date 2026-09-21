"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import Notice from "@/components/Notice";
import StatCard from "@/components/StatCard";
import { fadeUp, stagger } from "@/lib/motion";
import { WEEKDAYS } from "@/lib/constants";
import { MEMBERS_API_URL, fmtAgo, fmtDate, koreanAge, moimHref, parseNick, type MemberDetail } from "@/lib/members";

const fmtCertDate = (ymd: string) => {
  const [, m, d] = ymd.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(`${ymd}T00:00:00+09:00`).getDay()];
  return `${m}월 ${d}일 (${weekday})`;
};

export default function MemberDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "notfound" | "error">("loading");

  useEffect(() => {
    if (!userId) return;
    fetch(`${MEMBERS_API_URL}/${encodeURIComponent(userId)}`)
      .then((res) => {
        if (res.status === 404) throw new Error("notfound");
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((json: { member: MemberDetail }) => {
        setMember(json.member);
        setStatus("ok");
      })
      .catch((e: Error) => setStatus(e.message === "notfound" ? "notfound" : "error"));
  }, [userId]);

  const p = member ? parseNick(member.name) : null;
  const tags = p
    ? ([
        p.age ? `${koreanAge(p.age)}살` : null,
        p.region,
        p.gender === "남" ? "남자" : p.gender === "여" ? "여자" : null,
        member?.mbti,
      ].filter(Boolean) as string[])
    : [];
  const profile = member
    ? ([
        member.job ? ["직업", member.job] : null,
        member.hobby ? ["취미", member.hobby] : null,
        member.introduction ? ["소개", member.introduction] : null,
        member.firstSeenAt ? ["첫 활동", fmtDate(member.firstSeenAt)] : null,
        member.lastSeenAt ? ["마지막 활동", `${fmtDate(member.lastSeenAt)} (${fmtAgo(member.lastSeenAt)})`] : null,
      ].filter(Boolean) as [string, string][])
    : [];

  return (
    <PageShell>
      <section className="relative pt-28 pb-32 px-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/members" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-white transition-colors mb-6">
            ‹ 둘러보기
          </Link>

          {status === "loading" && <Notice>불러오는 중…</Notice>}
          {status === "notfound" && (
            <Notice className="p-8 text-slate-400">지금 방에 없는 멤버이거나 존재하지 않는 주소예요.</Notice>
          )}
          {status === "error" && (
            <Notice className="p-8 text-slate-400">프로필을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</Notice>
          )}

          {member && p && (
            <motion.div initial="hidden" animate="visible" variants={stagger(0.06)}>
              {/* Header */}
              <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6 sm:p-8 mb-4 border border-violet-400/20">
                <div className="flex items-start gap-4">
                  <span className="text-4xl leading-none" title={member.tier}>{member.tierEmoji}</span>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100 truncate">{p.name}</h1>
                    <p className="text-xs text-slate-500 mt-1">
                      {member.tierEmoji} {member.tier} · Lv.{member.level}
                    </p>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {tags.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 text-[11px] text-slate-400">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <StatCard label="레벨" value={`Lv.${member.level}`} valueClassName="text-lg" />
                <StatCard
                  label="채팅"
                  value={`${member.chatCount.toLocaleString()}회`}
                  tone="text-cyan-300"
                  valueClassName="text-lg"
                />
                <StatCard
                  label="스터디 인증"
                  value={`${member.studyCertCount}회`}
                  tone="text-emerald-300"
                  valueClassName="text-lg"
                />
                <StatCard
                  label="벙 참석"
                  value={`${member.moimCount ?? 0}회`}
                  tone="text-violet-300"
                  valueClassName="text-lg"
                />
              </motion.div>

              {/* Profile */}
              <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5 sm:p-6 mb-4">
                <p className="text-sm font-semibold text-slate-100 mb-3">프로필</p>
                {profile.length > 0 ? (
                  <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-sm">
                    {profile.map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt className="text-slate-500 text-xs pt-0.5">{k}</dt>
                        <dd className="text-slate-300 break-words">{v}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-xs text-slate-600">아직 등록된 프로필이 없어요.</p>
                )}
              </motion.div>

              {/* Moims */}
              {member.moims && (
                <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5 sm:p-6 mb-4">
                  <div className="flex items-baseline justify-between mb-3">
                    <p className="text-sm font-semibold text-slate-100">☕ 벙 참석 기록</p>
                    <p className="text-xs text-slate-500">전체 {member.moims.length}회</p>
                  </div>
                  {member.moims.length === 0 ? (
                    <p className="text-xs text-slate-600">아직 참석한 벙이 없어요.</p>
                  ) : (
                    <ul className="space-y-2">
                      {member.moims.map((mo) => {
                        const href = moimHref(mo.date);
                        const body = (
                          <>
                            <span className="w-28 shrink-0 text-xs text-slate-500 tabular-nums">
                              {mo.date ? fmtCertDate(mo.date) : "-"}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-slate-200 break-words">{mo.title ?? "벙"}</span>
                              {mo.location && <span className="block text-[11px] text-slate-500">📍 {mo.location}</span>}
                            </span>
                          </>
                        );
                        // 날짜를 아는 벙은 달력의 그 날로 보낸다.
                        return (
                          <li key={mo.postId}>
                            {href ? (
                              <Link
                                href={href}
                                title="달력에서 이 날 보기"
                                className="-mx-2 flex items-baseline gap-3 rounded-lg px-2 py-1 text-sm transition-colors hover:bg-white/5"
                              >
                                {body}
                                <span className="shrink-0 self-center text-slate-600">›</span>
                              </Link>
                            ) : (
                              <div className="flex items-baseline gap-3 text-sm">{body}</div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </motion.div>
              )}

              {/* Study certs */}
              <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5 sm:p-6">
                <div className="flex items-baseline justify-between mb-3">
                  <p className="text-sm font-semibold text-slate-100">📚 스터디 인증 기록</p>
                  <p className="text-xs text-slate-500">전체 {member.studyCerts.length}회</p>
                </div>
                {member.studyCerts.length === 0 ? (
                  <p className="text-xs text-slate-600">아직 인증이 없어요.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {member.studyCerts.map((d) => (
                      <span
                        key={d}
                        title={d}
                        className="px-2.5 py-1 rounded-full bg-white/5 text-xs text-slate-400 tabular-nums"
                      >
                        {fmtCertDate(d)}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
