import { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://shaadi-planner-harsha-bhuvi.vercel.app"),
  title: "Harsha & Bhuvi's Wedding Planner | ShaadiPlanner",
  description: "Auspicious wedding planning, day & night mode, and smart cost-split ledger for Harsha & Bhuvi's wedding.",
  openGraph: {
    title: "Harsha & Bhuvi's Wedding Planner | ShaadiPlanner",
    description: "Auspicious wedding planning, day & night mode, and smart cost-split ledger for Harsha & Bhuvi's wedding.",
    type: "website",
    siteName: "ShaadiPlanner",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "Harsha & Bhuvi's Wedding Planner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Harsha & Bhuvi's Wedding Planner | ShaadiPlanner",
    description: "Auspicious wedding planning, day & night mode, and smart cost-split ledger for Harsha & Bhuvi's wedding.",
    images: ["/favicon.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.png?v=2", type: "image/png" },
      { url: "/favicon.ico?v=2" },
      { url: "/favicon.svg?v=2", type: "image/svg+xml" }
    ],
    shortcut: "/favicon.png?v=2",
    apple: "/favicon.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png?v=2" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" href="/favicon.png?v=2" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
