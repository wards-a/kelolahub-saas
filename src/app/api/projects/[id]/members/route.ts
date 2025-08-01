import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// Helper untuk memeriksa apakah pengguna adalah pemilik proyek
async function isUserProjectOwner(userId: string, projectId: string) {
  const member = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
      role: 'owner',
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

  try {
    const members = await prisma.projectMember.findMany({
      where: { projectId },
      select: {
        role: true,
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
    return NextResponse.json({ message: 'Gagal mengambil anggota proyek' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
  }

  const { id: projectId } = params;
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ message: 'Email anggota wajib diisi.' }, { status: 400 });
  }

  if (!await isUserProjectOwner(session.user.id, projectId)) {
    return NextResponse.json({ message: 'Akses ditolak: Hanya pemilik proyek yang bisa menambah anggota.' }, { status: 403 });
  }

  try {
    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) {
      return NextResponse.json({ message: 'Pengguna dengan email tersebut tidak ditemukan.' }, { status: 404 });
    }

    const newMember = await prisma.projectMember.create({
      data: {
        projectId,
        userId: userToAdd.id,
        role: 'member',
      },
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Error adding member:', error);
    return NextResponse.json({ message: 'Gagal menambahkan anggota' }, { status: 500 });
  }
}