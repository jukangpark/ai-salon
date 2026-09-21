// 전 페이지 공통 배경 orb — 페이지마다 색을 달리하지 않는다 (브랜드 violet + 의미색 cyan).
const DEFAULT_ORBS = [
  "top-[-10%] left-[-5%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px]",
  "bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-cyan-500/8 blur-[120px]",
];

// 페이지 뒤의 흐릿한 원 + 노이즈 (+ 선택적으로 격자). orbs 는 원마다 위치·크기·색·blur 클래스.
export default function PageBackground({ orbs = DEFAULT_ORBS, grid = false }: { orbs?: string[]; grid?: boolean }) {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none">
        {orbs.map((orb, i) => (
          <div
            key={i}
            className={`${i % 2 ? "animate-float-delay" : "animate-float"} absolute rounded-full ${orb}`}
          />
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
