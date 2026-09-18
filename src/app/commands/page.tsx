"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import { fadeUp, stagger } from "@/lib/motion";
import { accentClasses, type Accent } from "@/lib/accents";

const TRIGGER = "/살롱봇";

type Tier = "골드" | "플래티넘";

type Command = {
  cmd: string;
  args?: string;
  desc: string;
  tier?: Tier;
};

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
      { cmd: "MBTI등록", args: "[값]", desc: "내 MBTI를 등록해요. (또는 MBTI)" },
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
      { cmd: "방문이력", args: "[이름?]", desc: "입·퇴장 이력을 조회해요. (또는 입퇴장이력)" },
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
    title: "벙 참여",
    accent: "amber",
    note: "정모(벙) 참석 기록 기준이에요. 순위는 지금 방에 있는 멤버만 세요.",
    commands: [
      { cmd: "벙참여순위", args: "[월]", desc: "벙 참석 횟수 TOP 10을 보여줘요. 월을 주면 그 달 기준이에요." },
      { cmd: "월별벙참여순위조회", args: "[월]", desc: "이번 달(또는 지정한 달) 벙 참여순위를 보여줘요." },
      { cmd: "벙참여수조회", args: "[이름]", desc: "나(또는 해당 멤버)의 벙 참석 횟수를 보여줘요." },
      { cmd: "벙참여순위조회", args: "[이름]", desc: "나(또는 해당 멤버)의 벙 참여 순위를 보여줘요." },
    ],
  },
  {
    emoji: "🌸",
    title: "AI",
    accent: "fuchsia",
    note: "골드 이상 등급만 사용할 수 있어요. 📰 AI 뉴스 자동 브리핑은 현재 쉬고 있어요.",
    commands: [
      {
        cmd: "자유질문",
        args: "[질문]",
        desc: "살롱봇에게 자유롭게 질문하고 AI 답변을 받아요. 최근 6시간 방 대화 맥락을 반영해요.",
        tier: "골드",
      },
    ],
  },
  {
    emoji: "🌸",
    title: "메타",
    accent: "amber",
    commands: [
      { cmd: "명령어목록", desc: "전체 명령어 목록을 보여줘요." },
    ],
  },
];

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
    <PageShell
      grid
      orbs={[
        "top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px]",
        "bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-pink-500/8 blur-[120px]",
        "top-[50%] right-[20%] w-[300px] h-[300px] bg-cyan-500/6 blur-[100px]",
      ]}
    >
      <PageHeader
        className="pb-16"
        badge={<>🤖 카카오톡 살롱봇 &nbsp;·&nbsp; 총 {totalCommands}개 명령어</>}
        title="살롱봇"
        subtitle="명령어 목록"
        description={
          <>
            카카오톡 단톡방에서{" "}
            <code className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300 font-mono text-xs">{TRIGGER}</code>{" "}
            뒤에 명령어를 붙여 입력하세요 ✨
          </>
        }
      />

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
                variants={stagger(0.08)}
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
    </PageShell>
  );
}
