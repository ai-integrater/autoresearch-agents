import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/auth/msal-provider";

export const metadata: Metadata = {
  title: "PortalBridge",
  description: "One command center for every business dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
