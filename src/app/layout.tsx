import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Menu from './components/Menu'; // Ensure path is correct
import Footer from './components/Footer'; // Ensure path is correct
import { ConvexClientProvider } from "./ConvexClientProvider";
import { UserProvider } from '@auth0/nextjs-auth0/client';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LeetCoach",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <ConvexClientProvider>
            <Menu />
            {children}
            <Footer />
          </ConvexClientProvider>
        </UserProvider>
      </body>
    </html>
  );
}
