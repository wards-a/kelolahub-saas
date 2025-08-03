
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();


async function getProjectMember(userId: string, projectId: string) {
  return prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });
}


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
  }

  const { id: projectId } = await params;

  
  const member = await getProjectMember(session.user.id, projectId);
  if (!member) {
    return NextResponse.json({ message: 'Akses ditolak: bukan anggota proyek' }, { status: 403 });
  }

  try {
    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ message: 'Gagal mengambil anggota' }, { status: 500 });
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
  const { email } = await request.json();

  
  const userMember = await getProjectMember(session.user.id, projectId);
  if (!userMember || userMember.role !== 'owner') {
    return NextResponse.json({ message: 'Akses ditolak: hanya owner yang bisa menambahkan anggota' }, { status: 403 });
  }

  if (!email) {
    return NextResponse.json({ message: 'Email wajib diisi.' }, { status: 400 });
  }

  try {
    
    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) {
      return NextResponse.json({ message: 'Pengguna dengan email tersebut tidak ditemukan.' }, { status: 404 });
    }

    
    const existingMember = await getProjectMember(userToAdd.id, projectId);
    if (existingMember) {
      return NextResponse.json({ message: 'Pengguna sudah menjadi anggota proyek.' }, { status: 409 });
    }

    
    const newMember = await prisma.projectMember.create({
      data: {
        projectId: projectId,
        userId: userToAdd.id,
        role: 'member', 
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Error adding member:', error);
    return NextResponse.json({ message: 'Gagal menambahkan anggota' }, { status: 500 });
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
  }

  const { id: projectId } = await params;
  const { userId } = await request.json();

  
  const userMember = await getProjectMember(session.user.id, projectId);
  if (!userMember || userMember.role !== 'owner') {
    return NextResponse.json({ message: 'Akses ditolak: hanya owner yang bisa menghapus anggota' }, { status: 403 });
  }

  if (!userId) {
    return NextResponse.json({ message: 'ID pengguna wajib diisi.' }, { status: 400 });
  }
  
  
  if (userId === session.user.id) {
    return NextResponse.json({ message: 'Owner tidak bisa menghapus dirinya sendiri.' }, { status: 400 });
  }

  try {
    
    await prisma.projectMember.delete({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    });

    return NextResponse.json({ message: 'Anggota berhasil dihapus' });
  } catch (error: any) {
    console.error('Error deleting member:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Anggota tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Gagal menghapus anggota' }, { status: 500 });
  }
}
