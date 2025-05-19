import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE}/api/todos/`;

// Helper para obtener el token guardado
function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getTodos = async () => {
  const res = await axios.get(API_URL, { headers: getAuthHeader() });
  return res.data;
};

export const createTodo = async (title, list, priority = 'media', tags = []) => {
  const res = await axios.post(API_URL, { title, list, priority, tags }, { headers: getAuthHeader() });
  return res.data;
};

export const updateTodo = async (id, data) => {
  const res = await axios.put(`${API_URL}${id}`, data, { headers: getAuthHeader() });
  return res.data;
};

export const deleteTodo = async (id) => {
  const res = await axios.delete(`${API_URL}${id}`, { headers: getAuthHeader() });
  return res.data;
};

// Servicios de autenticación
const AUTH_URL = `${API_BASE}/api/auth/`;

export const register = async (email, password) => {
  const res = await axios.post(`${AUTH_URL}register`, { email, password });
  return res.data;
};

export const login = async (email, password) => {
  const res = await axios.post(`${AUTH_URL}login`, { email, password });
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
  }
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const changePassword = async (currentPassword, newPassword) => {
  const res = await axios.post(`${AUTH_URL}change-password`, { currentPassword, newPassword }, { headers: getAuthHeader() });
  return res.data;
};

// Servicios de listas
const LISTS_URL = `${API_BASE}/api/lists/`;

export const getLists = async () => {
  const res = await axios.get(LISTS_URL, { headers: getAuthHeader() });
  return res.data;
};

export const createList = async (name) => {
  const res = await axios.post(LISTS_URL, { name }, { headers: getAuthHeader() });
  return res.data;
};

export const deleteList = async (id) => {
  const res = await axios.delete(`${LISTS_URL}${id}`, { headers: getAuthHeader() });
  return res.data;
};

export const updateList = async (id, name) => {
  const res = await axios.put(`/api/lists/${id}`, { name }, { headers: getAuthHeader() });
  return res.data;
}; 