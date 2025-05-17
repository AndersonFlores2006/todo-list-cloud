import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodos, createTodo, updateTodo, deleteTodo, logout } from '../services/todoService';
import '../styles/main.css';
import './Home.css';

function getUserEmail() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.email || '';
  } catch {
    return '';
  }
}

function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    setUserEmail(getUserEmail());
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      setError('Debes iniciar sesión');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 1500);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      await createTodo(newTodo);
      setNewTodo('');
      fetchTodos();
    } catch (err) {
      setError('Error al agregar tarea');
    }
  };

  const handleToggle = async (todo) => {
    try {
      await updateTodo(todo._id, { completed: !todo.completed, title: todo.title });
      fetchTodos();
    } catch (err) {
      setError('Error al actualizar tarea');
    }
  };

  const handleDelete = (id) => {
    setTodoToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTodo(todoToDelete);
      setShowModal(false);
      setTodoToDelete(null);
      fetchTodos();
    } catch (err) {
      setError('Error al eliminar tarea');
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setTodoToDelete(null);
  };

  const startEdit = (todo) => {
    setEditId(todo._id);
    setEditValue(todo.title);
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const saveEdit = async (todo) => {
    if (!editValue.trim()) return;
    try {
      await updateTodo(todo._id, { title: editValue, completed: todo.completed });
      setEditId(null);
      setEditValue('');
      fetchTodos();
    } catch (err) {
      setError('Error al editar tarea');
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditValue('');
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo">📝</span>
          <h3>To-Do Cloud</h3>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-user">{userEmail || 'Usuario'}</div>
          <div className="sidebar-tasks">
            <span>Total: {todos.length}</span>
            <span>Completadas: {completedCount}</span>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>Cerrar sesión</button>
      </aside>
      <main className="main-content">
        <div className="card home-card">
          <h2>Mis Tareas</h2>
          <form onSubmit={handleAdd} className="todo-form">
            <input
              type="text"
              placeholder="Nueva tarea"
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              className="todo-input"
            />
            <button type="submit" className="todo-add-btn">Agregar</button>
          </form>
          {error && <p className="todo-error">{error}</p>}
          <div className="todo-list">
            {todos.map(todo => (
              <div key={todo._id} className={`todo-note${todo.completed ? ' completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo)}
                  className="todo-checkbox"
                />
                {editId === todo._id ? (
                  <>
                    <input
                      value={editValue}
                      onChange={handleEditChange}
                      className="todo-edit-input"
                      autoFocus
                    />
                    <button className="todo-save-btn" onClick={() => saveEdit(todo)} title="Guardar">💾</button>
                    <button className="todo-cancel-btn" onClick={cancelEdit} title="Cancelar">✕</button>
                  </>
                ) : (
                  <>
                    <span className="todo-title">{todo.title}</span>
                    <button className="todo-edit-btn" onClick={() => startEdit(todo)} title="Editar">✎</button>
                    <button onClick={() => handleDelete(todo._id)} className="todo-delete-btn" title="Eliminar">✕</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h4>¿Estás seguro de eliminar esta tarea?</h4>
              <div className="modal-actions">
                <button className="modal-btn confirm" onClick={confirmDelete}>Sí, eliminar</button>
                <button className="modal-btn cancel" onClick={cancelDelete}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
        {showLogoutModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h4>¿Seguro que quieres cerrar sesión?</h4>
              <div className="modal-actions">
                <button className="modal-btn confirm" onClick={confirmLogout}>Sí, cerrar sesión</button>
                <button className="modal-btn cancel" onClick={cancelLogout}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home; 