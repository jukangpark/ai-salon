"use client";

import { useState } from "react";
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
  visible: { transition: { staggerChildren: 0.08 } },
};

const TRIGGER = "/살롱봇";

type Tier = "골드" | "플래티넘";

type Command = {
  cmd: string;
  args?: string;
  desc: string;
  tier?: Tier;
};

type Accent = "violet" | "pink" | "cyan" | "fuchsia" | "amber";

type Category = {
  emoji: string;
  title: string;
  accent: Accent;
  note?: string;
  commands: Command[];
};

const categories: Category[] = [
  {
    emoji: "🌸",
    title: "프로필 등록",
    accent: "violet",
    commands: [
      { cmd: "직업등록", args: "[내용]", desc: "내 직업을 프로필에 등록해요." },
      { cmd: "자기소개등록", args: "[내용]", desc: "내 자기소개를 등록해요." },
      { cmd: "MBTI등록", args: "[값]", desc: "내 MBTI를 등록해요." },
      { cmd: "취미등록", args: "[내용]", desc: "내 취미를 등록해요." },
    ],
  },
  {
    emoji: "🌸",
    title: "프로필 조회",
    accent: "pink",
    note: "이름을 생략하면 본인 기준으로 조회돼요.",
    commands: [
      { cmd: "직업조회", args: "[이름?]", desc: "직업을 조회해요." },
      { cmd: "자기소개조회", args: "[이름?]", desc: "자기소개를 조회해요." },
      { cmd: "MBTI조회", args: "[이름?]", desc: "MBTI를 조회해요." },
      { cmd: "취미조회", args: "[이름?]", desc: "취미를 조회해요." },
      {
        cmd: "프로필조회",
        args: "[이름?]",
        desc: "직업·자기소개·MBTI·취미를 한 번에 조회해요.",
      },
    ],
  },
  {
    emoji: "🌸",
    title: "채팅 / 레벨",
    accent: "cyan",
    commands: [
      { cmd: "채팅순위", desc: "채팅 수 기준 순위표를 보여줘요." },
      { cmd: "채팅수조회", args: "[이름?]", desc: "누적 채팅 수를 조회해요." },
      { cmd: "채팅순위조회", args: "[이름?]", desc: "채팅 순위를 조회해요." },
      {
        cmd: "레벨",
        args: "[이름?]",
        desc: "현재 레벨·티어를 조회해요. (또는 레벨조회)",
      },
      { cmd: "레벨순위", desc: "레벨 기준 순위표를 보여줘요." },
      { cmd: "티어목록조회", desc: "전체 티어(계급) 목록과 기준을 보여줘요." },
    ],
  },
  {
    emoji: "🌸",
    title: "멤버 히스토리",
    accent: "fuchsia",
    commands: [
      { cmd: "방문이력", args: "[이름?]", desc: "입·퇴장 이력을 조회해요." },
      { cmd: "닉변이력", args: "[이름?]", desc: "닉네임 변경 이력을 조회해요." },
    ],
  },
  {
    emoji: "🌸",
    title: "금지어",
    accent: "amber",
    note: "플래티넘 이상 등급만 사용할 수 있어요.",
    commands: [
      { cmd: "금지어등록", args: "[단어]", desc: "금지어를 추가해요.", tier: "플래티넘" },
      { cmd: "금지어목록조회", desc: "등록된 금지어 목록을 보여줘요.", tier: "플래티넘" },
      { cmd: "금지어삭제", args: "[단어]", desc: "금지어를 삭제해요.", tier: "플래티넘" },
    ],
  },
  {
    emoji: "🌸",
    title: "게임",
    accent: "violet",
    commands: [
      {
        cmd: "러시안룰렛",
        args: "[이름1] [이름2] ...",
        desc: "입력한 사람들 중 한 명이 당첨돼요.",
      },
      { cmd: "진검승부", args: "[이름1] [이름2]", desc: "두 사람의 대결 결과를 가려줘요." },
      {
        cmd: "점메추",
        args: "[음식1] [음식2] ...",
        desc: "점심 메뉴를 추천해줘요. (후보 중 추첨)",
      },
      {
        cmd: "저메추",
        args: "[음식1] [음식2] ...",
        desc: "저녁 메뉴를 추천해줘요. (후보 중 추첨)",
      },
    ],
  },
  {
    emoji: "🌸",
    title: "인물퀴즈",
    accent: "pink",
    commands: [
      {
        cmd: "인물퀴즈",
        args: "[이름]",
        desc: "멤버 프로필을 힌트로 인물을 맞히는 퀴즈예요.",
      },
    ],
  },
  {
    emoji: "🌸",
    title: "스터디 인증",
    accent: "cyan",
    note: "2주에 3회 이상 / 하루 1회 인증할 수 있어요.",
    commands: [
      { cmd: "스터디인증", desc: "AI 스터디 공유 후 인증해요." },
      {
        cmd: "스터디인증조회",
        desc: "이번 기간 멤버별 인증 현황과 남은 기간을 보여줘요.",
      },
    ],
  },
  {
    emoji: "🌸",
    title: "AI",
    accent: "fuchsia",
    note: "📰 AI 뉴스는 매일 오전 10시(KST)에 자동으로 올라와요 (별도 명령 없음).",
    commands: [
      {
        cmd: "자유질문",
        args: "[질문]",
        desc: "살롱봇에게 자유롭게 질문하고 AI 답변을 받아요.",
        tier: "골드",
      },
    ],
  },
  {
    emoji: "🌸",
    title: "메타",
    accent: "amber",
    commands: [
      { cmd: "유저데이터삭제", args: "[이름]", desc: "특정 유저의 데이터를 삭제해요." },
      { cmd: "명령어목록", desc: "전체 명령어 목록을 보여줘요." },
    ],
  },
];

