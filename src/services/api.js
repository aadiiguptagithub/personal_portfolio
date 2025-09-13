import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hero API
export const heroAPI = {
  getHero: () => api.get('/hero'),
  updateHero: (data) => api.put('/hero', data),
};

// Resume API
export const resumeAPI = {
  getResume: () => api.get('/resume'),
  updateResume: (data) => api.put('/resume', data),
  addExperience: (data) => api.post('/resume/experience', data),
  updateExperience: (id, data) => api.put(`/resume/experience/${id}`, data),
  deleteExperience: (id) => api.delete(`/resume/experience/${id}`),
  addEducation: (data) => api.post('/resume/education', data),
  deleteEducation: (id) => api.delete(`/resume/education/${id}`),
  addProject: (data) => api.post('/resume/projects', data),
  deleteProject: (id) => api.delete(`/resume/projects/${id}`)
};

// Projects API
export const projectsAPI = {
  getProjects: () => api.get('/projects'),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  getHomeProjects: () => api.get('/projects/home'),
  toggleHomePage: (id) => api.patch(`/projects/${id}/toggle-home`)
};

// Upload API
export const uploadAPI = {
  uploadBase64: (image, folder = 'portfolio') => api.post('/upload/base64', { image, folder }),
  uploadFile: (formData) => api.post('/upload/file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteImage: (public_id) => api.delete('/upload', { data: { public_id } })
};

// Users API
export const usersAPI = {
  getUsers: () => api.get('/users'),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  updateUserStatus: (id, status) => api.patch(`/users/${id}/status`, { status })
};

// Blogs API
export const blogsAPI = {
  getBlogs: (params) => api.get('/blogs', { params }),
  getBlog: (id) => api.get(`/blogs/${id}`),
  getBlogBySlug: (slug) => api.get(`/blogs/slug/${slug}`),
  createBlog: (data) => api.post('/blogs', data),
  updateBlog: (id, data) => api.put(`/blogs/${id}`, data),
  deleteBlog: (id) => api.delete(`/blogs/${id}`),
  updateBlogStatus: (id, status) => api.patch(`/blogs/${id}/status`, { status }),
  toggleFeatured: (id) => api.patch(`/blogs/${id}/featured`),
  trackView: (id) => api.post(`/blogs/${id}/view`),
  toggleLike: (id, action) => api.post(`/blogs/${id}/like`, { action }),
  getAnalytics: () => api.get('/blogs/analytics')
};

export default api;