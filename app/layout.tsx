import type { Metadata } from "next";
import Providers from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "minimo — Send invoices. Get paid. Move on.",
  description: "Simple invoicing for independent businesses.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" style={{ colorScheme: "dark" }}>
      <Providers>
        <body>
          <a className="skip-link" href="#main-content">Skip to main content</a>
          {children}
        </body>
      </Providers>
    </html>
  );
}
