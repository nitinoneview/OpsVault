import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpsVault - Technical Knowledge Base",
  description: "A private, searchable knowledge base for Production Support, DevOps, Linux, Cloud, Databases, Networking, Troubleshooting, and Technical Interview Preparation",
  keywords: ["DevOps", "Production Support", "Linux", "AWS", "Technical Interview", "Knowledge Base", "Incident Management"],
  authors: [{ name: "Nitin", url: "https://github.com/nitinoneview" }],
  openGraph: {
    title: "OpsVault - Technical Knowledge Base",
    description: "A private, searchable knowledge base for Production Support Engineers",
    url: "https://opsvault-jet.vercel.app",
    siteName: "OpsVault",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Theme initialization script to prevent flash of unstyled content */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const isDark = saved ? saved === 'dark' : prefersDark;
                  
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  console.error('Theme initialization failed:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
