import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    const darkModePreference = localStorage.getItem('darkMode');

    if (storedTodos) {
      try {
        setTodos(JSON.parse(storedTodos));
      } catch (e) {
        console.error('Error parsing todos from localStorage', e);
        setTodos([]);
      }
    }

    if (darkModePreference === 'true') {
      setIsDarkMode(true);
      document.body.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.body.classList.add('light');
    }
  }, []);

  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    } else {
      localStorage.removeItem('todos');
    }
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        text: inputValue,
        createdAt: new Date().toLocaleString(),
        isCompleted: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const toggleComplete = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(updatedTodos);
  };

  const editTodo = (index) => {
    setIsEditing(index);
    setEditValue(todos[index].text);
  };

  const saveEditTodo = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, text: editValue } : todo
    );
    setTodos(updatedTodos);
    setIsEditing(null);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.isCompleted;
    if (filter === 'incomplete') return !todo.isCompleted;
    return true;
  });

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.body.classList.remove('light');
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
    localStorage.setItem('darkMode', newDarkMode);
  };

  return (
    <div className="App">
      <h1>Todo List</h1>

      <button onClick={toggleTheme}>
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={addTodo}>Add Todo</button>

      <div className="filter-buttons">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button
          className={filter === 'incomplete' ? 'active' : ''}
          onClick={() => setFilter('incomplete')}
        >
          Incomplete
        </button>
      </div>

      <ul>
        {filteredTodos.length === 0 ? (
          <p>No todos yet.</p>
        ) : (
          filteredTodos.map((todo, index) => (
            <li
              key={index}
              className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}
            >
              {isEditing === index ? (
                <>
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                  <button onClick={() => saveEditTodo(index)}>Save</button>
                </>
              ) : (
                <>
                  {todo.text} (added on: {todo.createdAt})
                  <button onClick={() => toggleComplete(index)}>
                    {todo.isCompleted ? 'Undo' : 'Complete'}
                  </button>
                  <button onClick={() => editTodo(index)}>Edit</button>
                  <button onClick={() => deleteTodo(index)}>Delete</button>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
