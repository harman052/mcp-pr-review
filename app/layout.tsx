import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReviewPilot",
  description:
    "An AI-powered PR review assistant built on GitHub's MCP server, using the Vercel AI SDK and Next.js.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <main className="min-h-screen">
          <div className="max-w-4xl mx-auto">
            <Header />
            <div className="min-h-[calc(100vh-8rem)] flex justify-center w-full mt-16">
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
