import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "../../contexts/AppContext";

const inter = Inter({
  variable: "--font-inder",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deepseek Clone",
  description: "Full Stack Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <AppContextProvider>
        <html lang="en">
          <body
            className={`${inter.className} bg-[#292a2d] text-white antialiased`}
          >
            {children}
          </body>
        </html>
      </AppContextProvider>
    </ClerkProvider>
  );
}
