import Nav from "@/components/Nav";
import PageBackground from "@/components/PageBackground";
import SiteFooter from "@/components/SiteFooter";

// 네비게이션 + 배경 + 푸터가 붙는 일반 페이지 틀.
export default function PageShell({
  orbs,
  grid,
  children,
}: {
  orbs?: string[];
  grid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Nav />
      <PageBackground orbs={orbs} grid={grid} />
      {children}
      <SiteFooter />
    </main>
  );
}
