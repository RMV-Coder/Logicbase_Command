import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import AntdProvider from '../providers/AntdProvider';
import './globals.css';
export const metadata: Metadata = {
  title: "Logicbase Command",
  description: "Internal support dashboard for Logicbase and MoneyCachePOS teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
          <AntdRegistry>
            <AntdProvider>
              {children}
            </AntdProvider>
          </AntdRegistry>
      </body>
    </html>
  );
}