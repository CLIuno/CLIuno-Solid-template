import { createSignal, createMemo, onMount, For, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { FileText, LoaderCircle, MessageSquare, Plus, Trash2, User } from 'lucide-solid'

import api from '@/apis'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useAuth } from '@/stores/auth'
import { timeAgo } from '@/utils/helpers'

interface Post {
  id: string
  title: string
  content: string
  imageUrl: string
  is_paid: boolean
  createdAt: string
  user: { id: string; username: string; first_name: string; last_name: string }
  comments: Record<string, unknown>[]
}

const PostsPage = () => {
  const auth = useAuth()
  const [posts, setPosts] = createSignal<Post[]>([])
  const [loading, setLoading] = createSignal(true)
  const [showCreateModal, setShowCreateModal] = createSignal(false)
  const [newTitle, setNewTitle] = createSignal('')
  const [newContent, setNewContent] = createSignal('')
  const [creating, setCreating] = createSignal(false)
  const [filter, setFilter] = createSignal<'all' | 'mine'>('all')

  const filteredPosts = createMemo(() => {
    if (filter() === 'mine') return posts().filter((p) => p.user.id === auth.user()?.id)
    return posts()
  })

  async function fetchPosts() {
    setLoading(true)
    try {
      const res = await api.post.getAllPosts()
      setPosts(res.data.data.posts)
    } catch {
      // handle
    } finally {
      setLoading(false)
    }
  }

  async function createPost(e: Event) {
    e.preventDefault()
    if (!newTitle().trim() || !newContent().trim()) return
    setCreating(true)
    try {
      await api.post.createPost({ title: newTitle(), content: newContent() })
      setNewTitle('')
      setNewContent('')
      setShowCreateModal(false)
      await fetchPosts()
    } catch {
      // handle
    } finally {
      setCreating(false)
    }
  }

  async function deletePost(id: string) {
    try {
      await api.post.deletePostById(id)
      setPosts((prev) => prev.filter((p) => p.id !== id))
    } catch {
      // handle
    }
  }

  onMount(fetchPosts)

  return (
    <div class="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div class="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Posts</h1>
          <p class="text-muted-foreground">Share and discuss with the community</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus class="size-4" />
          New Post
        </Button>
      </div>

      {/* Filters */}
      <div class="mb-6 inline-flex w-fit items-center gap-1 rounded-lg bg-muted p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFilter('all')}
          class={cn(
            'text-muted-foreground',
            filter() === 'all' && 'bg-background text-foreground shadow-xs hover:bg-background',
          )}
        >
          All
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFilter('mine')}
          class={cn(
            'text-muted-foreground',
            filter() === 'mine' && 'bg-background text-foreground shadow-xs hover:bg-background',
          )}
        >
          Mine
        </Button>
      </div>

      {/* Loading */}
      <Show when={loading()}>
        <div class="flex justify-center py-20">
          <LoaderCircle class="size-8 animate-spin text-muted-foreground" />
        </div>
      </Show>

      {/* Empty State */}
      <Show when={!loading() && filteredPosts().length === 0}>
        <div class="py-20 text-center">
          <FileText class="mx-auto size-14 text-muted-foreground/40" />
          <h3 class="mt-4 text-xl font-semibold">No posts yet</h3>
          <p class="mt-2 text-muted-foreground">Create your first post to get started!</p>
        </div>
      </Show>

      {/* List */}
      <Show when={!loading() && filteredPosts().length > 0}>
        <div class="space-y-3">
          <For each={filteredPosts()}>
            {(post) => (
              <Card class="transition-shadow hover:shadow-md">
                <CardContent class="flex items-start gap-3">
                  {/* Content */}
                  <div class="min-w-0 flex-1">
                    <A href={`/posts/${post.id}`}>
                      <h3 class="text-lg font-semibold transition-colors hover:text-primary">
                        {post.title}
                      </h3>
                    </A>
                    <Show when={post.content}>
                      <p class="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.content}</p>
                    </Show>
                    <div class="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <A
                        href={`/users/${post.user.id}`}
                        class="flex items-center gap-1 transition-colors hover:text-foreground"
                      >
                        <User class="size-3.5" />
                        {post.user.username}
                      </A>
                      <span class="flex items-center gap-1">
                        <MessageSquare class="size-3.5" />
                        {post.comments?.length || 0}
                      </span>
                      <span>{timeAgo(post.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <Show when={post.user.id === auth.user()?.id}>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => deletePost(post.id)}
                      class="text-muted-foreground hover:text-destructive"
                      aria-label="Delete post"
                    >
                      <Trash2 class="size-4" />
                    </Button>
                  </Show>
                </CardContent>
              </Card>
            )}
          </For>
        </div>
      </Show>

      {/* Create Dialog */}
      <Dialog open={showCreateModal()} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>Share something with the community.</DialogDescription>
          </DialogHeader>
          <form onSubmit={createPost} class="space-y-4">
            <div class="space-y-2">
              <Label for="post-title">Title</Label>
              <Input
                id="post-title"
                value={newTitle()}
                onInput={(e) => setNewTitle(e.currentTarget.value)}
                type="text"
                placeholder="Post title"
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="post-content">Content</Label>
              <Textarea
                id="post-content"
                value={newContent()}
                onInput={(e) => setNewContent(e.currentTarget.value)}
                placeholder="Write your post..."
                rows="5"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={creating()}>
                <Show when={creating()}>
                  <LoaderCircle class="size-4 animate-spin" />
                </Show>
                {creating() ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PostsPage
