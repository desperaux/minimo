import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "minimo — Send invoices. Get paid. Move on.",
  description: "Simple invoicing for independent businesses.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" style={{ colorScheme: "dark" }}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
