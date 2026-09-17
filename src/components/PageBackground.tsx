// 페이지 뒤의 흐릿한 원 + 노이즈 (+ 선택적으로 격자). orbs 는 원마다 위치·크기·색·blur 클래스.
export default function PageBackground({ orbs, grid = false }: { orbs: string[]; grid?: boolean }) {
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
