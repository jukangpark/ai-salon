import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from "react-router";
import "@fontsource-variable/geist";
import "./globals.css";
import HomePage from "@/pages/HomePage";
import MembersPage from "@/pages/MembersPage";
import MemberDetailPage from "@/pages/MemberDetailPage";
import CommandsPage from "@/pages/CommandsPage";
import StudyPage from "@/pages/StudyPage";
import StatsPage from "@/pages/stats/StatsPage";
import CalendarPage from "@/pages/calendar/CalendarPage";
import RulesPage from "@/pages/RulesPage";
import InvitationPage from "@/pages/InvitationPage";
import PosterPage from "@/pages/PosterPage";
import NotFoundPage from "@/pages/NotFoundPage";

// 페이지 이동 시 맨 위로, 뒤로 가기 시 원래 스크롤 위치로.
function RootLayout() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/members", element: <MembersPage /> },
      { path: "/members/:userId", element: <MemberDetailPage /> },
      { path: "/commands", element: <CommandsPage /> },
      { path: "/study", element: <StudyPage /> },
      { path: "/stats", element: <StatsPage /> },
      { path: "/calendar", element: <CalendarPage /> },
      { path: "/rules", element: <RulesPage /> },
      { path: "/invitation", element: <InvitationPage /> },
      { path: "/poster", element: <PosterPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
