import React, { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  done: boolean;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

interface TodoListProps {}

const TodoList: React.FC<TodoListProps> = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState<string>('');
  const [newTodoCategory, setNewTodoCategory] = useState<string>('personal');
  const [newTodoPriority, setNewTodoPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');

  // Placeholder for fetching todos (hardcoded JSON)
  const fetchTodos = (): Promise<Todo[]> => {
    return Promise.resolve([
      { id: 1, text: 'Buy groceries', done: false, category: 'personal', priority: 'medium' },
      { id: 2, text: 'Walk the dog', done: true, category: 'personal', priority: 'low' },
      { id: 3, text: 'Finish project', done: false, category: 'work', priority: 'high' },
    ]);
  };

  // Placeholder for adding a todo (hardcoded JSON response)
  const addTodo = (text: string, category: string, priority: 'high' | 'medium' | 'low'): Promise<Todo> => {
    return Promise.resolve({
      id: Date.now(),
      text,
      done: false,
      category,
      priority,
    });
  };

  useEffect(() => {
    fetchTodos().then(setTodos);
  }, []);

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      addTodo(newTodoText, newTodoCategory, newTodoPriority).then((newTodo) => {
        setTodos((prev) => [...prev, newTodo]);
        setNewTodoText('');
        setNewTodoCategory('personal');
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

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.done));
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesCategory = filterCategory === 'all' || todo.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'done' && todo.done) || (filterStatus === 'pending' && !todo.done);
    const matchesSearch = todo.text.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesPriority && matchesStatus && matchesSearch;
  });

  const completedCount = todos.filter((todo) => todo.done).length;
  const totalCount = todos.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="flex-grow p-4 bg-gray-100 flex flex-col items-center justify-start">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Advanced Todo List</h1>
      
      {/* Progress Bar */}
      <div className="w-full max-w-md mb-4">
        <div className="text-sm mb-1">Progress: {completedCount}/{totalCount} completed</div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      
      {/* Add Todo Section */}
      <div className="w-full max-w-md mb-6 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-3">Add New Todo</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Enter todo text"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newTodoCategory}
            onChange={(e) => setNewTodoCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
          <select
            value={newTodoPriority}
            onChange={(e) => setNewTodoPriority(e.target.value as 'high' | 'medium' | 'low')}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button
            onClick={handleAddTodo}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            ➕ Add Todo
          </button>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="w-full max-w-md mb-4 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-3">Filters</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search todos"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="done">Done</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
      
      {/* Clear Completed Button */}
      <div className="w-full max-w-md mb-4 flex justify-center">
        <button
          onClick={clearCompleted}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
        >
          🗑️ Clear Completed
        </button>
      </div>
      
      {/* Todo List */}
      <ul className="w-full max-w-md space-y-3">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className={`p-3 border rounded-lg shadow-sm transition-all duration-200 ${todo.done ? 'bg-green-50 line-through text-gray-500' : 'bg-white'} ${todo.priority === 'high' ? 'border-red-300' : todo.priority === 'medium' ? 'border-yellow-300' : 'border-green-300'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{todo.text}</span>
              <span className={`text-xs px-2 py-1 rounded ${todo.priority === 'high' ? 'bg-red-200 text-red-800' : todo.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>{todo.priority.toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{todo.category}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors duration-200"
                >
                  {todo.done ? '↶ Undo' : '✔ Done'}
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-200"
                >
                  🗑️ Delete
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