import React, { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  done: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface TodoListProps {}

const TodoList: React.FC<TodoListProps> = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState<string>('');
  const [newTodoPriority, setNewTodoPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [filter, setFilter] = useState<'all' | 'done' | 'pending' | 'high' | 'medium' | 'low'>('all');

  // Placeholder for fetching todos (hardcoded JSON)
  const fetchTodos = (): Promise<Todo[]> => {
    return Promise.resolve([
      { id: 1, text: 'Buy groceries', done: false, priority: 'high' },
      { id: 2, text: 'Walk the dog', done: true, priority: 'medium' },
      { id: 3, text: 'Read a book', done: false, priority: 'low' },
    ]);
  };

  // Placeholder for adding a todo (hardcoded JSON response)
  const addTodo = (text: string, priority: 'high' | 'medium' | 'low'): Promise<Todo> => {
    return Promise.resolve({
      id: Date.now(),
      text,
      done: false,
      priority,
    });
  };

  useEffect(() => {
    fetchTodos().then(setTodos);
  }, []);

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      addTodo(newTodoText, newTodoPriority).then((newTodo) => {
        setTodos((prev) => [...prev, newTodo]);
        setNewTodoText('');
        setNewTodoPriority('medium');
      });
    }
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const clearAll = () => {
    setTodos([]);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'all') return true;
    if (filter === 'done') return todo.done;
    if (filter === 'pending') return !todo.done;
    return todo.priority === filter;
  });

  const totalTodos = todos.length;
  const doneTodos = todos.filter((t) => t.done).length;
  const progress = totalTodos > 0 ? (doneTodos / totalTodos) * 100 : 0;

  return (
    <div className="flex-grow p-4 bg-gray-100 flex flex-col items-center justify-start min-h-0 overflow-hidden">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="w-full max-w-md mb-4 flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new todo"
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <select
            value={newTodoPriority}
            onChange={(e) => setNewTodoPriority(e.target.value as 'high' | 'medium' | 'low')}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button
            onClick={handleAddTodo}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <div className="flex gap-2 justify-center">
          <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>All</button>
          <button onClick={() => setFilter('pending')} className={`px-3 py-1 rounded ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Pending</button>
          <button onClick={() => setFilter('done')} className={`px-3 py-1 rounded ${filter === 'done' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Done</button>
          <button onClick={() => setFilter('high')} className={`px-3 py-1 rounded ${filter === 'high' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>High</button>
          <button onClick={() => setFilter('medium')} className={`px-3 py-1 rounded ${filter === 'medium' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Medium</button>
          <button onClick={() => setFilter('low')} className={`px-3 py-1 rounded ${filter === 'low' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Low</button>
        </div>
        <button onClick={clearAll} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 self-center">Clear All</button>
      </div>
      <div className="w-full max-w-md mb-4 flex flex-col gap-2">
        <div className="text-sm">Progress: {doneTodos}/{totalTodos} completed</div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <ul className="w-full max-w-md space-y-2 overflow-y-auto flex-1">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className={`flex items-center justify-between p-2 border rounded ${todo.done ? 'bg-green-100 line-through' : 'bg-white'} ${todo.priority === 'high' ? 'border-red-300' : todo.priority === 'medium' ? 'border-yellow-300' : 'border-green-300'}`}
          >
            <span className="flex-1">{todo.text} ({todo.priority})</span>
            <div className="flex gap-2">
              <button
                onClick={() => toggleTodo(todo.id)}
                className="text-sm bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                {todo.done ? 'Undo' : 'Done'}
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;