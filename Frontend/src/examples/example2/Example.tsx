import React, { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  done: boolean;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface TodoListProps {}

const TodoList: React.FC<TodoListProps> = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newDueDate, setNewDueDate] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  // Placeholder for fetching todos (hardcoded JSON)
  const fetchTodos = (): Promise<Todo[]> => {
    return Promise.resolve([
      { id: 1, text: 'Buy groceries', done: false, category: 'Shopping', priority: 'high', dueDate: '2023-10-15' },
      { id: 2, text: 'Walk the dog', done: true, category: 'Pets', priority: 'low', dueDate: '2023-10-14' },
    ]);
  };

  // Placeholder for adding a todo (hardcoded JSON response)
  const addTodo = (text: string, category?: string, priority?: 'low' | 'medium' | 'high', dueDate?: string): Promise<Todo> => {
    return Promise.resolve({
      id: Date.now(),
      text,
      done: false,
      category,
      priority,
      dueDate,
    });
  };

  useEffect(() => {
    fetchTodos().then(setTodos);
  }, []);

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      addTodo(newTodoText, newCategory || undefined, newPriority, newDueDate || undefined).then((newTodo) => {
        setTodos((prev) => [...prev, newTodo]);
        setNewTodoText('');
        setNewCategory('');
        setNewPriority('medium');
        setNewDueDate('');
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

  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEditing = () => {
    if (editingId !== null && editingText.trim()) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === editingId ? { ...todo, text: editingText } : todo
        )
      );
      setEditingId(null);
      setEditingText('');
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingText('');
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.done;
    if (filter === 'completed') return todo.done;
    return true;
  });

  const completedCount = todos.filter((todo) => todo.done).length;
  const totalCount = todos.length;

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-300';
      case 'medium': return 'bg-yellow-100 border-yellow-300';
      case 'low': return 'bg-green-100 border-green-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="flex-grow p-4 bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-start min-h-0 overflow-hidden">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Enhanced Todo List</h1>
      <div className="w-full max-w-lg mb-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Add New Todo</h2>
        <div className="space-y-2">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Enter todo text"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category (optional)"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddTodo}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Add Todo
          </button>
        </div>
      </div>
      <div className="w-full max-w-lg mb-4 flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
        <div className="text-sm text-gray-600">
          {completedCount} / {totalCount} completed
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-400 transition-colors`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-400 transition-colors`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-400 transition-colors`}
          >
            Completed
          </button>
        </div>
      </div>
      <ul className="w-full max-w-lg space-y-3 overflow-y-auto flex-1">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className={`p-4 border rounded-lg shadow-sm transition-all hover:shadow-md ${todo.done ? 'bg-green-50 line-through' : 'bg-white'} ${getPriorityColor(todo.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {editingId === todo.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveEditing}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div onDoubleClick={() => startEditing(todo.id, todo.text)} className="cursor-pointer">
                    <div className="font-medium text-gray-800">{todo.text}</div>
                    {todo.category && <div className="text-sm text-gray-600">Category: {todo.category}</div>}
                    {todo.dueDate && <div className="text-sm text-gray-600">Due: {todo.dueDate}</div>}
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="text-sm bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition-colors"
                >
                  {todo.done ? 'Undo' : 'Done'}
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;