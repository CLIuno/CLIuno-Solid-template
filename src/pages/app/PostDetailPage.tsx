import { createSignal, onMount, For, Show } from 'solid-js'
import { A, useParams } from '@solidjs/router'
import Icon from '@/components/Icon'
import api from '@/apis'
import { useAuth } from '@/stores/auth'
import { timeAgo } from '@/utils/helpers'

interface Comment {
  id: string
  content: string
  createdAt: string
  user: { id: string; username: string; first_name: string; last_name: string }
}

interface Post {
  id: string
  title: string
  content: string
  imageUrl: string
  is_paid: boolean
  createdAt: string
  user: { id: string; username: string; first_name: string; last_name: string }
  comments: Comment[]
}

const PostDetailPage = () => {
  const params = useParams()
  const auth = useAuth()

  const [post, setPost] = createSignal<Post | null>(null)
  const [loading, setLoading] = createSignal(true)
  const [newComment, setNewComment] = createSignal('')
  const [submittingComment, setSubmittingComment] = createSignal(false)
  const [editing, setEditing] = createSignal(false)
  const [editTitle, setEditTitle] = createSignal('')
  const [editContent, setEditContent] = createSignal('')
  const [editingCommentId, setEditingCommentId] = createSignal<string | null>(null)
  const [editCommentContent, setEditCommentContent] = createSignal('')

  const id = () => params.id as string

  async function fetchPost() {
    setLoading(true)
    try {
      const res = await api.post.getPostById(id())
      setPost(res.data.data.post)
    } catch {
      // handle
    } finally {
      setLoading(false)
    }
  }

  async function addComment(e: Event) {
    e.preventDefault()
    if (!newComment().trim()) return
    setSubmittingComment(true)
    try {
      await api.post.createComment(id(), { content: newComment() })
      setNewComment('')
      await fetchPost()
    } catch {
      // handle
    } finally {
      setSubmittingComment(false)
    }
  }

  async function deleteComment(commentId: string) {
    try {
      await api.post.deleteComment(id(), commentId)
      const p = post()
      if (p) {
        setPost({ ...p, comments: p.comments.filter((c) => c.id !== commentId) })
      }
    } catch {
      // handle
    }
  }

  function startEdit() {
    const p = post()
    if (!p) return
    setEditTitle(p.title)
    setEditContent(p.content || '')
    setEditing(true)
  }

  async function saveEdit(e: Event) {
    e.preventDefault()
    const p = post()
    if (!p) return
    try {
      await api.post.updatePostById(id(), {
        title: editTitle(),
        content: editContent(),
      })
      setPost({ ...p, title: editTitle(), content: editContent() })
      setEditing(false)
    } catch {
      // handle
    }
  }

  function startEditComment(comment: Comment) {
    setEditingCommentId(comment.id)
    setEditCommentContent(comment.content)
  }

  async function saveEditComment(commentId: string) {
    try {
      await api.post.updateComment(id(), commentId, { content: editCommentContent() })
      const p = post()
      if (p) {
        setPost({
          ...p,
          comments: p.comments.map((c) =>
            c.id === commentId ? { ...c, content: editCommentContent() } : c,
          ),
        })
      }
      setEditingCommentId(null)
    } catch {
      // handle
    }
  }

  onMount(fetchPost)

  return (
    <div class="tw:max-w-3xl tw:mx-auto tw:px-4 tw:py-8">
      {/* Back */}
      <A href="/posts" class="tw:btn tw:btn-ghost tw:btn-sm tw:mb-6">
        <Icon icon="mdi:arrow-left" class="tw:w-5 tw:h-5" />
        Back to Posts
      </A>

      {/* Loading */}
      <Show when={loading()}>
        <div class="tw:flex tw:justify-center tw:py-20">
          <span class="tw:loading tw:loading-spinner tw:loading-lg tw:text-primary" />
        </div>
      </Show>

      <Show when={!loading() && post()}>
        {(postAccessor) => {
          const p = postAccessor()
          return (
            <>
              {/* Detail Card */}
              <div class="tw:card tw:bg-base-100 tw:shadow-lg tw:mb-6">
                <div class="tw:card-body">
                  <Show
                    when={!editing()}
                    fallback={
                      <form onSubmit={saveEdit} class="tw:space-y-4">
                        <input
                          value={editTitle()}
                          onInput={(e) => setEditTitle(e.currentTarget.value)}
                          type="text"
                          class="tw:input tw:input-bordered tw:w-full tw:text-xl tw:font-bold"
                        />
                        <textarea
                          value={editContent()}
                          onInput={(e) => setEditContent(e.currentTarget.value)}
                          class="tw:textarea tw:textarea-bordered tw:w-full"
                          rows="5"
                        />
                        <div class="tw:flex tw:gap-2 tw:justify-end">
                          <button
                            type="button"
                            onClick={() => setEditing(false)}
                            class="tw:btn tw:btn-sm"
                          >
                            Cancel
                          </button>
                          <button type="submit" class="tw:btn tw:btn-sm tw:btn-primary">
                            Save
                          </button>
                        </div>
                      </form>
                    }
                  >
                    <div class="tw:flex tw:items-start tw:justify-between">
                      <div>
                        <h1 class="tw:text-2xl tw:font-bold">{p.title}</h1>
                        <Show when={p.content}>
                          <p class="tw:mt-3 tw:text-base-content/70">{p.content}</p>
                        </Show>
                      </div>
                      <Show when={p.user.id === auth.user()?.id}>
                        <div class="tw:flex tw:gap-2">
                          <button onClick={startEdit} class="tw:btn tw:btn-sm tw:btn-outline">
                            <Icon icon="mdi:pencil" class="tw:w-4 tw:h-4" />
                          </button>
                        </div>
                      </Show>
                    </div>
                  </Show>

                  {/* Meta */}
                  <div class="tw:flex tw:items-center tw:gap-4 tw:mt-4 tw:pt-4 tw:border-t tw:border-base-200 tw:text-sm tw:text-base-content/50">
                    <A
                      href={`/users/${p.user.id}`}
                      class="tw:flex tw:items-center tw:gap-1 hover:tw:text-primary"
                    >
                      <Icon icon="mdi:account" class="tw:w-4 tw:h-4" />
                      {p.user.first_name} {p.user.last_name} (@{p.user.username})
                    </A>
                    <span>{timeAgo(p.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div class="tw:card tw:bg-base-100 tw:shadow-lg">
                <div class="tw:card-body">
                  <h2 class="tw:text-xl tw:font-bold tw:mb-4">
                    <Icon
                      icon="mdi:comment-multiple-outline"
                      class="tw:w-6 tw:h-6 tw:inline tw:mr-1"
                    />
                    Comments ({p.comments?.length || 0})
                  </h2>

                  {/* Add Comment */}
                  <form onSubmit={addComment} class="tw:mb-6">
                    <div class="tw:flex tw:gap-2">
                      <input
                        value={newComment()}
                        onInput={(e) => setNewComment(e.currentTarget.value)}
                        type="text"
                        placeholder="Write a comment..."
                        class="tw:input tw:input-bordered tw:flex-1"
                        required
                      />
                      <button
                        type="submit"
                        class="tw:btn tw:btn-primary"
                        disabled={submittingComment()}
                      >
                        <Icon icon="mdi:send" class="tw:w-5 tw:h-5" />
                      </button>
                    </div>
                  </form>

                  {/* Comments List */}
                  <Show
                    when={p.comments?.length}
                    fallback={
                      <div class="tw:text-center tw:py-8 tw:text-base-content/40">
                        <Icon
                          icon="mdi:comment-off-outline"
                          class="tw:w-10 tw:h-10 tw:mx-auto tw:mb-2"
                        />
                        <p>No comments yet. Be the first!</p>
                      </div>
                    }
                  >
                    <div class="tw:space-y-4">
                      <For each={p.comments}>
                        {(comment) => (
                          <div class="tw:flex tw:gap-3">
                            <div class="tw:avatar tw:placeholder">
                              <div class="tw:bg-neutral tw:text-neutral-content tw:w-8 tw:h-8 tw:rounded-full">
                                <span class="tw:text-xs">
                                  {comment.user.first_name[0]}
                                  {comment.user.last_name[0]}
                                </span>
                              </div>
                            </div>
                            <div class="tw:flex-1 tw:bg-base-200 tw:rounded-lg tw:p-3">
                              <div class="tw:flex tw:items-center tw:justify-between tw:mb-1">
                                <A
                                  href={`/users/${comment.user.id}`}
                                  class="tw:font-semibold tw:text-sm hover:tw:text-primary"
                                >
                                  {comment.user.username}
                                </A>
                                <div class="tw:flex tw:items-center tw:gap-2">
                                  <span class="tw:text-xs tw:text-base-content/50">
                                    {timeAgo(comment.createdAt)}
                                  </span>
                                  <Show when={comment.user.id === auth.user()?.id}>
                                    <button
                                      onClick={() => startEditComment(comment)}
                                      class="tw:btn tw:btn-ghost tw:btn-xs"
                                    >
                                      <Icon icon="mdi:pencil" class="tw:w-3 tw:h-3" />
                                    </button>
                                    <button
                                      onClick={() => deleteComment(comment.id)}
                                      class="tw:btn tw:btn-ghost tw:btn-xs tw:text-error"
                                    >
                                      <Icon icon="mdi:delete" class="tw:w-3 tw:h-3" />
                                    </button>
                                  </Show>
                                </div>
                              </div>

                              <Show
                                when={editingCommentId() === comment.id}
                                fallback={<p class="tw:text-sm">{comment.content}</p>}
                              >
                                <div class="tw:flex tw:gap-2">
                                  <input
                                    value={editCommentContent()}
                                    onInput={(e) => setEditCommentContent(e.currentTarget.value)}
                                    class="tw:input tw:input-sm tw:input-bordered tw:flex-1"
                                  />
                                  <button
                                    onClick={() => saveEditComment(comment.id)}
                                    class="tw:btn tw:btn-sm tw:btn-primary"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingCommentId(null)}
                                    class="tw:btn tw:btn-sm"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </Show>
                            </div>
                          </div>
                        )}
                      </For>
                    </div>
                  </Show>
                </div>
              </div>
            </>
          )
        }}
      </Show>
    </div>
  )
}

export default PostDetailPage
