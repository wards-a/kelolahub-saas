'use client'

import { use } from 'react';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

// Data tugas fiktif (simulasi dari database/API)
const dummyTasks = [
  {
    id: '1',
    title: 'Desain UI Halaman Beranda',
    description: 'Buat wireframe dan mockup untuk halaman beranda KelolaHub dengan tema pastel.',
    dueDate: '2025-07-15',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Adam',
    notes: 'Fokus pada user experience yang intuitif dan visual yang menenangkan.',
  },
  {
    id: '2',
    title: 'Implementasi Autentikasi Pengguna',
    description: 'Integrasikan sistem autentikasi (login/register) menggunakan NextAuth.js.',
    dueDate: '2025-07-20',
    status: 'To Do',
    priority: 'High',
    assignee: 'Bob',
    notes: 'Pastikan keamanan dan penanganan error yang baik.',
  },
  {
    id: '3',
    title: 'Refactor Komponen Tombol',
    description: 'Perbarui komponen Button agar lebih modular dan sesuai dengan standar Shadcn UI.',
    dueDate: '2025-07-12',
    status: 'Done',
    priority: 'Medium',
    assignee: 'Charlie',
    notes: 'Sudah selesai, perlu review terakhir.',
  },
  {
    id: '4',
    title: 'Riset Fitur Notifikasi',
    description: 'Lakukan riset tentang implementasi notifikasi push di Next.js.',
    dueDate: '2025-07-25',
    status: 'To Do',
    priority: 'Low',
    assignee: 'Adam',
    notes: 'Cari library yang ringan dan mudah diintegrasikan.',
  },
];


export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ taskId: string }>
}) {
  const { taskId } = use(params)

  // Cari tugas berdasarkan taskId
  const task = dummyTasks.find(t => t.id === taskId);

  // Jika tugas tidak ditemukan, tampilkan halaman 404
  if (!task) {
    notFound(); // Ini akan mengarahkan ke not-found.tsx
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background text-foreground">
      <Card className="w-full max-w-2xl shadow-xl p-8 bg-card border border-border">
        <CardHeader className="text-center mb-6">
          <CardTitle className="text-4xl font-extrabold text-primary mb-2">
            {task.title}
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Detail Tugas #{task.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-left">
          <p className="text-foreground text-lg leading-relaxed">
            <span className="font-semibold text-secondary-foreground">Deskripsi:</span> {task.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground">
            <p><span className="font-semibold text-accent-foreground">Batas Waktu:</span> {task.dueDate}</p>
            <p><span className="font-semibold text-accent-foreground">Status:</span> <span className={`font-bold ${task.status === 'Done' ? 'text-green-600' : task.status === 'In Progress' ? 'text-primary' : 'text-foreground'}`}>{task.status}</span></p>
            <p><span className="font-semibold text-accent-foreground">Prioritas:</span> <span className={`font-bold ${task.priority === 'High' ? 'text-destructive' : task.priority === 'Medium' ? 'text-primary' : 'text-foreground'}`}>{task.priority}</span></p>
            <p><span className="font-semibold text-accent-foreground">Ditugaskan Kepada:</span> {task.assignee}</p>
          </div>
          {task.notes && (
            <p className="text-foreground text-lg leading-relaxed pt-4 border-t border-border mt-4">
              <span className="font-semibold text-secondary-foreground">Catatan:</span> {task.notes}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center mt-8">
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:scale-105">
              Kembali ke Daftar Tugas
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}