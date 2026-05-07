import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Rubik as Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const roboto = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-google-sans",
});

export const metadata: Metadata = {
  title: "Stock Manager - Sistema de Gestão de Stock",
  description:
    "Sistema profissional de gestão de stock, vendas e relatórios diários",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt" suppressHydrationWarning>
        <body
          className={`${roboto.className} antialiased bg-background text-foreground [&::-webkit-scrollbar]:w-2 min-w-[350px] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-track]:bg-zinc-100`}
        >
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <Navbar />
            <main className="h-screen mt-12">
              <div className="max-w-7xl px-4 py-8 mx-auto">
                {children}
                <Toaster richColors position="bottom-center" />
              </div>
            </main>
          </ThemeProvider>
          {process.env.NODE_ENV === "production" && <Analytics />}
        </body>
      </html>
    </ClerkProvider>
  );
}
