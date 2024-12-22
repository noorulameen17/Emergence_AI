import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}<Analytics /> </body>
      </html>
    </ClerkProvider>
  );
}