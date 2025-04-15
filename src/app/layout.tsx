import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BiedMeer Demo",
  description: "Demo application for BiedMeer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Add a monitoring script to test if Sentry is capturing errors */}
        <Script id="sentry-test" strategy="afterInteractive">
          {`
            console.log("Sentry test script loaded");
            // This adds a test function to the window object
            window.testSentryError = function() {
              console.log("Manual error test triggered");
              throw new Error("Manual error triggered from layout script at " + new Date().toISOString());
            };
            
            // Add a global error handler to log error events
            window.addEventListener('error', function(event) {
              console.log("Global error caught:", event.error);
            });
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
