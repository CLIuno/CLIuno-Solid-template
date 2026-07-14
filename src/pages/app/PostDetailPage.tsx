import { createSignal, onMount, For, Show } from 'solid-js'
import { A, useParams } from '@solidjs/router'
import { ArrowLeft, LoaderCircle, MessageSquare, Pencil, Send, Trash2, User } from 'lucide-solid'

import api from '@/apis'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
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
    <div class="mx-auto max-w-3xl px-4 py-8">
      {/* Back */}
      <A href="/posts" class={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mb-6')}>
        <ArrowLeft class="size-4" />
        Back to Posts
      </A>

      {/* Loading */}
      <Show when={loading()}>
        <div class="flex justify-center py-20">
          <LoaderCircle class="size-8 animate-spin text-muted-foreground" />
        </div>
      </Show>

      <Show when={!loading() && post()}>
        {(postAccessor) => {
          const p = postAccessor()
          return (
            <>
              {/* Detail Card */}
              <Card class="mb-6">
                <CardContent class="space-y-4">
                  <Show
                    when={!editing()}
                    fallback={
                      <form onSubmit={saveEdit} class="space-y-4">
                        <Input
                          value={editTitle()}
                          onInput={(e) => setEditTitle(e.currentTarget.value)}
                          type="text"
                          class="text-lg font-semibold"
                        />
                        <Textarea
                          value={editContent()}
                          onInput={(e) => setEditContent(e.currentTarget.value)}
                          rows="5"
                        />
                        <div class="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" size="sm">
                            Save
                          </Button>
                        </div>
                      </form>
                    }
                  >
                    <div class="flex items-start justify-between gap-4">
                      <div class="min-w-0">
                        <h1 class="text-2xl font-bold tracking-tight">{p.title}</h1>
                        <Show when={p.content}>
                          <p class="mt-3 text-muted-foreground">{p.content}</p>
                        </Show>
                      </div>
                      <Show when={p.user.id === auth.user()?.id}>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={startEdit}
                          class="shrink-0"
                          aria-label="Edit post"
                        >
                          <Pencil class="size-4" />
                        </Button>
                      </Show>
                    </div>
                  </Show>

                  {/* Meta */}
                  <Separator />
                  <div class="flex items-center gap-4 text-sm text-muted-foreground">
                    <A
                      href={`/users/${p.user.id}`}
                      class="flex items-center gap-1 transition-colors hover:text-foreground"
                    >
                      <User class="size-3.5" />
                      {p.user.first_name} {p.user.last_name} (@{p.user.username})
                    </A>
                    <span>{timeAgo(p.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card>
                <CardHeader>
                  <CardTitle class="flex items-center gap-2 text-lg">
                    <MessageSquare class="size-5" />
                    Comments ({p.comments?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent class="space-y-6">
                  {/* Add Comment */}
                  <form onSubmit={addComment} class="flex gap-2">
                    <Input
                      value={newComment()}
                      onInput={(e) => setNewComment(e.currentTarget.value)}
                      type="text"
                      placeholder="Write a comment..."
                      class="flex-1"
                      required
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={submittingComment()}
                      aria-label="Send comment"
                    >
                      <Show when={submittingComment()} fallback={<Send class="size-4" />}>
                        <LoaderCircle class="size-4 animate-spin" />
                      </Show>
                    </Button>
                  </form>

                  {/* Comments List */}
                  <Show
                    when={p.comments?.length}
                    fallback={
                      <div class="py-8 text-center text-muted-foreground">
                        <MessageSquare class="mx-auto mb-2 size-10 text-muted-foreground/40" />
                        <p>No comments yet. Be the first!</p>
                      </div>
                    }
                  >
                    <div class="space-y-4">
                      <For each={p.comments}>
                        {(comment) => (
                          <div class="flex gap-3">
                            <Avatar>
                              <AvatarFallback class="text-xs">
                                {comment.user.first_name[0]}
                                {comment.user.last_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div class="min-w-0 flex-1 rounded-lg bg-muted p-3">
                              <div class="mb-1 flex items-center justify-between gap-2">
                                <A
                                  href={`/users/${comment.user.id}`}
                                  class="text-sm font-semibold transition-colors hover:text-primary"
                                >
                                  {comment.user.username}
                                </A>
                                <div class="flex items-center gap-1">
                                  <span class="text-xs text-muted-foreground">
                                    {timeAgo(comment.createdAt)}
                                  </span>
                                  <Show when={comment.user.id === auth.user()?.id}>
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      onClick={() => startEditComment(comment)}
                                      aria-label="Edit comment"
                                    >
                                      <Pencil class="size-3.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      onClick={() => deleteComment(comment.id)}
                                      class="text-muted-foreground hover:text-destructive"
                                      aria-label="Delete comment"
                                    >
                                      <Trash2 class="size-3.5" />
                                    </Button>
                                  </Show>
                                </div>
                              </div>

                              <Show
                                when={editingCommentId() === comment.id}
                                fallback={<p class="text-sm">{comment.content}</p>}
                              >
                                <div class="flex gap-2">
                                  <Input
                                    value={editCommentContent()}
                                    onInput={(e) => setEditCommentContent(e.currentTarget.value)}
                                    class="flex-1 bg-background"
                                  />
                                  <Button size="sm" onClick={() => saveEditComment(comment.id)}>
                                    Save
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingCommentId(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </Show>
                            </div>
                          </div>
                        )}
                      </For>
                    </div>
                  </Show>
                </CardContent>
              </Card>
            </>
          )
        }}
      </Show>
    </div>
  )
}

export default PostDetailPage
