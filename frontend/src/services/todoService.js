import axios from 'axios';

const API_URL = '/api/todos/';

// Helper para obtener el token guardado
function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getTodos = async () => {
  const res = await axios.get(API_URL, { headers: getAuthHeader() });
  return res.data;
};

export const createTodo = async (title) => {
  const res = await axios.post(API_URL, { title }, { headers: getAuthHeader() });
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
const AUTH_URL = '/api/auth/';

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