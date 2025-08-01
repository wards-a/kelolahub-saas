'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal mendaftar.');
      }

      toast.success('Pendaftaran berhasil! Silakan login.');
      router.push('/login');
    } catch (error: unknown) {
      console.error('Registration error:', error);
      if (error instanceof Error) {        
        toast.error(error.message || 'Terjadi kesalahan saat pendaftaran.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-background text-foreground">
      <Card className="w-full max-w-md bg-card text-foreground border border-border shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Daftar Akun Baru</CardTitle>
          <CardDescription className="text-muted-foreground">
            Buat akun KelolaHub Anda untuk mulai mengelola tugas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="grid gap-4">
            <div>
              <Label htmlFor="name" className='mb-1.5'>Nama</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nama Lengkap Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-input text-foreground border-border"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className='mb-1.5'>Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input text-foreground border-border"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className='mb-1.5'>Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input text-foreground border-border"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md" disabled={loading}>
              {loading ? 'Mendaftar...' : 'Daftar'}
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Login di sini
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}