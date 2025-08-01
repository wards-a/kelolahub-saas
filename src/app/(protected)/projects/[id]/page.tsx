// app/(protected)/projects/[id]/page.tsx
'use client';

import { use, useState, useEffect, FormEvent } from 'react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

// Definisikan tipe data sesuai dengan skema Prisma
interface Project {
  id: string;
  name: string;
  description: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Member {
  role: string;
  user: User;
}

interface Task {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  description?: string;
  assignee?: User;
  priority?: string;
}

export default function ProjectDashboard({ params }: { params: Promise<{ id: string }> }) {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState('unassigned');
  const [newTaskPriority, setNewTaskPriority] = useState('Low');

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const [editTaskAssigneeId, setEditTaskAssigneeId] = useState('unassigned');
  const [editTaskPriority, setEditTaskPriority] = useState('Low');
  const [editTaskStatus, setEditTaskStatus] = useState<Task['status']>('To Do');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // State untuk dialog konfirmasi hapus
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null); // State untuk tugas yang akan dihapus

  const {id} = use(params);

  // Fetch data proyek, tugas, dan anggota
  const fetchData = async () => {
    setLoading(true);
    try {
      // Ambil detail proyek
      const projectRes = await fetch(`/api/projects/${id}`);
      if (!projectRes.ok) throw new Error('Failed to fetch project details.');
      const projectData: Project = await projectRes.json();
      setProject(projectData);

      // Ambil tugas-tugas proyek
      const tasksRes = await fetch(`/api/projects/${id}/tasks`);
      if (!tasksRes.ok) throw new Error('Failed to fetch tasks.');
      const tasksData: Task[] = await tasksRes.json();
      setTasks(tasksData);

      // Ambil anggota proyek
      const membersRes = await fetch(`/api/projects/${id}/members`);
      if (!membersRes.ok) throw new Error('Failed to fetch project members.');
      const membersData: Member[] = await membersRes.json();
      setMembers(membersData);

    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleCreateTask = async (e: FormEvent) => {
    e.preventDefault();
    setIsCreatingTask(true);
    try {
      const res = await fetch(`/api/projects/${id}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
          assigneeId: newTaskAssigneeId === 'unassigned' ? null : newTaskAssigneeId,
          priority: newTaskPriority,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal membuat tugas.');
      }

      const newTask: Task = await res.json();
      setTasks(prevTasks => [...prevTasks, newTask]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskAssigneeId('unassigned');
      setNewTaskPriority('Low');
      setIsCreateDialogOpen(false);
      toast.success('Tugas baru berhasil dibuat!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleEditTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    setIsUpdatingTask(true);
    try {
      const res = await fetch(`/api/projects/${id}/tasks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: editingTask.id,
          title: editTaskTitle,
          description: editTaskDescription,
          assigneeId: editTaskAssigneeId === 'unassigned' ? null : editTaskAssigneeId,
          priority: editTaskPriority,
          status: editTaskStatus,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal mengubah tugas.');
      }

      const updatedTask: Task = await res.json();
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
      setIsEditDialogOpen(false);
      setEditingTask(null);
      toast.success('Tugas berhasil diubah!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsUpdatingTask(false);
    }
  };

  // Fungsi untuk mengelola penghapusan tugas
  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      const res = await fetch(`/api/projects/${id}/tasks`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: taskToDelete.id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal menghapus tugas.');
      }

      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDelete.id));
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
      toast.success('Tugas berhasil dihapus!');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const onEditTask = (task: Task) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description || '');
    setEditTaskAssigneeId(task.assignee?.id || 'unassigned');
    setEditTaskPriority(task.priority || 'Low');
    setEditTaskStatus(task.status);
    setIsEditDialogOpen(true);
  };

  const onStartDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };

  // Fungsi untuk mengupdate status tugas (drag-and-drop logic)
  const handleUpdateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    // Implementasi API call PUT untuk mengupdate status
    try {
        const res = await fetch(`/api/projects/${id}/tasks`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId: taskId, status: newStatus }),
        });
        if (!res.ok) throw new Error('Gagal update status tugas.');

        // Perbarui state lokal
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
            )
        );
        toast.success(`Tugas berhasil dipindahkan ke ${newStatus}.`);

    } catch (err: any) {
        toast.error(err.message);
    }
  };

  if (loading) return <div>Memuat...</div>;
  if (error) return <div>Terjadi kesalahan: {error}</div>;
  if (!project) return <div>Proyek tidak ditemukan.</div>;

  const todoTasks = tasks.filter(task => task.status === 'To Do');
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress');
  const doneTasks = tasks.filter(task => task.status === 'Done');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-extrabold text-primary">{project.name}</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" /> Tambah Tugas
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card text-foreground border-border">
            <DialogHeader>
              <DialogTitle className="text-primary">Buat Tugas Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="grid gap-4 py-4">
              <div>
                <Label htmlFor="title">Judul Tugas</Label>
                <Input
                  id="title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="bg-input text-foreground border-border mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="bg-input text-foreground border-border mt-1"
                />
              </div>
              <div>
                <Label htmlFor="assignee">Ditugaskan Kepada</Label>
                <Select
                  onValueChange={(value) => setNewTaskAssigneeId(value)}
                  value={newTaskAssigneeId}
                >
                  <SelectTrigger className="w-full bg-input mt-1">
                    <SelectValue placeholder="Pilih anggota..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card text-foreground border-border">
                    <SelectItem value="unassigned">Tidak Ditugaskan</SelectItem>
                    {members.map(member => (
                      <SelectItem key={member.user.id} value={member.user.id}>
                        {member.user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Prioritas</Label>
                <Select
                  onValueChange={(value) => setNewTaskPriority(value)}
                  value={newTaskPriority}
                >
                  <SelectTrigger className="w-full bg-input mt-1">
                    <SelectValue placeholder="Pilih prioritas..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card text-foreground border-border">
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreatingTask} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {isCreatingTask ? 'Menyimpan...' : 'Simpan Tugas'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog untuk Mengubah Tugas */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-card text-foreground border-border">
            <DialogHeader>
              <DialogTitle className="text-primary">Ubah Tugas</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditTask} className="grid gap-4 py-4">
              <div>
                <Label htmlFor="edit-title">Judul Tugas</Label>
                <Input
                  id="edit-title"
                  value={editTaskTitle}
                  onChange={(e) => setEditTaskTitle(e.target.value)}
                  className="bg-input text-foreground border-border mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Deskripsi</Label>
                <Textarea
                  id="edit-description"
                  value={editTaskDescription}
                  onChange={(e) => setEditTaskDescription(e.target.value)}
                  className="bg-input text-foreground border-border mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-assignee">Ditugaskan Kepada</Label>
                <Select
                  onValueChange={(value) => setEditTaskAssigneeId(value)}
                  value={editTaskAssigneeId}
                >
                  <SelectTrigger className="w-full bg-input mt-1">
                    <SelectValue placeholder="Pilih anggota..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card text-foreground border-border">
                    <SelectItem value="unassigned">Tidak Ditugaskan</SelectItem>
                    {members.map(member => (
                      <SelectItem key={member.user.id} value={member.user.id}>
                        {member.user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-priority">Prioritas</Label>
                <Select
                  onValueChange={(value) => setEditTaskPriority(value)}
                  value={editTaskPriority}
                >
                  <SelectTrigger className="w-full bg-input mt-1">
                    <SelectValue placeholder="Pilih prioritas..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card text-foreground border-border">
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  onValueChange={(value) => setEditTaskStatus(value as Task['status'])}
                  value={editTaskStatus}
                >
                  <SelectTrigger className="w-full bg-input mt-1">
                    <SelectValue placeholder="Pilih status..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card text-foreground border-border">
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isUpdatingTask} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {isUpdatingTask ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Dialog Konfirmasi Hapus */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Konfirmasi Hapus</DialogTitle>
                </DialogHeader>
                <div>
                    Apakah Anda yakin ingin menghapus tugas "{taskToDelete?.title}"?
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>Batal</Button>
                    <Button variant="destructive" onClick={handleDeleteTask}>Hapus</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
      <p className="text-muted-foreground mb-6">{project.description}</p>
      
      {/* Tampilkan Papan Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kolom To Do */}
        <KanbanColumn title="To Do" tasks={todoTasks} onTaskStatusChange={handleUpdateTaskStatus} onEditTask={onEditTask} onDeleteTask={onStartDeleteTask} />
        
        {/* Kolom In Progress */}
        <KanbanColumn title="In Progress" tasks={inProgressTasks} onTaskStatusChange={handleUpdateTaskStatus} onEditTask={onEditTask} onDeleteTask={onStartDeleteTask} />
        
        {/* Kolom Done */}
        <KanbanColumn title="Done" tasks={doneTasks} onTaskStatusChange={handleUpdateTaskStatus} onEditTask={onEditTask} onDeleteTask={onStartDeleteTask} />
      </div>
    </div>
  );
}

// --- Komponen KanbanColumn ---
// Komponen sederhana untuk menampilkan kolom Kanban
interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  onTaskStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

const KanbanColumn = ({ title, tasks, onTaskStatusChange, onEditTask, onDeleteTask }: KanbanColumnProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-500 bg-red-100 dark:bg-red-900';
      case 'Medium':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900';
      case 'Low':
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <Card className="bg-kanban-column text-foreground border-border shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold border-b border-border pb-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <div
              key={task.id}
              className="p-4 rounded-md bg-card-secondary border border-card-border shadow-sm relative"
            >
              {/* Tombol Hapus */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-1 right-1 text-red-500 hover:bg-red-100 hover:text-red-700 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation(); // Mencegah dialog edit terbuka saat tombol hapus diklik
                  onDeleteTask(task);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div
                className="cursor-pointer group"
                onClick={() => onEditTask(task)}
              >
                <h3 className="font-medium text-lg">{task.title}</h3>
                <p className="text-sm text-muted-foreground">{task.description || 'Tidak ada deskripsi.'}</p>
                {task.assignee && (
                  <div className="text-xs text-primary mt-2">Ditugaskan ke: {task.assignee.name}</div>
                )}
                {task.priority && (
                  <div className="text-xs font-semibold mt-2">
                    <span className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                      Prioritas: {task.priority}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground italic">Tidak ada tugas di sini.</p>
        )}
      </CardContent>
    </Card>
  );
};
