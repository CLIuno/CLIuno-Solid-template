import { createSignal, createMemo, onMount, For, Show } from 'solid-js'
import { A } from '@solidjs/router'
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

const TodosPage = () => {
  const auth = useAuth()
  const [todos, setTodos] = createSignal<Todo[]>([])
  const [loading, setLoading] = createSignal(true)
  const [showCreateModal, setShowCreateModal] = createSignal(false)
  const [newTitle, setNewTitle] = createSignal('')
  const [newDescription, setNewDescription] = createSignal('')
  const [creating, setCreating] = createSignal(false)
  const [filter, setFilter] = createSignal<'all' | 'mine' | 'active' | 'completed'>('all')

  const filteredTodos = createMemo(() => {
    let result = todos()
    const f = filter()
    if (f === 'mine') result = result.filter((t) => t.user.id === auth.user()?.id)
    if (f === 'active') result = result.filter((t) => !t.is_completed)
    if (f === 'completed') result = result.filter((t) => t.is_completed)
    return result
  })

  async function fetchTodos() {
    setLoading(true)
    try {
      const res = await api.todo.getAllTodos()
      setTodos(res.data.data.todos)
    } catch {
      // handle
    } finally {
      setLoading(false)
    }
  }

  async function createTodo(e: Event) {
    e.preventDefault()
    if (!newTitle().trim()) return
    setCreating(true)
    try {
      await api.todo.createTodo({ title: newTitle(), description: newDescription() })
      setNewTitle('')
      setNewDescription('')
      setShowCreateModal(false)
      await fetchTodos()
    } catch {
      // handle
    } finally {
      setCreating(false)
    }
  }

  async function toggleTodo(id: string) {
    try {
      await api.todo.toggleTodo(id)
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_completed: !t.is_completed } : t)),
      )
    } catch {
      // handle
    }
  }

  async function deleteTodo(id: string) {
    try {
      await api.todo.deleteTodo(id)
      setTodos((prev) => prev.filter((t) => t.id !== id))
    } catch {
      // handle
    }
  }

  onMount(fetchTodos)

  const filters: Array<{ key: 'all' | 'mine' | 'active' | 'completed'; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'mine', label: 'Mine' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
  ]

  return (
    <div class="tw:max-w-4xl tw:mx-auto tw:px-4 tw:py-8">
      {/* Header */}
      <div class="tw:flex tw:items-center tw:justify-between tw:mb-8">
        <div>
          <h1 class="tw:text-3xl tw:font-bold tw:text-base-content">Todos</h1>
          <p class="tw:text-base-content/60">Manage your tasks and collaborate with others</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} class="tw:btn tw:btn-primary">
          <Icon icon="mdi:plus" class="tw:w-5 tw:h-5" />
          New Todo
        </button>
      </div>

      {/* Filters */}
      <div class="tw:tabs tw:tabs-boxed tw:mb-6 tw:w-fit">
        <For each={filters}>
          {(f) => (
            <button
              class="tw:tab"
              classList={{ 'tw:tab-active': filter() === f.key }}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          )}
        </For>
      </div>

      {/* Loading */}
      <Show when={loading()}>
        <div class="tw:flex tw:justify-center tw:py-20">
          <span class="tw:loading tw:loading-spinner tw:loading-lg tw:text-primary" />
        </div>
      </Show>

      {/* Empty State */}
      <Show when={!loading() && filteredTodos().length === 0}>
        <div class="tw:text-center tw:py-20">
          <Icon
            icon="mdi:clipboard-check-outline"
            class="tw:w-16 tw:h-16 tw:mx-auto tw:text-base-content/30"
          />
          <h3 class="tw:text-xl tw:font-semibold tw:mt-4">No todos yet</h3>
          <p class="tw:text-base-content/60 tw:mt-2">Create your first todo to get started!</p>
        </div>
      </Show>

      {/* List */}
      <Show when={!loading() && filteredTodos().length > 0}>
        <div class="tw:space-y-3">
          <For each={filteredTodos()}>
            {(todo) => (
              <div class="tw:card tw:bg-base-100 tw:shadow-sm hover:tw:shadow-md tw:transition-shadow">
                <div class="tw:card-body tw:p-4">
                  <div class="tw:flex tw:items-start tw:gap-3">
                    {/* Checkbox */}
                    <Show
                      when={todo.user.id === auth.user()?.id}
                      fallback={
                        <div class="tw:mt-1 tw:shrink-0">
                          <Icon
                            icon={
                              todo.is_completed
                                ? 'mdi:checkbox-marked-circle'
                                : 'mdi:checkbox-blank-circle-outline'
                            }
                            class={`tw:w-6 tw:h-6 ${todo.is_completed ? 'tw:text-success' : 'tw:text-base-content/30'}`}
                          />
                        </div>
                      }
                    >
                      <button onClick={() => toggleTodo(todo.id)} class="tw:mt-1 tw:shrink-0">
                        <Icon
                          icon={
                            todo.is_completed
                              ? 'mdi:checkbox-marked-circle'
                              : 'mdi:checkbox-blank-circle-outline'
                          }
                          class={`tw:w-6 tw:h-6 ${todo.is_completed ? 'tw:text-success' : 'tw:text-base-content/30'}`}
                        />
                      </button>
                    </Show>

                    {/* Content */}
                    <div class="tw:flex-1 tw:min-w-0">
                      <A href={`/todos/${todo.id}`}>
                        <h3
                          class="tw:font-semibold tw:text-lg hover:tw:text-primary tw:transition-colors"
                          classList={{
                            'tw:line-through tw:opacity-60': todo.is_completed,
                          }}
                        >
                          {todo.title}
                        </h3>
                      </A>
                      <Show when={todo.description}>
                        <p class="tw:text-base-content/60 tw:text-sm tw:mt-1 tw:line-clamp-2">
                          {todo.description}
                        </p>
                      </Show>
                      <div class="tw:flex tw:items-center tw:gap-4 tw:mt-2 tw:text-sm tw:text-base-content/50">
                        <A
                          href={`/users/${todo.user.id}`}
                          class="tw:flex tw:items-center tw:gap-1 hover:tw:text-primary"
                        >
                          <Icon icon="mdi:account" class="tw:w-4 tw:h-4" />
                          {todo.user.username}
                        </A>
                        <span>{timeAgo(todo.createdAt)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <Show when={todo.user.id === auth.user()?.id}>
                      <div class="tw:dropdown tw:dropdown-end">
                        <button class="tw:btn tw:btn-ghost tw:btn-sm tw:btn-circle">
                          <Icon icon="mdi:dots-vertical" class="tw:w-5 tw:h-5" />
                        </button>
                        <ul class="tw:dropdown-content tw:menu tw:p-2 tw:shadow tw:bg-base-100 tw:rounded-box tw:w-40 tw:z-10">
                          <li>
                            <A href={`/todos/${todo.id}`}>
                              <Icon icon="mdi:eye" class="tw:w-4 tw:h-4" /> View
                            </A>
                          </li>
                          <li>
                            <button onClick={() => deleteTodo(todo.id)} class="tw:text-error">
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
            <h3 class="tw:font-bold tw:text-lg tw:mb-4">Create New Todo</h3>
            <form onSubmit={createTodo} class="tw:space-y-4">
              <div class="tw:form-control">
                <div class="tw:label">
                  <span class="tw:label-text">Title</span>
                </div>
                <input
                  value={newTitle()}
                  onInput={(e) => setNewTitle(e.currentTarget.value)}
                  type="text"
                  placeholder="What needs to be done?"
                  class="tw:input tw:input-bordered tw:w-full"
                  required
                />
              </div>
              <div class="tw:form-control">
                <div class="tw:label">
                  <span class="tw:label-text">Description (optional)</span>
                </div>
                <textarea
                  value={newDescription()}
                  onInput={(e) => setNewDescription(e.currentTarget.value)}
                  placeholder="Add more details..."
                  class="tw:textarea tw:textarea-bordered tw:w-full"
                  rows="3"
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

export default TodosPage
