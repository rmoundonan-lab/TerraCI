import apiClient from './client';

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  verifyEmail: (token) => apiClient.post(`/auth/verify-email/${token}`),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => apiClient.post(`/auth/reset-password/${token}`, { password })
};

export const userAPI = {
  getProfile: () => apiClient.get('/users/me'),
  updateProfile: (data) => apiClient.put('/users/me', data),
  getUserProfile: (id) => apiClient.get(`/users/${id}`),
  getUserLands: (id) => apiClient.get(`/users/${id}/lands`),
  getUserReviews: (id) => apiClient.get(`/users/${id}/reviews`),
  searchUsers: (query) => apiClient.get('/users/search', { params: { q: query } })
};

export const landAPI = {
  getAllLands: (params) => apiClient.get('/lands', { params }),
  getFeaturedLands: () => apiClient.get('/lands/featured'),
  searchLands: (params) => apiClient.get('/lands/search', { params }),
  getLandDetail: (id) => apiClient.get(`/lands/${id}`),
  getSimilarLands: (id) => apiClient.get(`/lands/${id}/similar`),
  createLand: (data) => apiClient.post('/lands', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateLand: (id, data) => apiClient.put(`/lands/${id}`, data),
  deleteLand: (id) => apiClient.delete(`/lands/${id}`),
  addImages: (id, data) => apiClient.post(`/lands/${id}/images`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteImage: (id, imageId) => apiClient.delete(`/lands/${id}/images/${imageId}`),
  addDocuments: (id, data) => apiClient.post(`/lands/${id}/documents`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteDocument: (id, docId) => apiClient.delete(`/lands/${id}/documents/${docId}`)
};

export const offerAPI = {
  createOffer: (data) => apiClient.post('/offers', data),
  getLandOffers: (landId) => apiClient.get(`/offers/land/${landId}`),
  getOfferDetail: (id) => apiClient.get(`/offers/${id}`),
  updateOfferStatus: (id, data) => apiClient.put(`/offers/${id}`, data),
  withdrawOffer: (id) => apiClient.delete(`/offers/${id}`),
  getSentOffers: () => apiClient.get('/offers/user/sent'),
  getReceivedOffers: () => apiClient.get('/offers/user/received')
};

export const messageAPI = {
  getConversations: () => apiClient.get('/messages/conversations'),
  getConversationMessages: (conversationId, params) => apiClient.get(`/messages/conversations/${conversationId}`, { params }),
  sendMessage: (data) => apiClient.post('/messages', data),
  markAsRead: (id) => apiClient.put(`/messages/${id}/read`),
  searchMessages: (query) => apiClient.get('/messages/search', { params: { q: query } })
};

export const favoriteAPI = {
  addFavorite: (landId) => apiClient.post(`/favorites/${landId}`),
  removeFavorite: (landId) => apiClient.delete(`/favorites/${landId}`),
  getFavorites: (params) => apiClient.get('/favorites', { params }),
  isFavorite: (landId) => apiClient.get(`/favorites/${landId}/is-favorite`)
};

export const notificationAPI = {
  getNotifications: (params) => apiClient.get('/notifications', { params }),
  getUnreadCount: () => apiClient.get('/notifications/unread'),
  markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.put('/notifications/read-all'),
  deleteNotification: (id) => apiClient.delete(`/notifications/${id}`)
};

export const reviewAPI = {
  createReview: (userId, data) => apiClient.post(`/reviews/${userId}`, data),
  getUserReviews: (userId) => apiClient.get(`/reviews/user/${userId}`),
  updateReview: (id, data) => apiClient.put(`/reviews/${id}`, data),
  deleteReview: (id) => apiClient.delete(`/reviews/${id}`),
  getAverageRating: (userId) => apiClient.get(`/reviews/${userId}/average`)
};

export const adminAPI = {
  getAllUsers: (params) => apiClient.get('/admin/users', { params }),
  getUserDetail: (id) => apiClient.get(`/admin/users/${id}`),
  updateUserRole: (id, role) => apiClient.put(`/admin/users/${id}/role`, { role }),
  updateUserStatus: (id, data) => apiClient.put(`/admin/users/${id}/status`, data),
  getAllLands: (params) => apiClient.get('/admin/lands', { params }),
  verifyLand: (id, verified) => apiClient.put(`/admin/lands/${id}/verify`, { verified }),
  deleteLand: (id) => apiClient.delete(`/admin/lands/${id}`),
  toggleFeatured: (id, data) => apiClient.put(`/admin/lands/${id}/featured`, data),
  getReports: (params) => apiClient.get('/admin/reports', { params }),
  resolveReport: (id, data) => apiClient.put(`/admin/reports/${id}`, data),
  getStatistics: () => apiClient.get('/admin/stats'),
  getUsersStats: () => apiClient.get('/admin/stats/users'),
  getLandsStats: () => apiClient.get('/admin/stats/lands'),
  getRevenueStats: () => apiClient.get('/admin/stats/revenue')
};
