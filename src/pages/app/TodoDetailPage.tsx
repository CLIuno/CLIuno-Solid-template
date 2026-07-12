import { createSignal, onMount, Show } from 'solid-js'
import { A, useParams } from '@solidjs/router'
import Icon from '@/components/Icon'
import api from '@/apis'
import { useAuth } from '@/stores/auth'
import { timeAgo } from '@/utils/helpers'

interface Todo {
  id: string
  title: string
  description: string
  is_completed: boolean
  createdAt: string
  user: { id: string; username: string; first_name: string; last_name: string }
}

const TodoDetailPage = () => {
  const params = useParams()
  const auth = useAuth()

  const [todo, setTodo] = createSignal<Todo | null>(null)
  const [loading, setLoading] = createSignal(true)
  const [editing, setEditing] = createSignal(false)
  const [editTitle, setEditTitle] = createSignal('')
  const [editDescription, setEditDescription] = createSignal('')

  const id = () => params.id as string

  async function fetchTodo() {
    setLoading(true)
    try {
      const res = await api.todo.getTodoById(id())
      setTodo(res.data.data.todo)
    } catch {
      // handle
    } finally {
      setLoading(false)
    }
  }

  async function toggleComplete() {
    const t = todo()
    if (!t) return
    try {
      await api.todo.toggleTodo(id())
      setTodo({ ...t, is_completed: !t.is_completed })
    } catch {
      // handle
    }
  }

  function startEdit() {
    const t = todo()
    if (!t) return
    setEditTitle(t.title)
    setEditDescription(t.description || '')
    setEditing(true)
  }

  async function saveEdit(e: Event) {
    e.preventDefault()
    const t = todo()
    if (!t) return
    try {
      await api.todo.updateTodo(id(), {
        title: editTitle(),
        description: editDescription(),
      })
      setTodo({ ...t, title: editTitle(), description: editDescription() })
      setEditing(false)
    } catch {
      // handle
    }
  }

  onMount(fetchTodo)

  return (
    <div class="tw:max-w-3xl tw:mx-auto tw:px-4 tw:py-8">
      {/* Back */}
      <A href="/todos" class="tw:btn tw:btn-ghost tw:btn-sm tw:mb-6">
        <Icon icon="mdi:arrow-left" class="tw:w-5 tw:h-5" />
        Back to Todos
      </A>

      {/* Loading */}
      <Show when={loading()}>
        <div class="tw:flex tw:justify-center tw:py-20">
          <span class="tw:loading tw:loading-spinner tw:loading-lg tw:text-primary" />
        </div>
      </Show>

      <Show when={!loading() && todo()}>
        {(todoAccessor) => {
          const t = todoAccessor()
          return (
            <div class="tw:card tw:bg-base-100 tw:shadow-lg">
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
                        value={editDescription()}
                        onInput={(e) => setEditDescription(e.currentTarget.value)}
                        class="tw:textarea tw:textarea-bordered tw:w-full"
                        rows="3"
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
                      <div class="tw:flex tw:items-center tw:gap-3 tw:mb-2">
                        <span
                          class="tw:badge"
                          classList={{
                            'tw:badge-success': t.is_completed,
                            'tw:badge-warning': !t.is_completed,
                          }}
                        >
                          {t.is_completed ? 'Completed' : 'Active'}
                        </span>
                      </div>
                      <h1
                        class="tw:text-2xl tw:font-bold"
                        classList={{
                          'tw:line-through tw:opacity-60': t.is_completed,
                        }}
                      >
                        {t.title}
                      </h1>
                      <Show when={t.description}>
                        <p class="tw:mt-3 tw:text-base-content/70">{t.description}</p>
                      </Show>
                    </div>
                    <Show when={t.user.id === auth.user()?.id}>
                      <div class="tw:flex tw:gap-2">
                        <button
                          onClick={toggleComplete}
                          class="tw:btn tw:btn-sm tw:btn-outline"
                          classList={{
                            'tw:btn-warning': t.is_completed,
                            'tw:btn-success': !t.is_completed,
                          }}
                        >
                          <Icon
                            icon={t.is_completed ? 'mdi:undo' : 'mdi:check'}
                            class="tw:w-4 tw:h-4"
                          />
                          {t.is_completed ? 'Reopen' : 'Complete'}
                        </button>
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
                    href={`/users/${t.user.id}`}
                    class="tw:flex tw:items-center tw:gap-1 hover:tw:text-primary"
                  >
                    <Icon icon="mdi:account" class="tw:w-4 tw:h-4" />
                    {t.user.first_name} {t.user.last_name} (@{t.user.username})
                  </A>
                  <span>{timeAgo(t.createdAt)}</span>
                </div>
              </div>
            </div>
          )
        }}
      </Show>
    </div>
  )
}

export default TodoDetailPage
