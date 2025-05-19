import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodos, createTodo, updateTodo, updateTodo as updateTask, deleteTodo, logout, getLists, createList, deleteList, updateList, changePassword } from '../services/todoService';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/main.css';
import './Home.css';
import Swal from 'sweetalert2';

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

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [lists, setLists] = useState([]);
  const [activeList, setActiveList] = useState(null);
  const [showNewListInput, setShowNewListInput] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [showDeleteListModal, setShowDeleteListModal] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);
  const [newPriority, setNewPriority] = useState('media');
  const [newTags, setNewTags] = useState('');
  const [editPriority, setEditPriority] = useState('media');
  const [editTags, setEditTags] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [taskSearch, setTaskSearch] = useState('');
  const [messages, setMessages] = useState([]);
  const [theme, setTheme] = useState('light');
  const [configEmail, setConfigEmail] = useState(userEmail);
  const [configPassword, setConfigPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [editListId, setEditListId] = useState(null);
  const [editListValue, setEditListValue] = useState('');

  useEffect(() => {
    setUserEmail(getUserEmail());
    fetchLists();
    fetchTodos();
  }, []);

  useEffect(() => {
    setConfigEmail(userEmail);
  }, [userEmail]);

  const fetchLists = async () => {
    const data = await getLists();
    setLists(data);
    if (!activeList && data.length > 0) setActiveList(data[0]._id);
  };

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

  // Mensajes dinámicos de ejemplo
  useEffect(() => {
    const todayTasks = todos.filter(todo => {
      const todoDate = new Date(todo.createdAt);
      return isSameDay(todoDate, new Date()) && !todo.completed;
    });
    const completedToday = todos.filter(todo => {
      const todoDate = new Date(todo.createdAt);
      return isSameDay(todoDate, new Date()) && todo.completed;
    });
    const msgs = [];
    if (todayTasks.length === 0 && completedToday.length > 0) {
      msgs.push('¡Buen trabajo! Completaste todas tus tareas de hoy.');
    } else if (todayTasks.length > 0) {
      msgs.push(`Tienes ${todayTasks.length} tarea(s) pendiente(s) para hoy.`);
    }
    const overdue = todos.filter(todo => !todo.completed && new Date(todo.createdAt) < new Date(new Date().setHours(0,0,0,0)));
    if (overdue.length > 0) {
      msgs.push(`Tienes ${overdue.length} tarea(s) vencida(s).`);
    }
    setMessages(msgs);
  }, [todos]);

  // Simular cambio de contraseña
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await changePassword(currentPassword, configPassword);
      Swal.fire({
        icon: 'success',
        title: '¡Contraseña actualizada!',
        text: 'Tu contraseña fue cambiada correctamente.',
        confirmButtonColor: '#4f8cff',
      });
      setCurrentPassword('');
      setConfigPassword('');
      setShowPasswordForm(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al cambiar contraseña';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: msg,
        confirmButtonColor: '#e11d48',
      });
    }
  };

  // Cambiar tema (solo frontend)
  useEffect(() => {
    document.body.style.background = theme === 'dark'
      ? 'linear-gradient(135deg, #22223b 0%, #4f8cff 100%)'
      : 'linear-gradient(135deg, #4f8cff 0%, #22c55e 100%)';
  }, [theme]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', theme === 'dark');
  }, [theme]);

  // Filtrar tareas por fecha seleccionada, lista activa, prioridad y tag
  const filteredTodos = todos.filter(todo => {
    if (!todo.createdAt) return false;
    const todoDate = new Date(todo.createdAt);
    if (!todo.list || !todo.list._id) return false;
    if (!(isSameDay(todoDate, selectedDate) && todo.list._id === activeList)) return false;
    if (filterPriority && todo.priority !== filterPriority) return false;
    if (filterTag && (!todo.tags || !todo.tags.some(tag => tag.toLowerCase().includes(filterTag.toLowerCase())))) return false;
    return true;
  });

  // Todas las tareas (sin filtrar por fecha/lista)
  const allFilteredTodos = todos.filter(todo => {
    if (taskSearch && !todo.title.toLowerCase().includes(taskSearch.toLowerCase())) return false;
    if (filterPriority && todo.priority !== filterPriority) return false;
    if (filterTag && (!todo.tags || !todo.tags.some(tag => tag.toLowerCase().includes(filterTag.toLowerCase())))) return false;
    return true;
  });

  // Obtener fechas con tareas
  const taskDates = todos.map(todo => {
    const d = new Date(todo.createdAt);
    return d.toISOString().split('T')[0]; // formato YYYY-MM-DD
  });

  // Función para saber si un día tiene tareas
  const hasTasks = date => {
    const d = date.toISOString().split('T')[0];
    return taskDates.includes(d);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTodo.trim() || !activeList) return;
    try {
      await createTodo(newTodo, activeList, newPriority, newTags.split(',').map(t => t.trim()).filter(Boolean));
      setNewTodo('');
      setNewPriority('media');
      setNewTags('');
      fetchTodos();
      Swal.fire({ icon: 'success', title: '¡Tarea creada!', showConfirmButton: false, timer: 1200 });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error al agregar tarea', text: 'Intenta de nuevo', confirmButtonColor: '#e11d48' });
    }
  };

  const handleToggle = async (todo) => {
    try {
      await updateTodo(todo._id, { completed: !todo.completed, title: todo.title });
      fetchTodos();
      Swal.fire({ icon: 'success', title: 'Tarea actualizada', showConfirmButton: false, timer: 1000 });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error al actualizar tarea', confirmButtonColor: '#e11d48' });
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
      Swal.fire({ icon: 'success', title: 'Tarea eliminada', showConfirmButton: false, timer: 1000 });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error al eliminar tarea', confirmButtonColor: '#e11d48' });
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setTodoToDelete(null);
  };

  const startEdit = async (todo) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar tarea',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Título" value="${todo.title}" autofocus>
        <select id="swal-input2" class="swal2-input">
          <option value="alta" ${todo.priority === 'alta' ? 'selected' : ''}>Alta</option>
          <option value="media" ${todo.priority === 'media' ? 'selected' : ''}>Media</option>
          <option value="baja" ${todo.priority === 'baja' ? 'selected' : ''}>Baja</option>
        </select>
        <input id="swal-input3" class="swal2-input" placeholder="Tags (separados por coma)" value="${(todo.tags || []).join(', ')}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          document.getElementById('swal-input3').value
        ];
      },
      customClass: { popup: 'swal2-todo-edit-modal' }
    });
    if (formValues) {
      const [title, priority, tags] = formValues;
      if (!title.trim()) {
        Swal.fire({ icon: 'error', title: 'El título es requerido', confirmButtonColor: '#e11d48' });
        return;
      }
      try {
        await updateTodo(todo._id, {
          title,
          completed: todo.completed,
          list: todo.list._id,
          priority,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean)
        });
        fetchTodos();
        Swal.fire({ icon: 'success', title: 'Tarea editada', showConfirmButton: false, timer: 1000 });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error al editar tarea', confirmButtonColor: '#e11d48' });
      }
    }
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

  const completedCount = filteredTodos.filter(t => t.completed).length;

  // Manejo de nueva lista
  const handleAddList = async () => {
    if (!newListName.trim()) return;
    if (lists.some(l => l.name === newListName.trim())) return;
    try {
      const newList = await createList(newListName.trim());
      setLists([...lists, newList]);
      setActiveList(newList._id);
      setNewListName('');
      setShowNewListInput(false);
      Swal.fire({ icon: 'success', title: 'Lista creada', showConfirmButton: false, timer: 1000 });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error al crear lista', confirmButtonColor: '#e11d48' });
    }
  };

  const handleDeleteList = (id) => {
    setListToDelete(id);
    setShowDeleteListModal(true);
  };

  const confirmDeleteList = async () => {
    try {
      await deleteList(listToDelete);
      const updatedLists = lists.filter(l => l._id !== listToDelete);
      setLists(updatedLists);
      if (activeList === listToDelete && updatedLists.length > 0) {
        setActiveList(updatedLists[0]._id);
      } else if (updatedLists.length === 0) {
        setActiveList(null);
      }
      setShowDeleteListModal(false);
      setListToDelete(null);
      fetchTodos();
      Swal.fire({ icon: 'success', title: 'Lista eliminada', showConfirmButton: false, timer: 1000 });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error al eliminar lista', confirmButtonColor: '#e11d48' });
    }
  };

  const cancelDeleteList = () => {
    setShowDeleteListModal(false);
    setListToDelete(null);
  };

  const startEditList = (list) => {
    setEditId(`list-${list._id}`);
    setEditValue(list.name);
  };

  const saveEditList = async (id) => {
    if (!editValue.trim()) return;
    try {
      await updateList(id, editValue.trim());
      setEditId(null);
      setEditValue('');
      fetchLists();
      Swal.fire({ icon: 'success', title: 'Lista editada', showConfirmButton: false, timer: 1000 });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error al editar lista', confirmButtonColor: '#e11d48' });
    }
  };

  const cancelEditList = () => {
    setEditId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditId(null);
    setNewTodo('');
    setNewPriority('media');
    setNewTags('');
  };

  return (
    <div className={`dashboard-layout${theme === 'dark' ? ' dark-mode' : ''}`}>
      {/* Sidebar de navegación */}
      <aside className={`dashboard-sidebar${theme === 'dark' ? ' dark-mode' : ''}`}>
        <div className={`sidebar-logo${theme === 'dark' ? ' dark-mode' : ''}`}>📝 To-Do Cloud</div>
        <nav className={`sidebar-nav${theme === 'dark' ? ' dark-mode' : ''}`}>
          <ul>
            <li className={activeSection === 'Dashboard' ? 'active' : ''} onClick={() => setActiveSection('Dashboard')}>Dashboard</li>
            <li className={activeSection === 'Tareas' ? 'active' : ''} onClick={() => setActiveSection('Tareas')}>Tareas</li>
            <li className={activeSection === 'Calendario' ? 'active' : ''} onClick={() => setActiveSection('Calendario')}>Calendario</li>
            <li className={activeSection === 'Mensajes' ? 'active' : ''} onClick={() => setActiveSection('Mensajes')}>Mensajes</li>
            <li className={activeSection === 'Configuración' ? 'active' : ''} onClick={() => setActiveSection('Configuración')}>Configuración</li>
          </ul>
        </nav>
        <div className="sidebar-section">
          <div className="sidebar-section-title">Mis Listas</div>
          <ul className="sidebar-lists">
            {lists.map(list => (
              <li
                key={list._id}
                className={activeList === list._id ? 'list-active' : ''}
                onClick={() => setActiveList(list._id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                {editId === `list-${list._id}` ? (
                  <>
                    <input
                      type="text"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveEditList(list._id);
                        if (e.key === 'Escape') cancelEditList();
                      }}
                      autoFocus
                      style={{ flex: 1, marginRight: 4 }}
                    />
                    <button className="todo-save-btn" style={{marginLeft: 2}} onClick={() => saveEditList(list._id)}>✔</button>
                    <button className="todo-cancel-btn" style={{marginLeft: 2}} onClick={cancelEditList}>✖</button>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1, cursor: 'pointer' }}>{list.name}</span>
                    <button
                      className="todo-edit-btn"
                      style={{ marginLeft: 4, fontSize: 14, padding: '2px 8px' }}
                      title="Editar lista"
                      onClick={e => { e.stopPropagation(); startEditList(list); }}
                    >✏️</button>
                    {lists.length > 1 && (
                      <button
                        className="todo-cancel-btn"
                        style={{ marginLeft: 4, fontSize: 14, padding: '2px 8px' }}
                        title="Eliminar lista"
                        onClick={e => { e.stopPropagation(); handleDeleteList(list._id); }}
                      >🗑️</button>
                    )}
                  </>
                )}
              </li>
            ))}
            {showNewListInput ? (
              <li>
                <input
                  type="text"
                  value={newListName}
                  onChange={e => setNewListName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleAddList();
                    if (e.key === 'Escape') { setShowNewListInput(false); setNewListName(''); }
                  }}
                  autoFocus
                  placeholder="Nombre de la lista"
                  style={{ width: '80%' }}
                />
                <button className="todo-save-btn" style={{marginLeft: 4}} onClick={handleAddList}>✔</button>
                <button className="todo-cancel-btn" style={{marginLeft: 2}} onClick={() => { setShowNewListInput(false); setNewListName(''); }}>✖</button>
              </li>
            ) : (
              <li onClick={() => setShowNewListInput(true)} style={{ color: '#22c55e', cursor: 'pointer' }}>+ Nueva lista</li>
            )}
          </ul>
        </div>
        <div className="sidebar-user-email">{userEmail || 'Usuario'}</div>
        <button className="sidebar-logout" onClick={handleLogout}>Cerrar sesión</button>
      </aside>

      {/* Panel principal */}
      <main className={`dashboard-main${theme === 'dark' ? ' dark-mode' : ''}`}>
        {activeSection === 'Dashboard' && (
          <>
            <div className={`dashboard-header${theme === 'dark' ? ' dark-mode' : ''}`}>
              <h2>¡Hola, {userEmail ? userEmail.split('@')[0] : 'usuario'}!</h2>
              <span className="dashboard-date">Hoy es {new Date().toLocaleDateString()}</span>
            </div>
            <div className={`dashboard-tasks-card${theme === 'dark' ? ' dark-mode' : ''}`}>
              <div className={`dashboard-tasks-header${theme === 'dark' ? ' dark-mode' : ''}`}>
                <span>Tareas del {selectedDate.toLocaleDateString()}</span>
                <button className="dashboard-add-btn" onClick={() => setEditId('new')}>+ Nueva tarea</button>
              </div>
              {/* Formulario para nueva tarea */}
              {editId === 'new' && (
                <form onSubmit={handleAdd} style={{ display: 'flex', marginBottom: '1rem', gap: 8, flexWrap: 'wrap' }}>
                  <input
                    className="todo-edit-input"
                    type="text"
                    placeholder="Nueva tarea..."
                    value={newTodo}
                    onChange={e => setNewTodo(e.target.value)}
                    autoFocus
                  />
                  <select value={newPriority} onChange={e => setNewPriority(e.target.value)} className="todo-edit-input">
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                  <input
                    className="todo-edit-input"
                    type="text"
                    placeholder="Tags (separados por coma)"
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                  />
                  <button className="todo-save-btn" type="submit">Agregar</button>
                  <button className="todo-cancel-btn" type="button" onClick={cancelEdit}>Cancelar</button>
                </form>
              )}
              <ul className={`dashboard-tasks-list${theme === 'dark' ? ' dark-mode' : ''}`}>
                {filteredTodos.length === 0 && <li>No hay tareas para esta fecha.</li>}
                {filteredTodos.map(todo => (
                  <li key={todo._id} className={todo.completed ? 'completed' : ''}>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo)}
                    />
                    {editId === todo._id ? (
                      <>
                        <input
                          className="todo-edit-input"
                          type="text"
                          value={editValue}
                          onChange={handleEditChange}
                          autoFocus
                        />
                        <select value={editPriority} onChange={e => setEditPriority(e.target.value)} className="todo-edit-input">
                          <option value="alta">Alta</option>
                          <option value="media">Media</option>
                          <option value="baja">Baja</option>
                        </select>
                        <input
                          className="todo-edit-input"
                          type="text"
                          placeholder="Tags (separados por coma)"
                          value={editTags}
                          onChange={e => setEditTags(e.target.value)}
                        />
                        <button className="todo-save-btn" onClick={() => saveEdit(todo)}>Guardar</button>
                        <button className="todo-cancel-btn" onClick={cancelEdit}>Cancelar</button>
                      </>
                    ) : (
                      <>
                        <span>{todo.title}</span>
                        <span style={{ marginLeft: 8, fontSize: 12, color: todo.priority === 'alta' ? '#e11d48' : todo.priority === 'media' ? '#f59e42' : '#22c55e', fontWeight: 600 }}>
                          {todo.priority && `(${todo.priority})`}
                        </span>
                        {todo.tags && todo.tags.length > 0 && (
                          <span style={{ marginLeft: 8, fontSize: 12, color: '#4f8cff' }}>
                            {todo.tags.map((tag, i) => (
                              <span key={i} style={{ marginRight: 4 }}>#{tag}</span>
                            ))}
                          </span>
                        )}
                        <button className="todo-edit-btn" onClick={() => startEdit(todo)} title="Editar">✏️</button>
                        <button className="todo-edit-btn" onClick={() => handleDelete(todo._id)} title="Eliminar">🗑️</button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
              {/* Modal de confirmación para eliminar */}
              {showModal && (
                <div className="modal-overlay">
                  <div className="modal">
                    <div>¿Seguro que deseas eliminar esta tarea?</div>
                    <div className="modal-actions">
                      <button className="modal-btn confirm" onClick={confirmDelete}>Eliminar</button>
                      <button className="modal-btn cancel" onClick={cancelDelete}>Cancelar</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {activeSection === 'Tareas' && (
          <div style={{ width: '100%', maxWidth: 700, margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center' }}>Vista de Tareas</h2>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <input
                className="todo-edit-input"
                type="text"
                placeholder="Buscar tarea..."
                value={taskSearch}
                onChange={e => setTaskSearch(e.target.value)}
                style={{ flex: 2 }}
              />
              <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="todo-edit-input" style={{ flex: 1 }}>
                <option value="">Todas prioridades</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
              <input
                className="todo-edit-input"
                type="text"
                placeholder="Filtrar por tag..."
                value={filterTag}
                onChange={e => setFilterTag(e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
            <ul className="dashboard-tasks-list">
              {allFilteredTodos.length === 0 && <li>No hay tareas.</li>}
              {allFilteredTodos.map(todo => (
                <li key={todo._id} className={todo.completed ? 'completed' : ''}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo)}
                  />
                  <span>{todo.title}</span>
                  <span style={{ marginLeft: 8, fontSize: 12, color: todo.priority === 'alta' ? '#e11d48' : todo.priority === 'media' ? '#f59e42' : '#22c55e', fontWeight: 600 }}>
                    {todo.priority && `(${todo.priority})`}
                  </span>
                  {todo.tags && todo.tags.length > 0 && (
                    <span style={{ marginLeft: 8, fontSize: 12, color: '#4f8cff' }}>
                      {todo.tags.map((tag, i) => (
                        <span key={i} style={{ marginRight: 4 }}>#{tag}</span>
                      ))}
                    </span>
                  )}
                  {todo.list && todo.list.name && (
                    <span style={{ marginLeft: 8, fontSize: 12, color: '#22c55e' }}>
                      [{todo.list.name}]
                    </span>
                  )}
                  <button className="todo-edit-btn" onClick={() => startEdit(todo)} title="Editar">✏️</button>
                  <button className="todo-edit-btn" onClick={() => handleDelete(todo._id)} title="Eliminar">🗑️</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {activeSection === 'Calendario' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', minHeight: 500, justifyContent: 'center' }}>
            <div className={`dashboard-calendar${theme === 'dark' ? ' dark-mode' : ''}`} style={{ background: theme === 'dark' ? '#232b43' : '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2.5rem 2rem', marginBottom: 32, minWidth: 400, maxWidth: 600, width: '100%' }}>
              <h2 style={{ textAlign: 'center', color: '#4f8cff', marginBottom: 24, fontSize: '2.2rem' }}>Calendario</h2>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="calendar-component"
                tileClassName={({ date, view }) =>
                  view === 'month' && hasTasks(date) ? 'calendar-has-tasks' : null
                }
                tileContent={({ date, view }) =>
                  view === 'month' && hasTasks(date) ? (
                    <div style={{ textAlign: 'center', marginTop: 2 }}>
                      <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#4f8cff' }}></span>
                    </div>
                  ) : null
                }
              />
              <div className="calendar-selected-date" style={{ marginTop: 18, fontWeight: 600, color: theme === 'dark' ? '#e0e7ff' : '#222', textAlign: 'center', fontSize: '1.1rem' }}>
                Seleccionado: {selectedDate.toLocaleDateString()}
              </div>
              <div style={{ marginTop: 32 }}>
                <h3 style={{ color: '#22c55e', marginBottom: 12, fontWeight: 700, textAlign: 'center' }}>Tareas del día</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {todos.filter(todo => {
                    const todoDate = new Date(todo.createdAt);
                    if (!isSameDay(todoDate, selectedDate)) return false;
                    if (filterPriority && todo.priority !== filterPriority) return false;
                    if (filterTag && (!todo.tags || !todo.tags.some(tag => tag.toLowerCase().includes(filterTag.toLowerCase())))) return false;
                    return true;
                  }).length === 0 && (
                    <li style={{ color: '#888', textAlign: 'center' }}>No hay tareas para este día.</li>
                  )}
                  {todos.filter(todo => {
                    const todoDate = new Date(todo.createdAt);
                    if (!isSameDay(todoDate, selectedDate)) return false;
                    if (filterPriority && todo.priority !== filterPriority) return false;
                    if (filterTag && (!todo.tags || !todo.tags.some(tag => tag.toLowerCase().includes(filterTag.toLowerCase())))) return false;
                    return true;
                  }).map(todo => (
                    <li key={todo._id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, background: todo.completed ? '#2d3748' : (theme === 'dark' ? '#232b43' : '#f8fafc'), borderRadius: 8, padding: '0.5rem 0.7rem', color: theme === 'dark' ? '#e0e7ff' : '#222' }}>
                      <input type="checkbox" checked={todo.completed} onChange={() => handleToggle(todo)} />
                      <span style={{ flex: 1, textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#94a3b8' : (theme === 'dark' ? '#e0e7ff' : '#222') }}>{todo.title}</span>
                      <span style={{ fontSize: 12, color: todo.priority === 'alta' ? '#e11d48' : todo.priority === 'media' ? '#f59e42' : '#22c55e', fontWeight: 600 }}>{todo.priority}</span>
                      {todo.tags && todo.tags.length > 0 && (
                        <span style={{ fontSize: 12, color: '#4f8cff' }}>{todo.tags.map((tag, i) => <span key={i} style={{ marginRight: 4 }}>#{tag}</span>)}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        {activeSection === 'Mensajes' && (
          <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center' }}>Mensajes</h2>
            {messages.length === 0 && <div style={{ textAlign: 'center', color: '#888' }}>No hay mensajes por ahora.</div>}
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {messages.map((msg, i) => (
                <li key={i} style={{ background: '#f0fdf4', color: '#222', borderRadius: 8, margin: '12px 0', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>{msg}</li>
              ))}
            </ul>
          </div>
        )}
        {activeSection === 'Configuración' && (
          <div style={{ width: '100%', minHeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2.5rem 2rem', minWidth: 320, maxWidth: 400, width: '100%' }}>
              <h2 style={{ textAlign: 'center', color: '#4f8cff', marginBottom: 24 }}>Configuración</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, margin: '2rem 0' }}>
                <div style={{ fontWeight: 600, color: '#222', marginBottom: 8 }}>
                  Correo: <span style={{ fontWeight: 400, color: '#4f8cff', marginLeft: 6 }}>{configEmail}</span>
                </div>
                {!showPasswordForm && (
                  <button
                    className="dashboard-add-btn"
                    type="button"
                    style={{ marginTop: 8, width: '100%' }}
                    onClick={() => setShowPasswordForm(true)}
                  >
                    Reset password
                  </button>
                )}
                {showPasswordForm && (
                  <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                    <label style={{ fontWeight: 600, color: '#222' }}>
                      Contraseña actual:
                      <input
                        className="todo-edit-input"
                        type="password"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        required
                      />
                    </label>
                    <label style={{ fontWeight: 600, color: '#222' }}>
                      Nueva contraseña:
                      <input
                        className="todo-edit-input"
                        type="password"
                        value={configPassword}
                        onChange={e => setConfigPassword(e.target.value)}
                        required
                      />
                    </label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="dashboard-add-btn" type="submit" style={{ marginTop: 8, flex: 1 }}>Guardar</button>
                      <button className="todo-cancel-btn" type="button" style={{ marginTop: 8, flex: 1 }} onClick={() => setShowPasswordForm(false)}>Cancelar</button>
                    </div>
                  </form>
                )}
              </div>
              <div style={{ marginTop: 32, textAlign: 'center' }}>
                <span style={{ fontWeight: 600 }}>Tema:</span>
                <button
                  className="filter-btn"
                  style={{ marginLeft: 12, background: theme === 'light' ? '#4f8cff' : '#f3f4f6', color: theme === 'light' ? '#fff' : '#222', boxShadow: theme === 'light' ? '0 2px 8px #4f8cff33' : 'none' }}
                  onClick={() => setTheme('light')}
                >🌞 Claro</button>
                <button
                  className="filter-btn"
                  style={{ marginLeft: 8, background: theme === 'dark' ? '#4f8cff' : '#f3f4f6', color: theme === 'dark' ? '#fff' : '#222', boxShadow: theme === 'dark' ? '0 2px 8px #4f8cff33' : 'none' }}
                  onClick={() => setTheme('dark')}
                >🌙 Oscuro</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Panel derecho: calendario y filtros */}
      <aside className={`dashboard-right`}>
        <div className={`dashboard-filters${theme === 'dark' ? ' dark-mode' : ''}`}>
          <div className="filters-header">Filtros</div>
          <div style={{ marginBottom: 8 }}>
            <button
              className={`filter-btn${!filterPriority ? ' active' : ''}`}
              onClick={() => setFilterPriority('')}
            >Todos</button>
            <button
              className={`filter-btn${filterPriority === 'alta' ? ' active' : ''}`}
              onClick={() => setFilterPriority('alta')}
            >Alta</button>
            <button
              className={`filter-btn${filterPriority === 'media' ? ' active' : ''}`}
              onClick={() => setFilterPriority('media')}
            >Media</button>
            <button
              className={`filter-btn${filterPriority === 'baja' ? ' active' : ''}`}
              onClick={() => setFilterPriority('baja')}
            >Baja</button>
          </div>
          <input
            className="todo-edit-input"
            type="text"
            placeholder="Filtrar por tag..."
            value={filterTag}
            onChange={e => setFilterTag(e.target.value)}
            style={{ width: '100%', marginBottom: 8 }}
          />
          {(filterPriority || filterTag) && (
            <button className="filter-btn" style={{ background: '#e11d48', color: '#fff' }} onClick={() => { setFilterPriority(''); setFilterTag(''); }}>
              Limpiar filtros
            </button>
          )}
        </div>
      </aside>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div>¿Seguro que deseas cerrar sesión?</div>
            <div className="modal-actions">
              <button className="modal-btn confirm" onClick={confirmLogout}>Cerrar sesión</button>
              <button className="modal-btn cancel" onClick={cancelLogout}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar lista */}
      {showDeleteListModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div>¿Seguro que deseas eliminar esta lista y todas sus tareas?</div>
            <div className="modal-actions">
              <button className="modal-btn confirm" onClick={confirmDeleteList}>Eliminar</button>
              <button className="modal-btn cancel" onClick={cancelDeleteList}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home; 