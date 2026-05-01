"use client";

import React from "react";
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

type Paragraph = {
  text: string;
  subItems?: string[];
  note?: string;
};

type Article = {
  num: string;
  title: string;
  paragraphs: Paragraph[];
};

type Chapter = {
  num: string;
  title: string;
  accent: "violet" | "pink" | "cyan" | "fuchsia" | "amber";
  articles: Article[];
};

const chapters: Chapter[] = [
  {
    num: "제1장",
    title: "총칙",
    accent: "violet",
    articles: [
      {
        num: "제1조",
        title: "명칭",
        paragraphs: [
          { text: '본 모임의 명칭은 "AI 살롱 광주"(이하 "살롱")라 한다.' },
        ],
      },
      {
        num: "제2조",
        title: "목적",
        paragraphs: [
          {
            text: "살롱은 인공지능(AI) 기술과 활용 사례를 함께 탐구하고, 구성원 간 지식·경험을 나누는 소셜 네트워크를 지향한다.",
          },
          {
            text: '"나 혼자 쓰면 기술, 우리 함께 나누면 가치"를 핵심 가치로 삼는다.',
          },
        ],
      },
      {
        num: "제3조",
        title: "소재지",
        paragraphs: [
          { text: "살롱의 주요 활동 지역은 광주광역시로 한다." },
          {
            text: "오프라인 모임은 구성원 합의에 따라 광주 내 카페 등 장소에서 진행한다.",
          },
        ],
      },
      {
        num: "제4조",
        title: "공식 채널",
        paragraphs: [
          {
            text: "공식 온라인 채널은 카카오 오픈채팅 및 인스타그램(@ai_salon_official)으로 한다.",
          },
          { text: "공지 및 모임 일정은 카카오 오픈채팅을 통해 안내한다." },
        ],
      },
    ],
  },
  {
    num: "제2장",
    title: "회원",
    accent: "pink",
    articles: [
      {
        num: "제5조",
        title: "회원 자격",
        paragraphs: [
          {
            text: "살롱의 회원은 다음 각 호의 조건을 갖춘 자로 한다.",
            subItems: [
              "1989년생 이상 2006년생 이하인 자",
              "AI 기술 및 활용에 관심이 있는 자",
              "본 회칙에 동의하는 자",
            ],
          },
          {
            text: "연령 조건은 원활한 소통과 공감대 형성을 위한 기준이며, 예외 입장은 운영진 재량으로 결정할 수 있다.",
          },
        ],
      },
      {
        num: "제6조",
        title: "가입 절차",
        paragraphs: [
          {
            text: "가입 희망자는 공식 카카오 오픈채팅에 참여함으로써 가입 의사를 표시한다.",
          },
          {
            text: "가입이 완료된 회원은 운영진에게 이름(닉네임), 출생연도를 알린다.",
          },
          {
            text: "가입 후 2주 이내에 오프라인 정기 모임에 1회 이상 참석해야 정식 회원으로 인정한다.",
          },
        ],
      },
      {
        num: "제7조",
        title: "회원의 권리",
        paragraphs: [
          {
            text: "정식 회원은 다음 각 호의 권리를 갖는다.",
            subItems: [
              "정기 모임 및 비정기 활동 참여권",
              "모임 주제 및 장소 제안권",
              "운영 사항에 대한 의견 개진권",
              "공식 채널 내 콘텐츠 열람 및 공유권",
            ],
          },
        ],
      },
      {
        num: "제8조",
        title: "회원의 의무",
        paragraphs: [
          {
            text: "회원은 다음 각 호의 의무를 진다.",
            subItems: [
              "본 회칙 준수",
              "회비의 기한 내 납부 (제12조 참고)",
              "모임 내 다른 회원에 대한 존중 및 예의 유지",
              "모임에서 얻은 개인정보 외부 유출 금지",
            ],
          },
        ],
      },
      {
        num: "제9조",
        title: "탈퇴",
        paragraphs: [
          {
            text: "회원은 언제든지 카카오 오픈채팅 채널을 나가는 방식으로 자유롭게 탈퇴할 수 있다.",
          },
          { text: "탈퇴 시 미납 회비는 환불되지 않는다." },
        ],
      },
      {
        num: "제10조",
        title: "제명",
        paragraphs: [
          {
            text: "다음 각 호에 해당하는 경우 운영진 협의를 거쳐 회원을 제명할 수 있다.",
            subItems: [
              "다른 회원에 대한 언어적·신체적 폭력 또는 성희롱",
              "모임 정보 및 회원 개인정보의 무단 외부 유출",
              "회비 미납 후 연락이 두절된 경우",
              "기타 살롱의 명예를 심각하게 훼손하는 행위",
            ],
          },
        ],
      },
    ],
  },
  {
    num: "제3장",
    title: "회비",
    accent: "cyan",
    articles: [
      {
        num: "제11조",
        title: "회비",
        paragraphs: [
          { text: "월 회비는 2,000원으로 한다." },
          {
            text: "회비는 모임 운영(장소 대관, 공지 운영 등 제반 비용)에 사용한다.",
          },
        ],
      },
      {
        num: "제12조",
        title: "납부 방법 및 기한",
        paragraphs: [
          {
            text: "회비는 매월 5일까지 운영진이 안내하는 계좌로 이체한다.",
          },
        ],
      },
      {
        num: "제13조",
        title: "미납 처리",
        paragraphs: [
          {
            text: "매월 10일까지 미납 시 운영진이 1회 안내 메시지를 보낸다.",
          },
          { text: "미납이 지속될 경우 모임 참여가 제한될 수 있다." },
        ],
      },
      {
        num: "제14조",
        title: "회비 환불",
        paragraphs: [
          { text: "납부한 회비는 원칙적으로 환불하지 않는다." },
          {
            text: "단, 운영진의 귀책 사유로 모임이 전면 취소된 경우에는 해당 월 회비를 환불한다.",
          },
        ],
      },
      {
        num: "제15조",
        title: "회비 내역 공개",
        paragraphs: [
          {
            text: "운영진은 분기 1회 회비 수입·지출 내역을 회원들에게 공개한다.",
          },
        ],
      },
    ],
  },
  {
    num: "제4장",
    title: "모임 운영",
    accent: "fuchsia",
    articles: [
      {
        num: "제16조",
        title: "정기 모임",
        paragraphs: [
          { text: "정기 모임은 월 1회 이상 개최함을 원칙으로 한다." },
          {
            text: "모임 일시 및 장소는 최소 1주일 전에 공식 채널을 통해 공지한다.",
          },
          {
            text: "모임 장소는 광주 내 카페 등 회원들이 편하게 참석할 수 있는 곳으로 한다.",
          },
        ],
      },
      {
        num: "제17조",
        title: "모임 주제",
        paragraphs: [
          {
            text: '매 모임 시 회원 각자는 "이번 주 AI 판에서 가장 인상 깊었던 것" 1가지를 준비한다.',
          },
          {
            text: "주제 예시는 다음 각 호와 같다.",
            subItems: [
              "새로 출시된 AI 모델 또는 툴 소식",
              "업무 자동화·생산성 활용 사례",
              "이미지·영상·음악 생성 AI 활용",
              "AI를 활용한 사이드 프로젝트 경험",
              "AI 관련 업계 이슈 및 트렌드",
              "기타 회원이 흥미롭다고 판단하는 AI 관련 내용",
            ],
          },
          {
            text: "발표는 강제가 아니며, 자유로운 분위기에서 진행함을 원칙으로 한다.",
          },
        ],
      },
      {
        num: "제18조",
        title: "참석 의무 및 출석 관리",
        paragraphs: [
          {
            text: "가입 후 2주 이내 오프라인 모임 1회 참석은 필수이다. (제6조 ③항)",
          },
          {
            text: "정기 모임 불참 시 사전에 운영진 또는 공식 채널에 알리는 것을 권장한다.",
          },
          {
            text: "1개월간 오프라인 모임에 한 번도 참석하지 않은 회원은 운영진 안내 후 휴면 회원으로 분류할 수 있다.",
          },
        ],
      },
      {
        num: "제19조",
        title: "비정기 모임",
        paragraphs: [
          {
            text: "스터디, 해커톤, 번개 모임 등 비정기 모임은 회원 자율로 기획·운영할 수 있다.",
          },
          {
            text: "비정기 모임은 공식 채널을 통해 공유하며, 참석 여부는 자유이다.",
          },
          {
            text: "비정기 모임은 해당 모임의 모임장을 정하고, 모임장이 정산을 책임진다.",
          },
        ],
      },
    ],
  },
  {
    num: "제5장",
    title: "운영진",
    accent: "amber",
    articles: [
      {
        num: "제20조",
        title: "운영진 구성",
        paragraphs: [
          {
            text: "살롱의 운영진은 대표 1명으로 구성한다.",
            note: "대표: 살롱 전반 운영 총괄 및 대외 창구 역할",
          },
        ],
      },
      {
        num: "제21조",
        title: "운영진 교체",
        paragraphs: [
          {
            text: "운영진 본인이 사임을 원할 경우 1개월 전 사전 통보를 원칙으로 한다.",
          },
          {
            text: "운영진 공석 발생 시 자원자 중 회원 동의를 거쳐 충원한다.",
          },
        ],
      },
    ],
  },
  {
    num: "제6장",
    title: "행동 규범",
    accent: "violet",
    articles: [
      {
        num: "제22조",
        title: "품위 유지",
        paragraphs: [
          {
            text: "회원은 모임 내·외에서 다른 회원의 존엄과 다양성을 존중한다.",
          },
          {
            text: "정치·종교 등 분열을 초래할 수 있는 주제는 모임 자리에서 자제한다.",
          },
          {
            text: "다단계, 영업, 홍보 등 상업적 목적의 활동을 모임 내에서 하지 않는다.",
          },
        ],
      },
      {
        num: "제23조",
        title: "개인정보 보호",
        paragraphs: [
          {
            text: "모임을 통해 알게 된 회원의 개인정보(연락처, 직장, 거주지 등)는 당사자의 동의 없이 외부에 공유하지 않는다.",
          },
          {
            text: "모임 사진·영상 촬영 및 SNS 게시는 해당 회원의 동의를 구한다.",
          },
        ],
      },
      {
        num: "제24조",
        title: "분쟁 해결",
        paragraphs: [
          { text: "회원 간 분쟁 발생 시 운영진이 중재 역할을 수행한다." },
          {
            text: "중재가 어려운 경우 회원 전체 의견을 수렴하여 결정한다.",
          },
        ],
      },
    ],
  },
  {
    num: "제7장",
    title: "회칙 개정",
    accent: "pink",
    articles: [
      {
        num: "제25조",
        title: "회칙 개정",
        paragraphs: [
          { text: "회칙 개정은 대표가 결정한다." },
          { text: "개정된 회칙은 공지 후 즉시 효력을 발휘한다." },
        ],
      },
    ],
  },
  {
    num: "제8장",
    title: "부칙",
    accent: "cyan",
    articles: [
      {
        num: "제26조",
        title: "시행일",
        paragraphs: [
          {
            text: "이 회칙은 AI 살롱 광주 창립 모임 개최일부터 시행한다.",
          },
        ],
      },
      {
        num: "제27조",
        title: "미규정 사항",
        paragraphs: [
          {
            text: "본 회칙에 명시되지 않은 사항은 운영진 협의 및 회원 의견을 반영하여 결정한다.",
          },
        ],
      },
    ],
  },
];

