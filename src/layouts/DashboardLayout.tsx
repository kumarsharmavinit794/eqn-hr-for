import { useState, createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { TopNav } from "@/components/TopNav";

interface LayoutContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
});

export const useLayout = () => useContext(LayoutContext);

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const desktopSidebarOffset = sidebarOpen ? "lg:pl-[260px]" : "lg:pl-[72px]";

  return (
    <LayoutContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      
      {/* 🔥 FULL LAYOUT */}
      <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground">

        {/* ✅ DESKTOP SIDEBAR */}
        <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
          <AppSidebar
            open={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>

        {/* ✅ MOBILE SIDEBAR */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div className="relative z-10 h-full">
              <AppSidebar
                open={sidebarOpen}
                onToggle={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* ✅ MAIN CONTENT */}
        <div className={`flex min-h-screen w-full flex-col transition-[padding] duration-300 ${desktopSidebarOffset}`}>

          {/* Top Navbar */}
          <TopNav onMenuClick={() => setSidebarOpen(true)} />

          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto px-3 py-4 sm:px-5 sm:py-5 md:px-6 lg:px-8">
            <Outlet />
          </main>

        </div>

      </div>
    </LayoutContext.Provider>
  );
}
