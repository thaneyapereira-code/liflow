import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LIFLOW — Sua vida em fluxos",
  description: "O hub pessoal para organizar finanças, metas e toda a sua vida."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
