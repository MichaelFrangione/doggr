import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { themeConfig } from "./theme.config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doggr",
  description: "Find a furry friend that matches you best!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${styles.body}`}
      >
        <Theme
          accentColor={themeConfig.accentColor}
          grayColor={themeConfig.grayColor}
          radius={themeConfig.radius}
          scaling={themeConfig.scaling}
          appearance={themeConfig.appearance}
          panelBackground={themeConfig.panelBackground}
        >
          {children}
        </Theme>
      </body>
    </html>
  );
}
