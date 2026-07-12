import http from './http'

const postApi = {
  getCurrentUserPosts: () => http.get('/posts/current-user'),
  getAllPosts: () => http.get('/posts'),
  getPostById: (id: string) => http.get(`/posts/${id}`),
  createPost: (postData: { title: string; content: string }) => http.post('/posts', postData),
  updatePostById: (id: string, postData: { title?: string; content?: string }) =>
    http.patch(`/posts/${id}`, postData),
  deletePostById: (id: string) => http.delete(`/posts/${id}`),
  getComments: (postId: string) => http.get(`/posts/${postId}/comments`),
  createComment: (postId: string, data: { content: string }) =>
    http.post(`/posts/${postId}/comments`, data),
  updateComment: (postId: string, commentId: string, data: { content: string }) =>
    http.patch(`/posts/${postId}/comments/${commentId}`, data),
  deleteComment: (postId: string, commentId: string) =>
    http.delete(`/posts/${postId}/comments/${commentId}`),
}

export default postApi
