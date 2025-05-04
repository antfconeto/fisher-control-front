import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/authContext";
import { UserProvider } from "@/contexts/userContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { ErrorProvider } from "@/contexts/errorContext";
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
    <html lang="pt-br">
      <body className={`${poppins.className}`}>
        <AuthProvider>
        <ErrorProvider>
            <UserProvider>{children}</UserProvider>
        </ErrorProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
