import type { PropsWithChildren } from "react";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="p-4 lg:ml-72">{children}</main>
    </div>
  );
}

