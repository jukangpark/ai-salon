"use client";

import React from "react";

export default function PosterPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ background: "#0a0a0f" }}
    >
      <p className="text-slate-500 text-xs mb-4 tracking-widest uppercase">
        20:9 포스터 — 스크린샷 후 사용하세요
      </p>

      {/* 20:9 poster container */}
      <div
        style={{
          width: "min(100vw - 64px, 900px)",
          aspectRatio: "20 / 9",
          position: "relative",
          overflow: "hidden",
          borderRadius: "16px",
          background: "#030712",
          fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
        }}
      >
        {/* Background gradient blobs */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 80% at -10% 50%, rgba(139,92,246,0.25) 0%, transparent 60%), radial-gradient(ellipse 50% 70% at 110% 50%, rgba(236,72,153,0.2) 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 50% 110%, rgba(34,211,238,0.1) 0%, transparent 60%)",
          }}
        />

        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Left decorative bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "3px",
            background: "linear-gradient(180deg, transparent, #ec4899, #c084fc, transparent)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "center",
            padding: "0 6% 0 7%",
            gap: "6%",
          }}
        >
          {/* Left: Logo + Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "10px",
              flexShrink: 0,
            }}
          >
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 12px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(244,114,182,0.3)",
                color: "#f9a8d4",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              ✦ 광주 1기 모집 중
            </div>

            {/* Logo + name row */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <img
                src="/instagram_profile.png"
                alt="AI 살롱 광주"
                style={{ width: "52px", height: "52px", borderRadius: "50%", filter: "drop-shadow(0 0 14px rgba(244,114,182,0.6))" }}
              />
              <div>
                <div
                  style={{
                    fontSize: "clamp(22px, 4vw, 36px)",
                    fontWeight: 800,
                    lineHeight: 1.1,
                    background: "linear-gradient(135deg, #f472b6, #fb7185, #c084fc)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  AI 살롱
                </div>
                <div
                  style={{
                    fontSize: "clamp(22px, 4vw, 36px)",
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: "#f1f5f9",
                  }}
                >
                  광주
                </div>
              </div>
            </div>

            {/* Tagline */}
            <div
              style={{
                fontSize: "clamp(10px, 1.4vw, 13px)",
                color: "#94a3b8",
                lineHeight: 1.6,
              }}
            >
              나 혼자 쓰면 기술,{" "}
              <span style={{ color: "#e2e8f0", fontWeight: 600 }}>
                우리 함께 나누면 가치
              </span>
            </div>

            {/* Divider */}
            <div
              style={{
                width: "100%",
                height: "1px",
                background: "linear-gradient(90deg, rgba(139,92,246,0.5), transparent)",
              }}
            />

            {/* Contact */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div
                style={{ fontSize: "clamp(9px, 1.2vw, 11px)", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span style={{ color: "#f9a8d4" }}>📸</span>
                <span style={{ color: "#94a3b8" }}>@ai_salon_official</span>
              </div>
              <div
                style={{ fontSize: "clamp(9px, 1.2vw, 11px)", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span>💬</span>
                <span style={{ color: "#94a3b8" }}>카카오 오픈채팅 참여</span>
              </div>
            </div>
          </div>

          {/* Vertical divider */}
          <div
            style={{
              width: "1px",
              alignSelf: "stretch",
              margin: "12% 0",
              background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent)",
              flexShrink: 0,
            }}
          />

          {/* Right: Info cards */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {/* Top row: 3 mini cards */}
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { icon: "👤", label: "연령", value: "89~06년생" },
                { icon: "💰", label: "회비", value: "월 2,000원" },
                { icon: "📅", label: "납부일", value: "매월 5일" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    padding: "8px 10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "3px",
                  }}
                >
                  <div style={{ fontSize: "10px", color: "#64748b" }}>
                    {item.icon} {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "clamp(9px, 1.3vw, 12px)",
                      color: "#e2e8f0",
                      fontWeight: 700,
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Topics */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "10px",
                padding: "10px 12px",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(8px, 1.1vw, 10px)",
                  color: "#64748b",
                  marginBottom: "7px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                이런 얘기 해요
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {[
                  "AI 툴 꿀팁",
                  "업무 자동화",
                  "이미지·영상 생성",
                  "AI 부업",
                  "개발에 AI 녹이기",
                  "AI 뉴스",
                ].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "3px 8px",
                      borderRadius: "999px",
                      background: "rgba(139,92,246,0.12)",
                      border: "1px solid rgba(139,92,246,0.25)",
                      color: "#a78bfa",
                      fontSize: "clamp(8px, 1vw, 10px)",
                      fontWeight: 500,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Rule */}
            <div
              style={{
                background: "rgba(236,72,153,0.06)",
                border: "1px solid rgba(236,72,153,0.18)",
                borderRadius: "10px",
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "14px" }}>📌</span>
              <span
                style={{
                  fontSize: "clamp(8px, 1.1vw, 11px)",
                  color: "#fda4af",
                  lineHeight: 1.4,
                }}
              >
                가입 후 <strong>2주 안에 오프라인 모임 1회 참석</strong> 필수
                <span style={{ color: "#64748b", marginLeft: "6px" }}>유령 회원 사양 👻</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom right watermark */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "16px",
            fontSize: "9px",
            color: "rgba(255,255,255,0.15)",
            letterSpacing: "0.06em",
          }}
        >
          AI 살롱 광주 · 1기
        </div>
      </div>

      <p className="text-slate-600 text-xs mt-4">
        브라우저 창 너비를 고정한 뒤 스크린샷 — 권장 창 너비 960px
      </p>
    </main>
  );
}
