import http from './http'

const userApi = {
  getCurrentUser: () => http.get('/users/current'),
  getUsers: () => http.get('/users'),
  getUserById: (id: string) => http.get(`/users/${id}`),
  updateUserById: (id: string, userData: Record<string, unknown>) =>
    http.patch(`/users/${id}`, userData),
  deleteUserById: (id: string) => http.delete(`/users/${id}`),
  getPostsByUser: (userId: string) => http.get(`/users/${userId}/posts`),
}

export default userApi
