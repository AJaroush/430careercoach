import { ReactNode } from "react";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900">
      <AppHeader />
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 p-6 bg-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
}
