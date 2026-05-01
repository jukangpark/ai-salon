"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Coffee, MapPin, MessageSquare, Sparkles, Users, Zap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function InvitationPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center justify-start px-4 py-12">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="animate-float absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="animate-float-delay absolute bottom-[10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="animate-float absolute top-[50%] left-[30%] w-[250px] h-[250px] rounded-full bg-cyan-500/8 blur-[100px]" />
      </div>
      <div className="fixed inset-0 noise opacity-50 pointer-events-none" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative w-full max-w-sm mx-auto flex flex-col gap-4"
      >
        {/* Header label */}
        <motion.div variants={fadeUp} className="flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs text-pink-300 font-medium">
            <Sparkles size={12} className="text-pink-400" />
            당신을 초대합니다
          </span>
        </motion.div>

        {/* Main card */}
        <motion.div
          variants={fadeUp}
          className="relative glass-card rounded-3xl p-8 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/8 via-transparent to-pink-600/8" />
          <div className="relative">
            {/* Logo */}
            <motion.img
              src="/logo.svg"
              alt="AI 살롱 광주"
              className="w-20 h-20 mx-auto mb-5 drop-shadow-[0_0_20px_rgba(244,114,182,0.5)]"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            />

            {/* Title */}
            <p className="text-slate-400 text-sm mb-1">광주 최초 AI 살롱에</p>
            <h1 className="text-3xl font-bold mb-1">
              <span className="gradient-text">초대장</span>
            </h1>
            <p className="text-slate-500 text-xs mb-6">AI 살롱 광주 · 1기</p>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent mb-6" />

            {/* Description */}
            <p className="text-slate-300 text-sm leading-relaxed mb-2">
              AI를 혼자만 쓰기엔 너무 아깝잖아요.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              같이 쓰고, 같이 나누고, 같이 성장하는
              <br />
              <span className="text-slate-200 font-medium">광주 AI 커뮤니티</span>에 함께해요.
            </p>
          </div>
        </motion.div>

        {/* Info cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
          <div className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 text-center">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Users size={16} className="text-violet-400" />
            </div>
            <p className="text-slate-400 text-xs">모임 형태</p>
            <p className="text-slate-200 text-sm font-semibold leading-tight">
              오프라인
              <br />
              정기 모임
            </p>
          </div>
          <div className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 text-center">
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 flex items-center justify-center">
              <MapPin size={16} className="text-pink-400" />
            </div>
            <p className="text-slate-400 text-xs">지역</p>
            <p className="text-slate-200 text-sm font-semibold leading-tight">
              광주
              <br />
              광역시
            </p>
          </div>
          <div className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 text-center">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Coffee size={16} className="text-cyan-400" />
            </div>
            <p className="text-slate-400 text-xs">회비</p>
            <p className="text-slate-200 text-sm font-semibold leading-tight">
              월 2,000원
              <br />
              <span className="text-slate-500 text-xs font-normal">매월 5일</span>
            </p>
          </div>
          <div className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 text-center">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Calendar size={16} className="text-amber-400" />
            </div>
            <p className="text-slate-400 text-xs">모집</p>
            <p className="text-slate-200 text-sm font-semibold leading-tight">
              1기
              <br />
              <span className="text-slate-500 text-xs font-normal">모집 중 🔥</span>
            </p>
          </div>
        </motion.div>

        {/* Rules card */}
        <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-pink-400" />
            <p className="text-slate-300 text-sm font-semibold">딱 하나만 지켜주세요</p>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            가입 후 <span className="text-slate-200 font-medium">2주 안에 오프라인 모임</span>에
            한 번은 꼭 참석해주세요.
          </p>
          <p className="text-slate-500 text-xs mt-2">
            유령 회원은 사양합니다 👻
          </p>
        </motion.div>

        {/* What we talk about */}
        <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5">
          <p className="text-slate-300 text-sm font-semibold mb-3">이런 얘기 해요</p>
          <div className="flex flex-wrap gap-2">
            {[
              "AI 툴 꿀팁",
              "업무 자동화",
              "이미지·영상 생성",
              "AI 부업",
              "개발에 AI 녹이기",
              "이번 주 AI 뉴스",
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 border border-violet-500/20 text-violet-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div variants={fadeUp} className="flex flex-col gap-3 pb-4">
          <a
            href="https://open.kakao.com/o/gDCIvUsi"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold text-base transition-all duration-300 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #ec4899, #c084fc)" }}
          >
            <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
            <MessageSquare size={18} />
            카카오 오픈채팅 참여하기
          </a>
          <a
            href="https://www.instagram.com/ai_salon_official/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold text-sm glass-card text-slate-300 hover:text-white transition-all duration-300"
          >
            <Sparkles size={16} className="text-pink-400" />
            인스타그램 DM 문의 @ai_salon_official
          </a>
          <a
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm text-slate-500 hover:text-slate-300 transition-colors duration-300"
          >
            메인 페이지로 돌아가기 →
          </a>
        </motion.div>
      </motion.div>
    </main>
  );
}
