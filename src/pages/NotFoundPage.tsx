import { Link } from "react-router";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";

export default function NotFoundPage() {
  return (
    <PageShell>
      <PageHeader
        badge="404"
        title="페이지를 찾을 수 없어요"
        description={
          <>
            주소가 바뀌었거나 없는 페이지예요.{" "}
            <Link to="/" className="text-violet-300 hover:text-violet-200">
              홈으로
            </Link>
          </>
        }
      />
    </PageShell>
  );
}
