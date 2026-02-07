import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - AI Resume Sense",
    absolute: "Resume Sense",
  },
  description:
    "Resume Sense is an AI-powered resume builder that helps you create a professional and personalized resume in minutes. With our advanced AI technology, you can easily generate a resume that highlights your skills, experience, and achievements, making it easier to land your dream job.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" suppressContentEditableWarning>
      <body className={`${inter.className}`}>
         <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <Toaster />
        </ThemeProvider>

        </body>
    </html>
    </ClerkProvider>
  );
}
