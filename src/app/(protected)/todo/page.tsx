'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newTodoText, setNewTodoText] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editedText, setEditedText] = useState('');

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/todos');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data: Todo[] = await res.json();
      setTodos(data);
    } catch (err: unknown) {
      console.error('Failed to fetch todos:', err);
      setError('Gagal memuat todo. Silakan coba lagi.');
      toast.error('Gagal memuat todo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e: FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      try {
        const res = await fetch('/api/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: newTodoText.trim() }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }

        const addedTodo: Todo = await res.json();
        setTodos(prev => [addedTodo, ...prev]);
        setNewTodoText('');
        toast.success('Todo berhasil ditambahkan!');
      } catch (err: unknown) {
        console.error('Failed to add todo:', err);
        if (err instanceof Error) {          
          setError(`Gagal menambahkan todo: ${err.message}`);
          toast.error(`Gagal menambahkan todo: ${err.message}`);
        }
      }
    } else {
      toast.warning('Todo tidak boleh kosong!');
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      const res = await fetch('/api/todos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: todo.id, completed: !todo.completed }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const updatedTodo: Todo = await res.json();
      setTodos(prev => prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)));
      toast.success('Status todo berhasil diperbarui!');
    } catch (err: unknown) {
      console.error('Failed to toggle todo status:', err);
      if (err instanceof Error) {        
        setError(`Gagal memperbarui status: ${err.message}`);
        toast.error(`Gagal memperbarui status: ${err.message}`);
      }
    }
  };

  // --- Hapus Data Todo (DELETE) ---
  const handleDeleteTodo = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus todo ini?')) return;

    try {
      const res = await fetch('/api/todos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      setTodos(prev => prev.filter(t => t.id !== id));
      toast.success('Todo berhasil dihapus!');
    } catch (err: unknown) {
      console.error('Failed to delete todo:', err);
      if (err instanceof Error) {        
        setError(`Gagal menghapus todo: ${err.message}`);
        toast.error(`Gagal menghapus todo: ${err.message}`);
      }
    }
  };

  // --- Fungsionalitas Edit Todo ---
  const openEditDialog = (todo: Todo) => {
    setEditingTodo(todo);
    setEditedText(todo.text);
    setIsEditDialogOpen(true);
  };

  const handleEditTodo = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingTodo || editedText.trim() === '') {
      toast.warning('Teks todo tidak boleh kosong!');
      return;
    }

    try {
      const res = await fetch('/api/todos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: editingTodo.id, text: editedText.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const updatedTodo: Todo = await res.json();
      setTodos(prev => prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)));
      setIsEditDialogOpen(false);
      setEditingTodo(null);
      setEditedText('');
      toast.success('Todo berhasil diperbarui!');
    } catch (err: unknown) {
      console.error('Failed to edit todo:', err);
      if (err instanceof Error) {        
        setError(`Gagal memperbarui todo: ${err.message}`);
        toast.error(`Gagal memperbarui todo: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background text-foreground">
        <p className="text-xl text-primary">Memuat todo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-background text-destructive">
        <p className="text-xl mb-4">Error: {error}</p>
        <Button onClick={fetchTodos} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 bg-background text-foreground min-h-[calc(100vh-4rem)] flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-primary mb-8">Daftar Todo</h1>

      <Card className="w-full max-w-lg bg-card text-foreground border border-border shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-primary text-2xl">Tambah Todo Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTodo} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="newTodoInput" className="mb-2 block">Apa yang perlu Anda lakukan?</Label>
              <Input
                id="newTodoInput"
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="Misalnya: Buat laporan bulanan"
                className="bg-input text-foreground border-border"
              />
            </div>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
              Tambahkan Todo
            </Button>
          </form>
        </CardContent>
      </Card>

      {todos.length === 0 ? (
        <p className="text-center text-xl text-muted-foreground mt-12">Belum ada todo. Ayo tambahkan yang pertama!</p>
      ) : (
        <Card className="w-full max-w-lg bg-card text-foreground border border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-primary text-2xl">Daftar Todo</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {todos.map(todo => (
                <li key={todo.id} className="flex items-center justify-between p-3 border border-border rounded-md bg-background/50">
                  <div className="flex items-center gap-3 flex-grow min-w-0">
                    <Checkbox
                      id={`todo-${todo.id}`}
                      checked={todo.completed}
                      onCheckedChange={() => handleToggleTodo(todo)}
                      className="w-5 h-5 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <Label
                      htmlFor={`todo-${todo.id}`}
                      className={`text-lg cursor-pointer flex-grow break-words ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                      style={{ overflowWrap: 'break-word' }}
                    >
                      {todo.text}
                    </Label>
                  </div>
                  <div className="flex space-x-2 shrink-0 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(todo)}
                      className="text-primary border-primary hover:bg-primary/10"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="shadow-md"
                    >
                      Hapus
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card text-foreground border border-border">
          <DialogHeader>
            <DialogTitle className="text-primary">Edit Todo</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Perbarui teks todo Anda.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditTodo} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editedTodoText" className="text-right">Todo</Label>
              <Input
                id="editedTodoText"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="col-span-3 bg-input text-foreground border-border"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}