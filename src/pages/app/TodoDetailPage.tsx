import { createSignal, onMount, Show } from 'solid-js'
import { A, useParams } from '@solidjs/router'
import { ArrowLeft, Check, LoaderCircle, Pencil, Undo2, User } from 'lucide-solid'

import api from '@/apis'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
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
    <div class="mx-auto max-w-3xl px-4 py-8">
      {/* Back */}
      <A href="/todos" class={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mb-6')}>
        <ArrowLeft class="size-4" />
        Back to Todos
      </A>

      {/* Loading */}
      <Show when={loading()}>
        <div class="flex justify-center py-20">
          <LoaderCircle class="size-8 animate-spin text-muted-foreground" />
        </div>
      </Show>

      <Show when={!loading() && todo()}>
        {(todoAccessor) => {
          const t = todoAccessor()
          return (
            <Card>
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
                        value={editDescription()}
                        onInput={(e) => setEditDescription(e.currentTarget.value)}
                        rows="3"
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
                    <div>
                      <Badge variant={t.is_completed ? 'secondary' : 'outline'} class="mb-2">
                        {t.is_completed ? 'Completed' : 'Active'}
                      </Badge>
                      <h1
                        class={cn(
                          'text-2xl font-bold tracking-tight',
                          t.is_completed && 'text-muted-foreground line-through',
                        )}
                      >
                        {t.title}
                      </h1>
                      <Show when={t.description}>
                        <p class="mt-3 text-muted-foreground">{t.description}</p>
                      </Show>
                    </div>
                    <Show when={t.user.id === auth.user()?.id}>
                      <div class="flex shrink-0 gap-2">
                        <Button variant="outline" size="sm" onClick={toggleComplete}>
                          <Show when={t.is_completed} fallback={<Check class="size-4" />}>
                            <Undo2 class="size-4" />
                          </Show>
                          {t.is_completed ? 'Reopen' : 'Complete'}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={startEdit}
                          aria-label="Edit todo"
                        >
                          <Pencil class="size-4" />
                        </Button>
                      </div>
                    </Show>
                  </div>
                </Show>

                {/* Meta */}
                <Separator />
                <div class="flex items-center gap-4 text-sm text-muted-foreground">
                  <A
                    href={`/users/${t.user.id}`}
                    class="flex items-center gap-1 transition-colors hover:text-foreground"
                  >
                    <User class="size-3.5" />
                    {t.user.first_name} {t.user.last_name} (@{t.user.username})
                  </A>
                  <span>{timeAgo(t.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          )
        }}
      </Show>
    </div>
  )
}

export default TodoDetailPage
