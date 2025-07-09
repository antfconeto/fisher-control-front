import Sidebar from "@/components/sideMenu/sideMenu";
import type { Metadata } from "next";
import "./dashboard.css";
import { NotificationProvider } from "@/contexts/notificationContext";
import { NotificationContainer } from "@/components/NotificationToast";

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
      <body className={`${poppins.className}`}>
        <NotificationProvider>
        <div className="dashboard-container">
          <Sidebar />
          <main className="dashboard-content">{children}</main>
        </div>
        <NotificationContainer />
        </NotificationProvider>
      </body>
    </html>
  );
}
