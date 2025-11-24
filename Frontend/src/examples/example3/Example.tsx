import React, { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  done: boolean;
  category: 'Work' | 'Personal' | 'Other';
  priority: 'High' | 'Medium' | 'Low';
  dueDate?: string;
}

interface TodoListProps {}

const TodoList: React.FC<TodoListProps> = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'Work' | 'Personal' | 'Other'>('Other');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newDueDate, setNewDueDate] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<'All' | 'Work' | 'Personal' | 'Other'>('All');
  const [filterPriority, setFilterPriority] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [showDone, setShowDone] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  // Placeholder for fetching todos (hardcoded JSON)
  const fetchTodos = (): Promise<Todo[]> => {
    return Promise.resolve([
      { id: 1, text: 'Buy groceries', done: false, category: 'Personal', priority: 'Medium' },
      { id: 2, text: 'Walk the dog', done: true, category: 'Personal', priority: 'Low' },
      { id: 3, text: 'Finish project report', done: false, category: 'Work', priority: 'High', dueDate: '2023-10-15' },
    ]);
  };

  // Placeholder for adding a todo (hardcoded JSON response)
  const addTodo = (text: string, category: string, priority: string, dueDate?: string): Promise<Todo> => {
    return Promise.resolve({
      id: Date.now(),
      text,
      done: false,
      category: category as Todo['category'],
      priority: priority as Todo['priority'],
      dueDate,
    });
  };

  useEffect(() => {
    fetchTodos().then(setTodos);
  }, []);

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      addTodo(newTodoText, newCategory, newPriority, newDueDate || undefined).then((newTodo) => {
        setTodos((prev) => [...prev, newTodo]);
        setNewTodoText('');
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

  const startEdit = (id: number, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = () => {
    if (editingText.trim()) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === editingId ? { ...todo, text: editingText } : todo
        )
      );
      setEditingId(null);
      setEditingText('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesCategory = filterCategory === 'All' || todo.category === filterCategory;
    const matchesPriority = filterPriority === 'All' || todo.priority === filterPriority;
    const matchesDone = showDone || !todo.done;
    const matchesSearch = todo.text.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesPriority && matchesDone && matchesSearch;
  });

  const totalTodos = todos.length;
  const doneTodos = todos.filter((todo) => todo.done).length;
  const progress = totalTodos > 0 ? (doneTodos / totalTodos) * 100 : 0;

  const priorityColors = {
    High: 'bg-red-100 border-red-300',
    Medium: 'bg-yellow-100 border-yellow-300',
    Low: 'bg-green-100 border-green-300',
  };

  return (
    <div className="flex-grow p-4 bg-gray-100 flex flex-col items-center justify-start min-h-0 overflow-hidden">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Advanced Todo List</h1>
      
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-4">
        <div className="text-sm font-medium text-gray-700 mb-1">Progress: {doneTodos}/{totalTodos} completed</div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="w-full max-w-2xl mb-4 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search todos..."
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as 'All' | 'Work' | 'Personal' | 'Other')}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="All">All Categories</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Other">Other</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as 'All' | 'High' | 'Medium' | 'Low')}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={showDone}
            onChange={(e) => setShowDone(e.target.checked)}
            className="rounded"
          />
          Show Done
        </label>
      </div>

      {/* Add Todo Section */}
      <div className="w-full max-w-2xl mb-6 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Add New Todo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Todo text"
            className="p-2 border border-gray-300 rounded"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as Todo['category'])}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as Todo['priority'])}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          onClick={handleAddTodo}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Add Todo
        </button>
      </div>

      {/* Todo List */}
      <ul className="w-full max-w-2xl space-y-3 overflow-y-auto flex-1">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className={`p-4 border rounded-lg shadow-sm transition-all duration-200 ${priorityColors[todo.priority]} ${todo.done ? 'opacity-75' : ''}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                {editingId === todo.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="flex-1 p-1 border border-gray-300 rounded"
                    />
                    <button
                      onClick={saveEdit}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className={`text-lg ${todo.done ? 'line-through text-gray-500' : 'text-gray-800'}`}>{todo.text}</div>
                )}
                <div className="text-sm text-gray-600 mt-1">
                  Category: {todo.category} | Priority: {todo.priority}
                  {todo.dueDate && ` | Due: ${todo.dueDate}`}
                </div>
              </div>
              <div className="flex gap-2 ml-2 flex-shrink-0">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
                >
                  {todo.done ? 'Undo' : 'Done'}
                </button>
                <button
                  onClick={() => startEdit(todo.id, todo.text)}
                  className="text-sm bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
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