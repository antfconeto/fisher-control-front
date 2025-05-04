import Sidebar from "@/components/sideMenu/sideMenu";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./dashboard.css";

const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

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
        <div className="dashboard-container">
          <Sidebar />
          <main className="dashboard-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
