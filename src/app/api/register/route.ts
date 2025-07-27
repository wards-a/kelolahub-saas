import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Nama, email, dan password wajib diisi.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Email sudah terdaftar.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({ message: 'Pendaftaran berhasil!', user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}