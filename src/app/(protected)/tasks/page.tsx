'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState<boolean>(false);
  const [isUpdateTaskDialogOpen, setIsUpdateTaskDialogOpen] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    dueDate: '',
    status: 'To Do',
    priority: 'Low',
    assignee: '',
  });

  // --- Fetch Semua Data (READ) ---
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data: Task[] = await res.json();
      // Format dueDate dari Date object ke string YYYY-MM-DD untuk input type="date"
      const formattedData = data.map(task => ({
        ...task,
        dueDate: new Date(task.dueDate).toISOString().split('T')[0] // Ambil hanya tanggal
      }));
      setTasks(formattedData);
    } catch (err: unknown) {
      console.error('Failed to fetch tasks:', err);
      setError('Gagal memuat tugas. Silakan coba lagi.');
      toast.error('Gagal memuat tugas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // --- Handle Input Form ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: keyof Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value as string }));
  };

  // --- Tambahkan Data Baru (CREATE) ---
  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const newTask: Task = await res.json();
      // Format dueDate dari Date object ke string YYYY-MM-DD
      const formattedNewTask = {
        ...newTask,
        dueDate: new Date(newTask.dueDate).toISOString().split('T')[0]
      };
      setTasks(prevTasks => [...prevTasks, formattedNewTask]);
      setIsNewTaskDialogOpen(false);
      setFormData({
        title: '', description: '', dueDate: '', status: 'To Do', priority: 'Low', assignee: ''
      }); // Reset form
      toast.success('Tugas baru berhasil ditambahkan!');
    } catch (err: unknown) {
      console.error('Failed to add task:', err);
      if (err instanceof Error) {        
        setError(`Gagal menambahkan tugas: ${err.message}`);
        toast.error(`Gagal menambahkan tugas: ${err.message}`);
      }
    }
  };

  // --- Siapkan Form untuk Update ---
  const openUpdateDialog = (task: Task) => {
    setCurrentTask(task);

    setFormData({
      title: task.title,
      description: task.description || '',
      dueDate: new Date(task.dueDate).toISOString().split('T')[0],
      status: task.status,
      priority: task.priority,
      assignee: task.assignee || '',
    });
    setIsUpdateTaskDialogOpen(true);
  };

  // --- Update Data (UPDATE) ---
  const handleUpdateTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentTask) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, id: currentTask.id }), // Kirim ID bersama data
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const updatedTask: Task = await res.json();
      // Format dueDate dari Date object ke string YYYY-MM-DD
      const formattedUpdatedTask = {
        ...updatedTask,
        dueDate: new Date(updatedTask.dueDate).toISOString().split('T')[0]
      };
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === formattedUpdatedTask.id ? formattedUpdatedTask : task))
      );
      setIsUpdateTaskDialogOpen(false);
      setCurrentTask(null);
      setFormData({
        title: '', description: '', dueDate: '', status: 'To Do', priority: 'Low', assignee: ''
      }); // Reset form
      toast.success('Tugas berhasil diperbarui!');
    } catch (err: unknown) {
      console.error('Failed to update task:', err);
      if (err instanceof Error) {        
        setError(`Gagal memperbarui tugas: ${err.message}`);
        toast.error(`Gagal memperbarui tugas: ${err.message}`);
      }
    }
  };

  // --- Hapus Data (DELETE) ---
  const handleDeleteTask = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tugas ini?')) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      toast.success('Tugas berhasil dihapus!');
    } catch (err: unknown) {
      console.error('Failed to delete task:', err);
      if (err instanceof Error) {        
        setError(`Gagal menghapus tugas: ${err.message}`);
        toast.error(`Gagal menghapus tugas: ${err.message}`);
      }
    }
  };

  // --- Fungsi Pembantu untuk Styling Status/Prioritas ---
  const getStatusColorClass = (status: Task['status']) => {
    switch (status) {
      case 'To Do': return 'bg-muted text-muted-foreground';
      case 'In Progress': return 'bg-primary/20 text-primary-foreground';
      case 'Done': return 'bg-green-100 text-green-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColorClass = (priority: Task['priority']) => {
    switch (priority) {
      case 'Low': return 'bg-blue-100 text-blue-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'High': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background text-foreground">
        <p className="text-xl text-primary">Memuat tugas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-background text-destructive">
        <p className="text-xl mb-4">Error: {error}</p>
        <Button onClick={fetchTasks} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 bg-background text-foreground min-h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-primary">Daftar Tugas</h1>
        <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-md">
              + Tambah Tugas Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card text-foreground border border-border">
            <DialogHeader>
              <DialogTitle className="text-primary">Tambah Tugas Baru</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Isi detail tugas baru yang ingin Anda tambahkan.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddTask} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Judul</Label>
                <Input id="title" value={formData.title} onChange={handleInputChange} className="col-span-3 bg-input text-foreground border-border" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Deskripsi</Label>
                <Textarea id="description" value={formData.description || ''} onChange={handleInputChange} className="col-span-3 bg-input text-foreground border-border" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">Batas Waktu</Label>
                <Input type="date" id="dueDate" value={formData.dueDate} onChange={handleInputChange} className="col-span-3 bg-input text-foreground border-border" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select onValueChange={(val) => handleSelectChange('status', val)} value={formData.status}>
                  <SelectTrigger id="status" className="col-span-3 bg-input text-foreground border-border">
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-foreground border-border">
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">Prioritas</Label>
                <Select onValueChange={(val) => handleSelectChange('priority', val)} value={formData.priority}>
                  <SelectTrigger id="priority" className="col-span-3 bg-input text-foreground border-border">
                    <SelectValue placeholder="Pilih Prioritas" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-foreground border-border">
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assignee" className="text-right">Penugas</Label>
                <Input id="assignee" value={formData.assignee || ''} onChange={handleInputChange} className="col-span-3 bg-input text-foreground border-border" />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">Tambah Tugas</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {tasks.length === 0 ? (
        <p className="text-center text-xl text-muted-foreground mt-12">Belum ada tugas. Ayo tambahkan yang pertama!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <Card key={task.id} className="bg-card text-foreground border border-border shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-primary text-2xl mb-2">{task.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {task.description && task.description.length > 100 ? `${task.description.substring(0, 100)}...` : task.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><span className="font-semibold text-accent-foreground">Batas Waktu:</span> {task.dueDate}</p>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-accent-foreground">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClass(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-accent-foreground">Prioritas:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColorClass(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <p><span className="font-semibold text-accent-foreground">Penugas:</span> {task.assignee}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => openUpdateDialog(task)} className="text-primary border-primary hover:bg-primary/10">
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteTask(task.id)} className="shadow-md">
                  Hapus
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* --- Dialog untuk Update Tugas --- */}
      <Dialog open={isUpdateTaskDialogOpen} onOpenChange={setIsUpdateTaskDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card text-foreground border border-border">
          <DialogHeader>
            <DialogTitle className="text-primary">Perbarui Tugas</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Perbarui detail untuk tugas ini.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateTask} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Judul</Label>
              <Input id="title" value={formData.title} onChange={handleInputChange} className="col-span-3 bg-input text-foreground border-border" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Deskripsi</Label>
              <Textarea id="description" value={formData.description || ''} onChange={handleInputChange} className="col-span-3 bg-input text-foreground border-border" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">Batas Waktu</Label>
              <Input type="date" id="dueDate" value={formData.dueDate} onChange={handleInputChange} className="col-span-3 bg-input text-foreground border-border" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select onValueChange={(val) => handleSelectChange('status', val)} value={formData.status}>
                <SelectTrigger id="status" className="col-span-3 bg-input text-foreground border-border">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-foreground border-border">
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">Prioritas</Label>
              <Select onValueChange={(val) => handleSelectChange('priority', val)} value={formData.priority}>
                <SelectTrigger id="priority" className="col-span-3 bg-input text-foreground border-border">
                  <SelectValue placeholder="Pilih Prioritas" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-foreground border-border">
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignee" className="text-right">Penugas</Label>
              <Input id="assignee" value={formData.assignee || ''} onChange={handleInputChange} className="col-span-3 bg-input text-foreground border-border" />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}