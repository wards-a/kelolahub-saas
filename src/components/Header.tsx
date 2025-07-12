'use client'; // Pastikan ini ada jika Anda menggunakan hooks atau event listener di masa depan

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Untuk menandai link aktif
import { Button } from '@/components/ui/button'; // Shadcn UI Button

export default function Header() {
  const pathname = usePathname(); // Hook untuk mendapatkan path URL saat ini

  // Definisikan item navigasi
  const navItems = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang Kami', href: '/about' },
    { name: 'Fitur', href: '/features' },
    // Anda bisa tambahkan link lain di sini, misalnya untuk login/register
    // { name: 'Login', href: '/login' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo/Nama Aplikasi */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-primary text-xl">KelolaHub</span>
        </Link>

        {/* Navigasi Utama */}
        <nav className="flex items-center space-x-4 md:space-x-6">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} passHref>
              <Button
                variant="ghost" // Gaya tombol ghost dari Shadcn UI
                className={`text-foreground ${
                  pathname === item.href ? 'text-primary font-semibold' : 'hover:text-primary/70'
                }`}
              >
                {item.name}
              </Button>
            </Link>
          ))}
          {/* Contoh tombol untuk dynamic route (misalnya ke detail tugas ID 1) */}
          <Link href="/tasks/1" passHref>
            <Button variant="outline" className="text-foreground hover:bg-secondary/20">
              Lihat Tugas 1
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}