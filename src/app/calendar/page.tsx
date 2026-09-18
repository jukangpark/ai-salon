import { Suspense } from "react";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import Notice from "@/components/Notice";
import CalendarView from "./calendar-view";

// 달력 본체는 주소(?m=·?d=)를 읽는 클라이언트 컴포넌트라 Suspense 로 감싼다 (useSearchParams 권장 패턴).
export default function CalendarPage() {
  return (
    <PageShell
      orbs={[
        "top-[-10%] left-[-5%] w-[500px] h-[500px] bg-orange-500/10 blur-[120px]",
        "bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-violet-600/10 blur-[120px]",
      ]}
    >
      <PageHeader
        className="pb-10"
        badge="📅 벙 달력"
        title="달력"
        description="살롱 벙(정모) 일정을 한눈에 봐요. 날짜를 누르면 그날 벙과 참석자가 나와요."
      />
      <section className="relative px-4 sm:px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <Suspense fallback={<Notice>불러오는 중…</Notice>}>
            <CalendarView />
          </Suspense>
        </div>
      </section>
    </PageShell>
  );
}
