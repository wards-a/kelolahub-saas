import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }, // Urutkan berdasarkan waktu pembuatan terbaru
    });
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ message: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return NextResponse.json({ message: 'Todo text is required and must be a non-empty string.' }, { status: 400 });
    }

    const newTodo = await prisma.todo.create({
      data: {
        text,
        completed: false, // Default: belum selesai
      },
    });
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ message: 'Failed to create todo' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, text, completed } = await request.json();

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ message: 'Todo ID is required for update.' }, { status: 400 });
    }

    // Hanya update field yang disediakan
    const updateData: { text?: string; completed?: boolean } = {};
    if (text !== undefined) {
      if (typeof text !== 'string' || text.trim() === '') {
        return NextResponse.json({ message: 'Todo text must be a non-empty string.' }, { status: 400 });
      }
      updateData.text = text;
    }
    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return NextResponse.json({ message: 'Completed status must be a boolean.' }, { status: 400 });
      }
      updateData.completed = completed;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: 'No valid fields provided for update.' }, { status: 400 });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(updatedTodo);
  } catch (error: unknown) {
    console.error('Error updating todo:', error);
    if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
        }
    }
    return NextResponse.json({ message: 'Failed to update todo' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ message: 'Todo ID is required for deletion.' }, { status: 400 });
    }

    await prisma.todo.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Todo deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error deleting todo:', error);
    if (typeof error === 'object' && error !== null && 'code' in error) {
        if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
        }
    }
    return NextResponse.json({ message: 'Failed to delete todo' }, { status: 500 });
  }
}