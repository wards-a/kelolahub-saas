'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const publicNavItems = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang Kami', href: '/about' },
    { name: 'Fitur', href: '/features' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-primary text-xl">KelolaHub</span>
        </Link>

        <nav className="flex items-center space-x-4 md:space-x-6">
          {publicNavItems.map((item) => (
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
          {!session?.user && (
            <>
              <Link href="/login" passHref>
                <Button variant="outline" className="text-primary border-primary hover:bg-primary/10">
                  Login
                </Button>
              </Link>
              {/* <Link href="/register" passHref>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                  Daftar
                </Button>
              </Link> */}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}