const accentClasses = {
  violet: {
    badge: "text-violet-300 bg-violet-500/10 border-violet-500/20",
    dot: "bg-violet-400",
    border: "border-violet-500/20",
    glow: "from-violet-600/5",
  },
  pink: {
    badge: "text-pink-300 bg-pink-500/10 border-pink-500/20",
    dot: "bg-pink-400",
    border: "border-pink-500/20",
    glow: "from-pink-600/5",
  },
  cyan: {
    badge: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20",
    dot: "bg-cyan-400",
    border: "border-cyan-500/20",
    glow: "from-cyan-600/5",
  },
  fuchsia: {
    badge: "text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/20",
    dot: "bg-fuchsia-400",
    border: "border-fuchsia-500/20",
    glow: "from-fuchsia-600/5",
  },
  amber: {
    badge: "text-amber-300 bg-amber-500/10 border-amber-500/20",
    dot: "bg-amber-400",
    border: "border-amber-500/20",
    glow: "from-amber-600/5",
  },
};

const circledNums = ["①", "②", "③", "④", "⑤", "⑥"];

export default function RulesPage() {
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
              작성일: 2026-05-01 &nbsp;·&nbsp; 상태: 초안
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
          >
            <span className="gradient-text">AI 살롱 광주</span>
            <br />
            <span className="text-slate-100">회칙</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-slate-500 text-sm">
            수정 자유롭게 해주세요 — 아직 초안입니다 ✏️
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
              목차
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {chapters.map((ch) => {
                const a = accentClasses[ch.accent];
                return (
                  <a
                    key={ch.num}
                    href={`#${ch.num}`}
                    className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all hover:scale-105 ${a.badge} ${a.border}`}
                  >
                    {ch.num} {ch.title}
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chapters */}
      <section className="relative px-6 pb-32">
        <div className="max-w-3xl mx-auto space-y-8">
          {chapters.map((chapter) => {
            const a = accentClasses[chapter.accent];
            return (
              <motion.div
                key={chapter.num}
                id={chapter.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={stagger}
              >
                {/* Chapter header */}
                <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${a.badge} ${a.border}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${a.dot}`} />
                    {chapter.num}
                  </span>
                  <h2 className="text-lg font-bold text-slate-100">{chapter.title}</h2>
                </motion.div>

                {/* Articles */}
                <div className="space-y-3">
                  {chapter.articles.map((article) => (
                    <motion.div
                      key={article.num}
                      variants={fadeUp}
                      className={`glass-card rounded-2xl p-5 border overflow-hidden relative ${a.border}`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${a.glow} to-transparent pointer-events-none`}
                      />
                      <div className="relative">
                        <p className="text-sm font-semibold text-slate-200 mb-3">
                          {article.num}{" "}
                          <span className="text-slate-400 font-normal">
                            ({article.title})
                          </span>
                        </p>
                        <div className="space-y-2">
                          {article.paragraphs.map((para, pi) => (
                            <div key={pi} className="space-y-1.5">
                              <div className="flex gap-2 text-sm text-slate-400 leading-relaxed">
                                <span className="flex-shrink-0 text-slate-600 text-xs mt-0.5">
                                  {circledNums[pi]}
                                </span>
                                <span>{para.text}</span>
                              </div>
                              {para.subItems && (
                                <ul className="ml-6 space-y-1">
                                  {para.subItems.map((item, ii) => (
                                    <li
                                      key={ii}
                                      className="flex gap-2 text-xs text-slate-500"
                                    >
                                      <span className="flex-shrink-0 text-slate-600">
                                        {ii + 1}.
                                      </span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {para.note && (
                                <p className="ml-6 text-xs text-slate-500 italic">
                                  · {para.note}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
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
          <span>나 혼자 쓰면 기술, 우리 함께 나누면 가치 🚀</span>
        </div>
      </footer>
    </main>
  );
}
