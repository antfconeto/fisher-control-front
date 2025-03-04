import Sidebar from "@/components/sideMenu/sideMenu";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
const poppins = Poppins({
  weight: ["200", "300", "500"],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "🐟 Fisher Control - Dashboard",
  description: "A project dedicate a pibic",
};
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${poppins.className}`}>
        <div className="d-flex flex-row flex-shrink-0 vh-100 vw-100">
          <Sidebar />
          {children}
        </div>
      </body>
    </html>
  );
}
