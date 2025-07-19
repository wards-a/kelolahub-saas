import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'; // Import PrismaClient

const prisma = new PrismaClient(); // Inisialisasi Prisma Client

// --- Mengambil Semua Data (GET) ---
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }, // Urutkan berdasarkan waktu pembuatan terbaru
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ message: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// --- Menambahkan Data Baru (POST) ---
export async function POST(request: NextRequest) {
  try {
    const { title, description, dueDate, status, priority, assignee } = await request.json();

    // Validasi dasar
    if (!title || !dueDate || !status || !priority) {
      return NextResponse.json({ message: 'Missing required fields: title, dueDate, status, priority' }, { status: 400 });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        status,
        priority,
        assignee,
      },
    });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ message: 'Failed to create task' }, { status: 500 });
  }
}

// --- Mengupdate Data (PUT) ---
export async function PUT(request: NextRequest) {
  try {
    const { id, title, description, dueDate, status, priority, assignee } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'Task ID is required for update' }, { status: 400 });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined, // Update jika ada
        status,
        priority,
        assignee,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(updatedTask);
  } catch (error: any) {
    console.error('Error updating task:', error);
    if (error.code === 'P2025') { // Prisma error code for record not found
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Failed to update task' }, { status: 500 });
  }
}

// --- Menghapus Data (DELETE) ---
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'Task ID is required for deletion' }, { status: 400 });
    }

    await prisma.task.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting task:', error);
    if (error.code === 'P2025') { // Prisma error code for record not found
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Failed to delete task' }, { status: 500 });
  }
}