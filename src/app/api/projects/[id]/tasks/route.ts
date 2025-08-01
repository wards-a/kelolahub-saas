import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// Helper
async function isUserProjectMember(userId: string, projectId: string) {
  const member = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });
  return !!member;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
  }

  const resolvedParams = await params;
  const { id: projectId } = resolvedParams;

  if (!await isUserProjectMember(session.user.id, projectId)) {
    return NextResponse.json({ message: 'Akses ditolak: bukan anggota proyek' }, { status: 403 });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ message: 'Gagal mengambil tugas' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
  }

  const { id: projectId } = await params;
  const { title, description, assigneeId, dueDate, priority } = await request.json();

  if (!await isUserProjectMember(session.user.id, projectId)) {
    return NextResponse.json({ message: 'Akses ditolak: bukan anggota proyek' }, { status: 403 });
  }

  if (!title) {
    return NextResponse.json({ message: 'Judul tugas wajib diisi.' }, { status: 400 });
  }

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId: assigneeId || null,
      },
    });
    console.log("succcess");
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ message: 'Gagal membuat tugas' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
  }

  const { id: projectId } = await params;
  const { taskId, status, title, description, assigneeId, dueDate, priority } = await request.json();

  if (!await isUserProjectMember(session.user.id, projectId)) {
    return NextResponse.json({ message: 'Akses ditolak: bukan anggota proyek' }, { status: 403 });
  }

  if (!taskId) {
    return NextResponse.json({ message: 'ID tugas wajib diisi.' }, { status: 400 });
  }

  try {
    const updatedTask = await prisma.task.update({
      where: { id: taskId, projectId },
      data: {
        status,
        title,
        description,
        assigneeId,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error: any) {
    console.error('Error updating task:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Tugas tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Gagal memperbarui tugas' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
  }

  const { id: projectId } = params;
  const { taskId } = await request.json();

  if (!await isUserProjectMember(session.user.id, projectId)) {
    return NextResponse.json({ message: 'Akses ditolak: bukan anggota proyek' }, { status: 403 });
  }

  if (!taskId) {
    return NextResponse.json({ message: 'ID tugas wajib diisi.' }, { status: 400 });
  }

  try {
    await prisma.task.delete({
      where: { id: taskId, projectId },
    });

    return NextResponse.json({ message: 'Tugas berhasil dihapus' });
  } catch (error: any) {
    console.error('Error deleting task:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Tugas tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Gagal menghapus tugas' }, { status: 500 });
  }
}