const accentClasses: Record<
  Accent,
  { badge: string; dot: string; border: string; glow: string; cmd: string }
> = {
  violet: {
    badge: "text-violet-300 bg-violet-500/10 border-violet-500/20",
    dot: "bg-violet-400",
    border: "border-violet-500/20",
    glow: "from-violet-600/5",
    cmd: "text-violet-200",
  },
  pink: {
    badge: "text-pink-300 bg-pink-500/10 border-pink-500/20",
    dot: "bg-pink-400",
    border: "border-pink-500/20",
    glow: "from-pink-600/5",
    cmd: "text-pink-200",
  },
  cyan: {
    badge: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20",
    dot: "bg-cyan-400",
    border: "border-cyan-500/20",
    glow: "from-cyan-600/5",
    cmd: "text-cyan-200",
  },
  fuchsia: {
    badge: "text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/20",
    dot: "bg-fuchsia-400",
    border: "border-fuchsia-500/20",
    glow: "from-fuchsia-600/5",
    cmd: "text-fuchsia-200",
  },
  amber: {
    badge: "text-amber-300 bg-amber-500/10 border-amber-500/20",
    dot: "bg-amber-400",
    border: "border-amber-500/20",
    glow: "from-amber-600/5",
    cmd: "text-amber-200",
  },
};

const tierClasses: Record<Tier, string> = {
  골드: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  플래티넘: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20",
};

function CommandCard({ command, accent }: { command: Command; accent: Accent }) {
  const a = accentClasses[accent];
  const [copied, setCopied] = useState(false);

  const fullCmd = `${TRIGGER} ${command.cmd}${command.args ? ` ${command.args}` : ""}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullCmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  return (
    <motion.div
      variants={fadeUp}
      className={`glass-card rounded-2xl p-5 border overflow-hidden relative ${a.border}`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${a.glow} to-transparent pointer-events-none`}
      />
      <div className="relative">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <code className="font-mono text-sm">
                <span className="text-slate-500">{TRIGGER} </span>
                <span className={`font-semibold ${a.cmd}`}>{command.cmd}</span>
                {command.args && (
                  <span className="text-slate-500"> {command.args}</span>
                )}
              </code>
              {command.tier && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold ${tierClasses[command.tier]}`}
                >
                  {command.tier} 이상
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {command.desc}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "복사됨" : "명령어 복사"}
            title={copied ? "복사됨!" : "명령어 복사"}
            className={`shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-all hover:scale-110 active:scale-95 ${
              copied
                ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
                : `${a.cmd} bg-white/5 border-white/10 hover:bg-white/10`
            }`}
          >
            {copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function CommandsPage() {
  const totalCommands = categories.reduce(
    (sum, c) => sum + c.commands.length,
    0,
  );

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Nav />

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="animate-float absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="animate-float-delay absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-pink-500/8 blur-[120px]" />
        <div className="animate-float absolute top-[50%] right-[20%] w-[300px] h-[300px] rounded-full bg-cyan-500/6 blur-[100px]" />
      </div>

      {/* Noise overlay */}
      <div className="fixed inset-0 noise opacity-50 pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Header */}
      <section className="relative pt-32 pb-16 px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-3xl mx-auto"
        >
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-slate-400 font-medium">
              🤖 카카오톡 살롱봇 &nbsp;·&nbsp; 총 {totalCommands}개 명령어
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
          >
            <span className="gradient-text">살롱봇</span>
            <br />
            <span className="text-slate-100">명령어 목록</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-slate-500 text-sm">
            카카오톡 단톡방에서{" "}
            <code className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300 font-mono text-xs">
              {TRIGGER}
            </code>{" "}
            뒤에 명령어를 붙여 입력하세요 ✨
          </motion.p>
        </motion.div>
      </section>

      {/* Table of Contents */}
      <section className="relative px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="glass-card rounded-2xl p-6"
          >
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-medium">
              카테고리
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => {
                const a = accentClasses[cat.accent];
                return (
                  <a
                    key={cat.title}
                    href={`#${cat.title}`}
                    className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all hover:scale-105 ${a.badge} ${a.border}`}
                  >
                    {cat.emoji} {cat.title}
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="relative px-6 pb-32">
        <div className="max-w-3xl mx-auto space-y-8">
          {categories.map((category) => {
            const a = accentClasses[category.accent];
            return (
              <motion.div
                key={category.title}
                id={category.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={stagger}
                className="scroll-mt-24"
              >
                {/* Category header */}
                <motion.div
                  variants={fadeUp}
                  className="flex items-center gap-3 mb-4"
                >
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${a.badge} ${a.border}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${a.dot}`} />
                    {category.emoji} {category.title}
                  </span>
                </motion.div>

                {category.note && (
                  <motion.p
                    variants={fadeUp}
                    className="text-xs text-slate-500 mb-3 ml-1"
                  >
                    {category.note}
                  </motion.p>
                )}

                {/* Commands */}
                <div className="space-y-3">
                  {category.commands.map((command) => (
                    <CommandCard
                      key={command.cmd}
                      command={command}
                      accent={category.accent}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
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
