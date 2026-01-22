import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import QuestPanel from "./QuestPanel";
import DevModeToggle from "./DevModeToggle";

export default function Layout() {
  return (
    <div className="min-h-screen bg-duo-dark relative">
      <Sidebar />
      <main className="ml-20 mr-96">
        <Outlet /> {/* this part constantly changes - routes render here */}
      </main>
      <QuestPanel />
      <DevModeToggle />
    </div>
  );
}
