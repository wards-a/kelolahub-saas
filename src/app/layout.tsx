import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { Toaster } from 'sonner';
import { ReduxProvider } from '@/redux/provider'; // Import ReduxProvider

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KelolaHub - Manajemen Tugas & Pekerjaan',
  description: 'Platform manajemen tugas dan pekerjaan yang intuitif untuk individu dan tim.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <Header />
          <main>{children}</main>
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}