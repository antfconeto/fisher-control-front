import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/authContext";
import { UserProvider } from "@/contexts/userContext";
import { NotificationProvider } from "@/contexts/notificationContext";
import { LoadingProvider } from "@/contexts/loadingContext";
import GlobalLoading from "@/components/GlobalLoading/GlobalLoading";
import "bootstrap/dist/css/bootstrap.min.css";
import { ErrorProvider } from "@/contexts/errorContext";
import { NotificationContainer } from "@/components/NotificationToast";

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
      <body>
        <AuthProvider>
          <ErrorProvider>
            <LoadingProvider>
              <NotificationProvider>
                <UserProvider>
                  {children}
                  <GlobalLoading />
                </UserProvider>
              </NotificationProvider>
            </LoadingProvider>

          </ErrorProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
