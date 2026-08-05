import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/AuthContext";
import { SessionProvider } from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "VulnScanner — Web Vulnerability Scanner",
  description:
    "Enterprise-grade web security scanning with AI-powered fix recommendations. Detect SQL injection, XSS, CSRF, misconfigurations and more.",
  keywords:
    "vulnerability scanner, web security, OWASP, XSS, SQL injection, penetration testing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="overflow-x-hidden font-sans antialiased">
        <SessionProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
