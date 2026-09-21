// 전 페이지 공통 배경 — 흐릿한 원 2개(브랜드 violet + 의미색 cyan) + 노이즈 (+ 선택적으로 격자).
// 원은 filter: blur(120px) 대신 원형 그라데이션으로 그린다. 반경 120px 블러는 모바일에서 거대한 텍스처를 만든다.
// 값은 "지름 500px·400px 원을 blur(120px) 한 밝기"를 따라 맞췄다 (블러가 번지는 만큼 상자를 240px씩 키움).
const ORBS: React.CSSProperties[] = [
  {
    top: "calc(-10% - 240px)",
    left: "calc(-5% - 240px)",
    width: 980,
    height: 980,
    background:
      "radial-gradient(closest-side, rgb(124 58 237 / 0.089), rgb(124 58 237 / 0.08) 25%, rgb(124 58 237 / 0.05) 51%, rgb(124 58 237 / 0.016) 75%, transparent)",
  },
  {
    bottom: "calc(20% - 240px)",
    right: "calc(-10% - 240px)",
    width: 880,
    height: 880,
    background:
      "radial-gradient(closest-side, rgb(6 182 212 / 0.06), rgb(6 182 212 / 0.054) 23%, rgb(6 182 212 / 0.036) 45%, rgb(6 182 212 / 0.012) 73%, transparent)",
  },
];

export default function PageBackground({ grid = false }: { grid?: boolean }) {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none">
        {ORBS.map((style, i) => (
          <div key={i} className="absolute" style={style} />
        ))}
      </div>
      <div className="fixed inset-0 noise opacity-50 pointer-events-none" />
      {grid && (
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      )}
    </>
  );
}
