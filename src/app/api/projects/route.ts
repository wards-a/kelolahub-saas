// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
    }
  
    try {
      const projects = await prisma.project.findMany({
        where: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
        include: {
          _count: {
            select: { members: true },
          },
        },
      });
  
      return NextResponse.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ message: 'Gagal mengambil proyek' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
    }
  
    try {
      const { name, description } = await request.json();
      
      if (!name) {
          return NextResponse.json({ message: 'Nama proyek wajib diisi.' }, { status: 400 });
      }

      const newProject = await prisma.project.create({
        data: {
          name,
          description,
          members: {
            create: {
              userId: session.user.id,
              role: 'owner',
            },
          },
        },
      });

      return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
      console.error('Error creating project:', error);
      return NextResponse.json({ message: 'Gagal membuat proyek' }, { status: 500 });
    }
}