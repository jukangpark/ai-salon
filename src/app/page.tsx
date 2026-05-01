"use client";

import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import {
  Brain,
  Coffee,
  Lightbulb,
  MapPin,
  MessageSquare,
  Newspaper,
  Rocket,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const aiTools = [
  { name: "ChatGPT", emoji: "💬", color: "#10A37F" },
  { name: "Claude", emoji: "🧠", color: "#D97706" },
  { name: "Midjourney", emoji: "🎨", color: "#ffffff" },
  { name: "Perplexity", emoji: "🔍", color: "#20B2AA" },
  { name: "Gemini", emoji: "✨", color: "#4285F4" },
  { name: "Grok", emoji: "🤖", color: "#1D9BF0" },
  { name: "ElevenLabs", emoji: "🎙️", color: "#FDB833" },
  { name: "Runway", emoji: "🎬", color: "#FF4D4D" },
  { name: "Ideogram", emoji: "🖼️", color: "#7C3AED" },
  { name: "Canva AI", emoji: "🎨", color: "#00C4CC" },
  { name: "NotebookLM", emoji: "📓", color: "#4285F4" },
  { name: "Suno", emoji: "🎵", color: "#8B5CF6" },
  { name: "Kling", emoji: "🎞️", color: "#FF6B6B" },
  { name: "Cursor", emoji: "💻", color: "#a78bfa" },
  { name: "Lovable", emoji: "🪄", color: "#f472b6" },
  { name: "v0", emoji: "⚡", color: "#ffffff" },
];

const targetAudience = [
  { icon: "🤔", text: "AI 툴을 쓰는데 제대로 쓰는 건지 모르겠는 분" },
  { icon: "💬", text: "ChatGPT / Claude / Gemini 꿀팁 나눠주고 싶은 분" },
  { icon: "🛠️", text: "AI로 사이드 프로젝트 하고 있는 분" },
  { icon: "📰", text: "매주 쏟아지는 AI 뉴스, 같이 소화하고 싶은 분" },
  { icon: "😂", text: "그냥 AI 얘기 실컷 하고 싶은 분" },
];

const topics = [
  { icon: "🏢", label: "업무 자동화" },
  { icon: "📸", label: "이미지·영상 생성" },
  { icon: "🎓", label: "AI로 공부하기" },
  { icon: "💸", label: "AI 부업·사이드잡" },
  { icon: "🧑‍💻", label: "개발에 AI 녹이기" },
  { icon: "🎨", label: "창작 & 글쓰기" },
  { icon: "📰", label: "이번 주 핫한 AI 뉴스" },
  { icon: "🔭", label: "앞으로 올 AI 트렌드" },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="animate-float absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="animate-float-delay absolute top-[30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="animate-float absolute bottom-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-pink-500/8 blur-[100px]" />
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

      {/* ─── Hero ─── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 pt-20 pb-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-pink-300 font-medium">
              <Sparkles size={14} className="text-pink-400" />
              광주 1기 멤버 모집 중 🔥
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1]"
          >
            <span className="gradient-text">AI 살롱</span>
            <br />
            <span className="text-slate-100">광주</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed"
          >
            AI는 혼자 쓰면 툴이지만,{" "}
            <span className="text-slate-200 font-medium">같이 나누면 레버리지</span>입니다.
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="text-base text-slate-500 max-w-xl mx-auto mb-12"
          >
            AI 활용법을 함께 나누는 소셜 네트워크
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="https://open.kakao.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #ec4899, #c084fc)",
              }}
            >
              <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
              <MessageSquare size={18} />
              오픈채팅 참여하기
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base glass-card text-slate-300 hover:text-white transition-all duration-300"
            >
              <Rocket size={18} />
              모임 소개 보기
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-slate-600 text-xs">
            <span>스크롤</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-0.5 h-6 bg-gradient-to-b from-slate-600 to-transparent rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* ─── AI Tools Marquee ─── */}
      <section className="relative py-12 overflow-hidden">
        <p className="text-center text-slate-600 text-xs uppercase tracking-widest mb-6">
          우리가 다루는 AI 툴들
        </p>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#030712] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#030712] to-transparent pointer-events-none" />
          <Marquee speed={40} pauseOnHover gradient={false}>
            {aiTools.map((tool) => (
              <div
                key={tool.name}
                className="mx-3 flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card hover:scale-105 transition-transform duration-200 cursor-default select-none"
                style={{ borderColor: `${tool.color}22` }}
              >
                <span className="text-lg">{tool.emoji}</span>
                <span
                  className="text-sm font-semibold whitespace-nowrap"
                  style={{ color: tool.color }}
                >
                  {tool.name}
                </span>
              </div>
            ))}
          </Marquee>
          <div className="mt-3">
            <Marquee speed={30} pauseOnHover gradient={false} direction="right">
              {[...aiTools].reverse().map((tool) => (
                <div
                  key={tool.name}
                  className="mx-3 flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card hover:scale-105 transition-transform duration-200 cursor-default select-none"
                  style={{ borderColor: `${tool.color}22` }}
                >
                  <span className="text-lg">{tool.emoji}</span>
                  <span
                    className="text-sm font-semibold whitespace-nowrap"
                    style={{ color: tool.color }}
                  >
                    {tool.name}
                  </span>
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* ─── About ─── */}
      <section id="about" className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <MapPin size={24} className="text-pink-400" />,
                title: "카페",
                desc: "편안한 카페 공간에서 아메리카노 한 잔과 함께 자유롭게 이야기 나눠요.",
                accent: "violet",
              },
              {
                icon: <Users size={24} className="text-fuchsia-400" />,
                title: "89년생~06년생",
                desc: "같은 세대 감성으로 편하게 소통할 수 있는 멤버들이 모여요.",
                accent: "cyan",
              },
              {
                icon: <Brain size={24} className="text-pink-400" />,
                title: "AI 활용 사례 공유",
                desc: "매번 모임 때 '이번 주 AI 판에서 제일 핫했던 것' 한 가지씩 들고 와요 🔥",
                accent: "pink",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    item.accent === "violet"
                      ? "bg-violet-500/10"
                      : item.accent === "cyan"
                      ? "bg-cyan-500/10"
                      : "bg-pink-500/10"
                  }`}
                >
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Welcome ─── */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-pink-400 font-medium text-sm uppercase tracking-widest mb-3">
                Welcome
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
                이런 분들 환영해요 👋
              </h2>
              <p className="text-slate-400 text-base max-w-xl mx-auto">
                AI에 관심 있다면 실력 수준 상관없이 누구나 환영합니다
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {targetAudience.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="glass-card rounded-2xl p-5 flex items-start gap-4 hover:scale-[1.02] transition-transform duration-300 cursor-default"
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                  <p className="text-slate-300 text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
              {/* Last card spans full width on 3-col */}
              <motion.div
                variants={fadeUp}
                className="glass-card rounded-2xl p-5 flex items-start gap-4 hover:scale-[1.02] transition-transform duration-300 cursor-default sm:col-span-2 lg:col-span-1"
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">🚀</span>
                <p className="text-slate-300 text-sm leading-relaxed">
                  AI로 살아남고 싶은 모든 분
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Topics ─── */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-fuchsia-400 font-medium text-sm uppercase tracking-widest mb-3">
                Topics
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
                이런 얘기 나눠요 💡
              </h2>
              <p className="text-slate-400 text-base max-w-xl mx-auto">
                수준 상관없이, 본인이 흥미로웠던 거면 뭐든 OK 👍
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {topics.map((topic) => (
                <motion.div
                  key={topic.label}
                  variants={fadeUp}
                  className="glass-card rounded-2xl p-4 text-center hover:scale-105 hover:border-cyan-500/30 transition-all duration-300 cursor-default group"
                >
                  <div className="text-3xl mb-3">{topic.icon}</div>
                  <p className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">
                    {topic.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Rule ─── */}
      <section className="relative py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              <p className="text-pink-400 font-medium text-sm uppercase tracking-widest mb-3">
                Rule
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
                모임 회칙 (딱 하나만요!)
              </h2>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="relative glass-card rounded-3xl p-8 sm:p-10 text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-pink-600/5" />
              <div className="relative">
                <div className="text-5xl mb-6">📅</div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-100 mb-4 leading-snug">
                  가입 후 2주 안에
                  <br />
                  오프라인 모임 한 번은
                  <br />
                  <span className="gradient-text">꼭 참석</span>해주세요!
                </p>
                <p className="text-slate-400 text-base">
                  유령 회원은 사양합니다 👻
                  <br />
                  <span className="text-slate-500 text-sm mt-1 block">
                    (부담 없어요, 카페에서 아메리카노 한 잔이면 돼요 ☕)
                  </span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Hot Topics Banner ─── */}
      <section className="relative py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-amber-500/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Newspaper size={22} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">
                    매번 모임 때 들고 오는 것 🔥
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    &ldquo;이번 주 AI 판에서 제일 핫했던 것&rdquo; 한 가지씩
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "새로 나온 모델·툴 소식",
                      "충격받은 활용 사례",
                      "업계 이슈 & 논란",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 mb-6">
                <Zap size={20} className="text-pink-400" />
                <span className="text-pink-400 font-medium text-sm uppercase tracking-widest">
                  Join Us
                </span>
              </div>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-4xl sm:text-5xl font-bold text-slate-100 mb-6 leading-tight"
            >
              광주에서 AI로
              <br />
              <span className="gradient-text">같이 살아남아요</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-slate-400 text-lg mb-10 leading-relaxed"
            >
              첫 모임은 어색하지만
              <br />두 번째부터 진짜 재밌어지는 거 알잖아요 😏
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="https://open.kakao.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-semibold text-base transition-all duration-300 overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #ec4899, #c084fc)",
                }}
              >
                <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                <Coffee size={18} />
                카카오 오픈채팅 참여
              </a>
              <a
                href="mailto:skyqkrwnkrd@gmail.com"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-semibold text-base glass-card text-slate-300 hover:text-white transition-all duration-300"
              >
                <Lightbulb size={18} />
                DM으로 문의
              </a>
            </motion.div>

            {/* Tags */}
            <motion.div
              variants={fadeUp}
              className="mt-12 flex flex-wrap justify-center gap-2"
            >
              {[
                "#광주모임",
                "#AI활용",
                "#AI살롱",
                "#광주AI",
                "#사이드프로젝트",
                "#광주소셜클럽",
                "#AI뉴스",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-white/4 border border-white/8 text-slate-500 text-xs"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative py-8 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600 text-sm">
          <span className="font-semibold text-slate-500">AI 살롱 광주</span>
          <span>AI는 혼자 쓰면 툴이지만, 같이 나누면 레버리지입니다 🚀</span>
        </div>
      </footer>
    </main>
  );
}
