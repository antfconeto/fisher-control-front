import Sidebar from "@/components/sideMenu/sideMenu";
import type { Metadata } from "next";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "🐟 Fisher Control - Dashboard",
  description: "Sistema de gerenciamento para piscicultura",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <div className="dashboard-container">
          <Sidebar />
          <main className="dashboard-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
