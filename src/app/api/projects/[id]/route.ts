import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
  }

  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            role: true,
          },
        },
        tasks: {
          orderBy: { createdAt: 'asc' },
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ message: 'Proyek tidak ditemukan' }, { status: 404 });
    }

    const isMember = project.members.some(member => member.user.id === session.user.id);
    if (!isMember) {
      return NextResponse.json({ message: 'Akses ditolak' }, { status: 403 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project details:', error);
    return NextResponse.json({ message: 'Gagal mengambil detail proyek' }, { status: 500 });
  }
}