import Sidebar from "@/components/sideMenu/sideMenu";
import "./dashboard.css";
import { Metadata } from "next";



export const metadata: Metadata = {
  title: 'Dashboard - Fisher Control',
  description: 'Painel de controle do sistema de pesca',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-content">{children}</main>
    </div>
  );
}
