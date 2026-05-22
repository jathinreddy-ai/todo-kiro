// Root layout — renders the gradient mesh background and glass/solid surfaces.
import { useState } from "react";
import { useUI } from "../../context/UIContext";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function Layout({ children, onNewTask }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { glassMode } = useUI();

  return (
    // Full-screen container — position relative so the fixed .app-bg sits behind everything
    <div className="relative flex h-screen overflow-hidden">
      {/* ── Gradient mesh background scene ── */}
      <div className="app-bg" aria-hidden="true">
        <div className="orb3" />
      </div>

      {/* ── Content layer (above the background) ── */}
      <div className="relative z-10 flex w-full h-full">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewTask={() => {
            setSidebarOpen(false);
            onNewTask();
          }}
          glassMode={glassMode}
        />

        {/* Main column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            glassMode={glassMode}
          />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
