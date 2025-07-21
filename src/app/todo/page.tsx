'use client';

import { useState, FormEvent } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { addTodo } from '@/redux/features/todoSlice'; // Import action
import { AppDispatch } from '@/redux/store'; // Import AppDispatch type
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function TodoPage() {
  const [todoText, setTodoText] = useState('');
  const dispatch = useDispatch<AppDispatch>(); // Inisialisasi useDispatch

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (todoText.trim()) {
      dispatch(addTodo(todoText)); // Mengubah state global menggunakan useDispatch
      setTodoText(''); // Reset input
      toast.success('Todo berhasil ditambahkan!');
    } else {
      toast.warning('Todo tidak boleh kosong!');
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 bg-background text-foreground min-h-[calc(100vh-4rem)] flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-primary mb-8">Manajemen Todo (Redux)</h1>

      {/* Komponen A: Form Input */}
      <Card className="w-full max-w-lg bg-card text-foreground border border-border shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-primary text-2xl">Tambah Todo Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="todoInput" className="mb-2 block">Apa yang perlu Anda lakukan?</Label>
              <Input
                id="todoInput"
                type="text"
                value={todoText}
                onChange={(e) => setTodoText(e.target.value)}
                placeholder="Misalnya: Pelajari Redux Toolkit"
                className="bg-input text-foreground border-border"
              />
            </div>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
              Tambahkan Todo
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Komponen B akan ditampilkan di sini juga */}
      <TodoList />
    </div>
  );
}

// --- Komponen B: Menampilkan Daftar Todo ---
import { useSelector } from 'react-redux'; // Import useSelector
import { RootState } from '@/redux/store'; // Import RootState type
import { toggleTodo, removeTodo, Todo } from '@/redux/features/todoSlice'; // Import actions dan Todo interface
import { Checkbox } from '@/components/ui/checkbox'; // Shadcn Checkbox

function TodoList() {
  const todos = useSelector((state: RootState) => state.todos.items); // Mengakses state global menggunakan useSelector
  const dispatch = useDispatch<AppDispatch>();

  if (todos.length === 0) {
    return (
      <Card className="w-full max-w-lg bg-card text-foreground border border-border shadow-lg">
        <CardContent className="py-6 text-center text-muted-foreground">
          Belum ada todo. Ayo tambahkan yang pertama!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg bg-card text-foreground border border-border shadow-lg">
      <CardHeader>
        <CardTitle className="text-primary text-2xl">Daftar Todo</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {todos.map((todo: Todo) => (
            <li key={todo.id} className="flex items-center justify-between p-3 border border-border rounded-md bg-background/50">
              <div className="flex items-center gap-3">
                <Checkbox
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  onCheckedChange={() => dispatch(toggleTodo(todo.id))} // Mengubah state global
                  className="w-5 h-5 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <Label htmlFor={`todo-${todo.id}`} className={`text-lg cursor-pointer ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {todo.text}
                </Label>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => dispatch(removeTodo(todo.id))} // Mengubah state global
                className="shrink-0"
              >
                Hapus
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}