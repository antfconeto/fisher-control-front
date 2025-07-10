import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/authContext";
import { UserProvider } from "@/contexts/userContext";
import { LoadingProvider } from "@/contexts/loadingContext";
import GlobalLoading from "@/components/GlobalLoading/GlobalLoading";
import "bootstrap/dist/css/bootstrap.min.css";
import { ErrorProvider } from "@/contexts/errorContext";

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
            <LoadingProvider>
                <UserProvider>
                  {children}
                  <GlobalLoading />
                </UserProvider>
            </LoadingProvider>
          </ErrorProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
