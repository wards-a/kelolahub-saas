'use client';

import { useState, useEffect, FormEvent } from 'react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  description: string;
  _count: {
    members: number;
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) {
        throw new Error('Gagal mengambil daftar proyek.');
      }
      const data: Project[] = await res.json();
      setProjects(data);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName, description: projectDescription }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal membuat proyek.');
      }

      const newProject: Project = await res.json();
      setProjects(prev => [...prev, newProject]);
      setProjectName('');
      setProjectDescription('');
      setIsDialogOpen(false);
      toast.success('Proyek baru berhasil dibuat!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-xl text-primary">Memuat proyek...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-xl text-destructive">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-primary">Proyek Saya</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Buat Proyek Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card text-foreground border-border">
            <DialogHeader>
              <DialogTitle className="text-primary">Buat Proyek Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateProject} className="grid gap-4 py-4">
              <div>
                <Label htmlFor="name" className="text-right">Nama Proyek</Label>
                <Input
                  id="name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-input text-foreground border-border mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-right">Deskripsi (Opsional)</Label>
                <Input
                  id="description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="bg-input text-foreground border-border mt-1"
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {isCreating ? 'Membuat...' : 'Buat Proyek'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map(project => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:scale-105 transition-transform bg-card text-foreground border border-border shadow-lg cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-muted-foreground">{project.description || 'Tidak ada deskripsi.'}</CardDescription>
                  <div className="text-sm text-secondary-foreground font-medium">
                    {project._count.members} Anggota
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground italic text-lg mt-12">
            Anda belum menjadi anggota proyek manapun.
          </p>
        )}
      </div>
    </div>
  );
}