'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'sonner';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const protectedNavItems = [
    { name: 'Todo List', href: '/todo' },
    { name: 'Daftar Tugas', href: '/tasks' },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
    toast.info('Anda telah logout.');
  };

  if (status === 'loading') {
    return (
      <aside className="w-64 p-4 border-r border-border bg-sidebar text-sidebar-foreground flex flex-col justify-between">
        <div className="text-center">Memuat sidebar...</div>
      </aside>
    );
  }

  return (
    <aside className="w-64 p-4 border-r border-border bg-sidebar text-sidebar-foreground flex flex-col justify-between">
      <div>
        {session?.user ? (
          <Card className="mb-6 bg-sidebar-primary/10 border-sidebar-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sidebar-primary text-lg">Selamat Datang,</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-sidebar-foreground">{session.user.name || session.user.email}</p>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 bg-sidebar-accent/10 border-sidebar-border shadow-sm">
            <CardContent className="py-4 text-center text-sidebar-foreground">
              Anda belum login.
            </CardContent>
          </Card>
        )}

        <nav className="flex flex-col space-y-2">
          {protectedNavItems.map((item) => (
            <Link key={item.name} href={item.href} passHref>
              <Button
                variant="ghost"
                className={`w-full justify-start text-sidebar-foreground ${
                  pathname === item.href ? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold hover:bg-sidebar-primary/90' : 'hover:bg-sidebar-accent/20'
                }`}
              >
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      {session?.user && (
        <Button
          onClick={handleSignOut}
          className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-md mt-auto"
        >
          Logout
        </Button>
      )}
    </aside>
  );
}