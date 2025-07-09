import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/authContext";
import { UserProvider } from "@/contexts/userContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { ErrorProvider } from "@/contexts/errorContext";
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
      <body>
        <AuthProvider>
          <ErrorProvider>
            <UserProvider>{children}</UserProvider>
          </ErrorProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
