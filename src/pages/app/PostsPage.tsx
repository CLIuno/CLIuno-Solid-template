import { createSignal, createMemo, onMount, For, Show } from 'solid-js'
import { A } from '@solidjs/router'
import Icon from '@/components/Icon'
import api from '@/apis'
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
    <div class="tw:max-w-4xl tw:mx-auto tw:px-4 tw:py-8">
      {/* Header */}
      <div class="tw:flex tw:items-center tw:justify-between tw:mb-8">
        <div>
          <h1 class="tw:text-3xl tw:font-bold tw:text-base-content">Posts</h1>
          <p class="tw:text-base-content/60">Share and discuss with the community</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} class="tw:btn tw:btn-primary">
          <Icon icon="mdi:plus" class="tw:w-5 tw:h-5" />
          New Post
        </button>
      </div>

      {/* Filters */}
      <div class="tw:tabs tw:tabs-boxed tw:mb-6 tw:w-fit">
        <button
          class="tw:tab"
          classList={{ 'tw:tab-active': filter() === 'all' }}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          class="tw:tab"
          classList={{ 'tw:tab-active': filter() === 'mine' }}
          onClick={() => setFilter('mine')}
        >
          Mine
        </button>
      </div>

      {/* Loading */}
      <Show when={loading()}>
        <div class="tw:flex tw:justify-center tw:py-20">
          <span class="tw:loading tw:loading-spinner tw:loading-lg tw:text-primary" />
        </div>
      </Show>

      {/* Empty State */}
      <Show when={!loading() && filteredPosts().length === 0}>
        <div class="tw:text-center tw:py-20">
          <Icon
            icon="mdi:post-outline"
            class="tw:w-16 tw:h-16 tw:mx-auto tw:text-base-content/30"
          />
          <h3 class="tw:text-xl tw:font-semibold tw:mt-4">No posts yet</h3>
          <p class="tw:text-base-content/60 tw:mt-2">Create your first post to get started!</p>
        </div>
      </Show>

      {/* List */}
      <Show when={!loading() && filteredPosts().length > 0}>
        <div class="tw:space-y-3">
          <For each={filteredPosts()}>
            {(post) => (
              <div class="tw:card tw:bg-base-100 tw:shadow-sm hover:tw:shadow-md tw:transition-shadow">
                <div class="tw:card-body tw:p-4">
                  <div class="tw:flex tw:items-start tw:gap-3">
                    {/* Content */}
                    <div class="tw:flex-1 tw:min-w-0">
                      <A href={`/posts/${post.id}`}>
                        <h3 class="tw:font-semibold tw:text-lg hover:tw:text-primary tw:transition-colors">
                          {post.title}
                        </h3>
                      </A>
                      <Show when={post.content}>
                        <p class="tw:text-base-content/60 tw:text-sm tw:mt-1 tw:line-clamp-2">
                          {post.content}
                        </p>
                      </Show>
                      <div class="tw:flex tw:items-center tw:gap-4 tw:mt-2 tw:text-sm tw:text-base-content/50">
                        <A
                          href={`/users/${post.user.id}`}
                          class="tw:flex tw:items-center tw:gap-1 hover:tw:text-primary"
                        >
                          <Icon icon="mdi:account" class="tw:w-4 tw:h-4" />
                          {post.user.username}
                        </A>
                        <span class="tw:flex tw:items-center tw:gap-1">
                          <Icon icon="mdi:comment-outline" class="tw:w-4 tw:h-4" />
                          {post.comments?.length || 0}
                        </span>
                        <span>{timeAgo(post.createdAt)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <Show when={post.user.id === auth.user()?.id}>
                      <div class="tw:dropdown tw:dropdown-end">
                        <button class="tw:btn tw:btn-ghost tw:btn-sm tw:btn-circle">
                          <Icon icon="mdi:dots-vertical" class="tw:w-5 tw:h-5" />
                        </button>
                        <ul class="tw:dropdown-content tw:menu tw:p-2 tw:shadow tw:bg-base-100 tw:rounded-box tw:w-40 tw:z-10">
                          <li>
                            <A href={`/posts/${post.id}`}>
                              <Icon icon="mdi:eye" class="tw:w-4 tw:h-4" /> View
                            </A>
                          </li>
                          <li>
                            <button onClick={() => deletePost(post.id)} class="tw:text-error">
                              <Icon icon="mdi:delete" class="tw:w-4 tw:h-4" /> Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </Show>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>

      {/* Create Modal */}
      <Show when={showCreateModal()}>
        <div class="tw:modal tw:modal-open">
          <div class="tw:modal-box">
            <h3 class="tw:font-bold tw:text-lg tw:mb-4">Create New Post</h3>
            <form onSubmit={createPost} class="tw:space-y-4">
              <div class="tw:form-control">
                <div class="tw:label">
                  <span class="tw:label-text">Title</span>
                </div>
                <input
                  value={newTitle()}
                  onInput={(e) => setNewTitle(e.currentTarget.value)}
                  type="text"
                  placeholder="Post title"
                  class="tw:input tw:input-bordered tw:w-full"
                  required
                />
              </div>
              <div class="tw:form-control">
                <div class="tw:label">
                  <span class="tw:label-text">Content</span>
                </div>
                <textarea
                  value={newContent()}
                  onInput={(e) => setNewContent(e.currentTarget.value)}
                  placeholder="Write your post..."
                  class="tw:textarea tw:textarea-bordered tw:w-full"
                  rows="5"
                  required
                />
              </div>
              <div class="tw:modal-action">
                <button type="button" onClick={() => setShowCreateModal(false)} class="tw:btn">
                  Cancel
                </button>
                <button type="submit" class="tw:btn tw:btn-primary" disabled={creating()}>
                  {creating() ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
          <button
            type="button"
            class="tw:modal-backdrop"
            onClick={() => setShowCreateModal(false)}
            aria-label="Close modal"
          />
        </div>
      </Show>
    </div>
  )
}

export default PostsPage
