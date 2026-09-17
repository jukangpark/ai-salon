"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import { MEMBERS_API_URL, fmtAgo, fmtDate, parseNick, type MemberDetail } from "@/lib/members";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const fmtCertDate = (ymd: string) => {
  const [, m, d] = ymd.split("-").map(Number);
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][new Date(`${ymd}T00:00:00+09:00`).getDay()];
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
        p.age ? `${p.age}년생` : null,
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
    <main className="relative min-h-screen overflow-hidden">
      <Nav />

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="animate-float absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="animate-float-delay absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[120px]" />
      </div>
      <div className="fixed inset-0 noise opacity-50 pointer-events-none" />

      <section className="relative pt-28 pb-32 px-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/members" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-white transition-colors mb-6">
            ‹ 둘러보기
          </Link>

          {status === "loading" && (
            <div className="glass-card rounded-2xl p-6 text-center text-sm text-slate-500">불러오는 중…</div>
          )}
          {status === "notfound" && (
            <div className="glass-card rounded-2xl p-8 text-center text-sm text-slate-400">
              지금 방에 없는 멤버이거나 존재하지 않는 주소예요.
            </div>
          )}
          {status === "error" && (
            <div className="glass-card rounded-2xl p-8 text-center text-sm text-slate-400">
              프로필을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
            </div>
          )}

          {member && p && (
            <motion.div initial="hidden" animate="visible" variants={stagger}>
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
              <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3 mb-4">
                <div className="glass-card rounded-2xl p-4 sm:p-5">
                  <p className="text-xs text-slate-500 mb-1">레벨</p>
                  <p className="text-lg font-semibold text-violet-300 tabular-nums">Lv.{member.level}</p>
                </div>
                <div className="glass-card rounded-2xl p-4 sm:p-5">
                  <p className="text-xs text-slate-500 mb-1">채팅</p>
                  <p className="text-lg font-semibold text-cyan-300 tabular-nums">{member.chatCount.toLocaleString()}회</p>
                </div>
                <div className="glass-card rounded-2xl p-4 sm:p-5">
                  <p className="text-xs text-slate-500 mb-1">스터디 인증</p>
                  <p className="text-lg font-semibold text-emerald-300 tabular-nums">{member.studyCertCount}회</p>
                </div>
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
                {!member.job && !member.introduction && (
                  <p className="text-[11px] text-slate-600 mt-3">
                    카톡에서 <code className="px-1 py-0.5 rounded bg-white/5 text-slate-400 font-mono">/살롱봇 직업 …</code> 처럼 프로필을 등록할 수 있어요.
                  </p>
                )}
              </motion.div>

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
                        className="px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-200 tabular-nums"
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

      <footer className="relative py-8 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600 text-sm">
          <span className="font-semibold text-slate-500">AI 살롱 광주</span>
          <span>나 혼자 쓰면 기술, 함께 나누면 가치 🚀</span>
        </div>
      </footer>
    </main>
  );
}
