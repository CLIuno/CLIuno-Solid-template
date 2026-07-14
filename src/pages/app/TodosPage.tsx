import { createSignal, createMemo, onMount, For, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { ClipboardCheck, LoaderCircle, Plus, Trash2, User } from 'lucide-solid'

import api from '@/apis'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
    <div class="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div class="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Todos</h1>
          <p class="text-muted-foreground">Manage your tasks and collaborate with others</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus class="size-4" />
          New Todo
        </Button>
      </div>

      {/* Filters */}
      <div class="mb-6 inline-flex w-fit items-center gap-1 rounded-lg bg-muted p-1">
        <For each={filters}>
          {(f) => (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter(f.key)}
              class={cn(
                'text-muted-foreground',
                filter() === f.key && 'bg-background text-foreground shadow-xs hover:bg-background',
              )}
            >
              {f.label}
            </Button>
          )}
        </For>
      </div>

      {/* Loading */}
      <Show when={loading()}>
        <div class="flex justify-center py-20">
          <LoaderCircle class="size-8 animate-spin text-muted-foreground" />
        </div>
      </Show>

      {/* Empty State */}
      <Show when={!loading() && filteredTodos().length === 0}>
        <div class="py-20 text-center">
          <ClipboardCheck class="mx-auto size-14 text-muted-foreground/40" />
          <h3 class="mt-4 text-xl font-semibold">No todos yet</h3>
          <p class="mt-2 text-muted-foreground">Create your first todo to get started!</p>
        </div>
      </Show>

      {/* List */}
      <Show when={!loading() && filteredTodos().length > 0}>
        <div class="space-y-3">
          <For each={filteredTodos()}>
            {(todo) => (
              <Card class="transition-shadow hover:shadow-md">
                <CardContent class="flex items-start gap-3">
                  {/* Checkbox */}
                  <Checkbox
                    checked={todo.is_completed}
                    onChange={() => toggleTodo(todo.id)}
                    disabled={todo.user.id !== auth.user()?.id}
                    class="mt-1"
                    aria-label={todo.is_completed ? 'Mark as active' : 'Mark as completed'}
                  />

                  {/* Content */}
                  <div class="min-w-0 flex-1">
                    <A href={`/todos/${todo.id}`}>
                      <h3
                        class={cn(
                          'text-lg font-semibold transition-colors hover:text-primary',
                          todo.is_completed && 'text-muted-foreground line-through',
                        )}
                      >
                        {todo.title}
                      </h3>
                    </A>
                    <Show when={todo.description}>
                      <p class="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {todo.description}
                      </p>
                    </Show>
                    <div class="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <A
                        href={`/users/${todo.user.id}`}
                        class="flex items-center gap-1 transition-colors hover:text-foreground"
                      >
                        <User class="size-3.5" />
                        {todo.user.username}
                      </A>
                      <span>{timeAgo(todo.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <Show when={todo.user.id === auth.user()?.id}>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => deleteTodo(todo.id)}
                      class="text-muted-foreground hover:text-destructive"
                      aria-label="Delete todo"
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
            <DialogTitle>Create New Todo</DialogTitle>
            <DialogDescription>Add a task to your list.</DialogDescription>
          </DialogHeader>
          <form onSubmit={createTodo} class="space-y-4">
            <div class="space-y-2">
              <Label for="todo-title">Title</Label>
              <Input
                id="todo-title"
                value={newTitle()}
                onInput={(e) => setNewTitle(e.currentTarget.value)}
                type="text"
                placeholder="What needs to be done?"
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="todo-description">Description (optional)</Label>
              <Textarea
                id="todo-description"
                value={newDescription()}
                onInput={(e) => setNewDescription(e.currentTarget.value)}
                placeholder="Add more details..."
                rows="3"
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

export default TodosPage
