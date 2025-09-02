import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "../../contexts/AppContext";
import { Toaster } from "react-hot-toast";
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
            <Toaster
              toastOptions={{
                success: { style: { background: "black", color: "white" } },
                error: { style: { background: "black", color: "white" } },
              }}
            />
            {children}
          </body>
        </html>
      </AppContextProvider>
    </ClerkProvider>
  );
}
