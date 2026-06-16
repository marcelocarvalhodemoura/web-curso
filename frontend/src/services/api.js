const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Erro na requisição');
  }
  return data;
}

export const api = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (name, email, password) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  getMe: () => request('/auth/me'),

  getPhases: () => request('/phases'),

  getPhase: (slug) => request(`/phases/${slug}`),

  getLesson: (phaseSlug, lessonSlug) =>
    request(`/phases/${phaseSlug}/lessons/${lessonSlug}`),

  completeLesson: (phaseSlug, lessonSlug) =>
    request(`/phases/${phaseSlug}/lessons/${lessonSlug}/complete`, { method: 'POST' }),

  uncompleteLesson: (phaseSlug, lessonSlug) =>
    request(`/phases/${phaseSlug}/lessons/${lessonSlug}/complete`, { method: 'DELETE' }),

  getProgress: () => request('/progress'),

  getAdminStudents: () => request('/admin/students'),

  getAdminStudentProgress: (id) => request(`/admin/students/${id}/progress`),
};
