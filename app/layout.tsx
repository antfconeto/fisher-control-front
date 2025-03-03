import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/authContext";
import { UserProvider } from "@/contexts/userContext";
import "bootstrap/dist/css/bootstrap.min.css";
const poppins = Poppins({
  weight: ["200", "300", "500"],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "🐟 Fisher Control",
  description: "A project dedicate a pibic",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        <AuthProvider>
          <UserProvider>{children}</UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
