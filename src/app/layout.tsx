import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bhuvesh & Harsha's Wedding Planner | ShaadiPlanner",
  description: "Auspicious wedding planning and smart cost-split ledger for Bhuvesh & Harsha's wedding.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
