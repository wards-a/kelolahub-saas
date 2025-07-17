import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // Untuk menghasilkan ID unik

// --- Data Statis (Simulasi Database) ---
let tasks: Task[] = [
  {
    id: '1',
    title: 'Desain UI Halaman Beranda',
    description: 'Buat wireframe dan mockup untuk halaman beranda KelolaHub dengan tema pastel.',
    dueDate: '2025-07-15',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Alice',
    createdAt: '2025-07-01T10:00:00Z',
    updatedAt: '2025-07-10T14:30:00Z',
  },
  {
    id: '2',
    title: 'Implementasi Autentikasi Pengguna',
    description: 'Integrasikan sistem autentikasi (login/register) menggunakan NextAuth.js.',
    dueDate: '2025-07-20',
    status: 'To Do',
    priority: 'High',
    assignee: 'Bob',
    createdAt: '2025-07-05T09:00:00Z',
    updatedAt: '2025-07-05T09:00:00Z',
  },
  {
    id: '3',
    title: 'Refactor Komponen Tombol',
    description: 'Perbarui komponen Button agar lebih modular dan sesuai dengan standar Shadcn UI.',
    dueDate: '2025-07-12',
    status: 'Done',
    priority: 'Medium',
    assignee: 'Charlie',
    createdAt: '2025-07-03T11:00:00Z',
    updatedAt: '2025-07-12T16:00:00Z',
  },
];

// Pastikan tipe Task didefinisikan atau diimpor di tempat lain
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  assignee: string;
  createdAt: string;
  updatedAt: string;
}


// --- Mengambil Semua Data (GET) ---
export async function GET() {
  return NextResponse.json(tasks);
}

// --- Menambahkan Data Baru (POST) ---
export async function POST(request: NextRequest) {
  const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = await request.json();

  if (!newTask.title || !newTask.description || !newTask.dueDate || !newTask.status || !newTask.priority || !newTask.assignee) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const taskWithId: Task = {
    ...newTask,
    id: uuidv4(), // Generate ID unik
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(taskWithId);
  return NextResponse.json(taskWithId, { status: 201 }); // 201 Created
}

// --- Mengupdate Data (PUT) ---
export async function PUT(request: NextRequest) {
  const updatedTaskData: Partial<Task> & { id: string } = await request.json(); // Membutuhkan ID di body

  if (!updatedTaskData.id) {
    return NextResponse.json({ message: 'Task ID is required for update' }, { status: 400 });
  }

  const taskIndex = tasks.findIndex(task => task.id === updatedTaskData.id);

  if (taskIndex === -1) {
    return NextResponse.json({ message: 'Task not found' }, { status: 404 });
  }

  const existingTask = tasks[taskIndex];
  const updatedTask = {
    ...existingTask,
    ...updatedTaskData,
    updatedAt: new Date().toISOString(), // Update timestamp
  };

  tasks[taskIndex] = updatedTask;
  return NextResponse.json(updatedTask);
}

// --- Menghapus Data (DELETE) ---
export async function DELETE(request: NextRequest) {
  const { id }: { id: string } = await request.json(); // Membutuhkan ID di body

  if (!id) {
    return NextResponse.json({ message: 'Task ID is required for deletion' }, { status: 400 });
  }

  const initialLength = tasks.length;
  tasks = tasks.filter(task => task.id !== id);

  if (tasks.length === initialLength) {
    return NextResponse.json({ message: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
}