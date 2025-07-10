import Sidebar from "@/components/sideMenu/sideMenu";
import "./dashboard.css";

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
