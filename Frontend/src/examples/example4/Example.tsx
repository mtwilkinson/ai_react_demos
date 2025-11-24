import React, { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface TodoListProps {}

const TodoList: React.FC<TodoListProps> = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState<string>('');
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [searchText, setSearchText] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [editing, setEditing] = useState<{ id: number; text: string } | null>(null);

  // Placeholder for fetching todos (hardcoded JSON)
  const fetchTodos = (): Promise<Todo[]> => {
    return Promise.resolve([
      { id: 1, text: 'Buy groceries', done: false, priority: 'medium' },
      { id: 2, text: 'Walk the dog', done: true, priority: 'low' },
    ]);
  };

  // Placeholder for adding a todo (hardcoded JSON response)
  const addTodo = (text: string, priority: 'low' | 'medium' | 'high'): Promise<Todo> => {
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

  const updateTodoText = (id: number, text: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text } : todo
      )
    );
    setEditing(null);
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.done));
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'pending' && !todo.done) ||
      (filter === 'done' && todo.done);
    const matchesSearch = todo.text.toLowerCase().includes(searchText.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.done).length;
  const pendingTodos = totalTodos - completedTodos;

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return 'border-l-4 border-green-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'high': return 'border-l-4 border-red-500';
    }
  };

  return (
    <div className="flex-grow p-4 bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-start min-h-0 overflow-hidden">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Enhanced Todo List</h1>
      <div className="w-full max-w-lg mb-4 flex gap-2 items-end">
        <div className="flex-1">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new todo"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={newTodoPriority}
          onChange={(e) => setNewTodoPriority(e.target.value as 'low' | 'medium' | 'high')}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          onClick={handleAddTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 shadow-md transition-colors"
        >
          Add
        </button>
      </div>
      <div className="w-full max-w-lg mb-4 flex gap-2 items-center">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search todos"
          className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-md transition-colors ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          All ({totalTodos})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1 rounded-md transition-colors ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Pending ({pendingTodos})
        </button>
        <button
          onClick={() => setFilter('done')}
          className={`px-3 py-1 rounded-md transition-colors ${filter === 'done' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Done ({completedTodos})
        </button>
      </div>
      <button
        onClick={clearCompleted}
        className="mb-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 shadow-md transition-colors"
      >
        Clear Completed
      </button>
      <ul className="w-full max-w-lg space-y-2 overflow-y-auto flex-1">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className={`flex items-center justify-between p-3 border rounded-lg shadow-sm bg-white ${getPriorityColor(todo.priority)} ${todo.done ? 'opacity-75' : ''}`}
          >
            {editing && editing.id === todo.id ? (
              <input
                type="text"
                value={editing.text}
                onChange={(e) => setEditing({ ...editing, text: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') updateTodoText(todo.id, editing.text);
                  if (e.key === 'Escape') setEditing(null);
                }}
                className="flex-1 p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <span className={`flex-1 ${todo.done ? 'line-through text-gray-500' : ''}`}>{todo.text}</span>
            )}
            <div className="flex gap-1 ml-2">
              {editing && editing.id === todo.id ? (
                <>
                  <button
                    onClick={() => updateTodoText(todo.id, editing.text)}
                    className="text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="text-sm bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`text-sm px-2 py-1 rounded hover:opacity-80 ${todo.done ? 'bg-gray-500 text-white' : 'bg-yellow-500 text-white'}`}
                  >
                    {todo.done ? 'Undo' : 'Done'}
                  </button>
                  <button
                    onClick={() => setEditing({ id: todo.id, text: todo.text })}
                    className="text-sm bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
