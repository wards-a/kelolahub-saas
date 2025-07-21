'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang Kami', href: '/about' },
    { name: 'Fitur', href: '/features' },
    { name: 'Daftar Tugas (DB)', href: '/tasks' },
    { name: 'Todo List (Redux)', href: '/todo' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-primary text-xl">KelolaHub</span>
        </Link>

        <nav className="flex items-center space-x-4 md:space-x-6">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} passHref>
              <Button
                variant="ghost"
                className={`text-foreground ${
                  pathname === item.href ? 'text-primary font-semibold' : 'hover:text-primary/70'
                }`}
              >
                {item.name}
              </Button>
            </Link>
          ))}
          {/* <Link href="/tasks/1" passHref>
            <Button variant="outline" className="text-foreground hover:bg-secondary/20">
              Lihat Tugas 1
            </Button>
          </Link> */}
        </nav>
      </div>
    </header>
  );
}