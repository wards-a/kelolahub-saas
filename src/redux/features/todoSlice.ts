import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodosState {
  items: Todo[];
}

const initialState: TodosState = {
  items: [],
};

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Action untuk menambahkan todo baru
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: String(Date.now()), // ID sederhana berdasarkan timestamp
        text: action.payload,
        completed: false,
      };
      state.items.push(newTodo);
    },
    // Action untuk mengubah status completed todo
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    // Action untuk menghapus todo
    removeTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(todo => todo.id !== action.payload);
    },
  },
});

// Export actions dan reducer
export const { addTodo, toggleTodo, removeTodo } = todoSlice.actions;
export default todoSlice.reducer;