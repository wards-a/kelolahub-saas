import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Atau font lain yang Anda gunakan
import './globals.css';
import Header from '@/components/Header'; // Import komponen Header

const inter = Inter({ subsets: ['latin'] }); // Jika Anda menggunakan font Inter

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
        <Header /> {/* Tambahkan komponen Header di sini */}
        <main>{children}</main> {/* Konten halaman akan dirender di sini */}
      </body>
    </html>
  );
}