import { createSignal, onMount, For, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { LoaderCircle, UserCheck, UserPlus, Users as UsersIcon } from 'lucide-solid'

import api from '@/apis'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/stores/auth'

interface User {
  id: string
  username: string
  first_name: string
  last_name: string
  email: string
}

const UsersPage = () => {
  const auth = useAuth()
  const [users, setUsers] = createSignal<User[]>([])
  const [loading, setLoading] = createSignal(true)
  const [followingMap, setFollowingMap] = createSignal<Record<string, boolean>>({})

  async function fetchUsers() {
    setLoading(true)
    try {
      const res = await api.user.getUsers()
      const allUsers: User[] = res.data.data.users.filter((u: User) => u.id !== auth.user()?.id)
      setUsers(allUsers)
      // Check following status for each user
      const map: Record<string, boolean> = {}
      for (const user of allUsers) {
        try {
          const followRes = await api.follow.isFollowing(user.id)
          map[user.id] = followRes.data.data.isFollowing
        } catch {
          map[user.id] = false
        }
      }
      setFollowingMap(map)
    } catch {
      // handle
    } finally {
      setLoading(false)
    }
  }

  async function toggleFollow(userId: string) {
    try {
      if (followingMap()[userId]) {
        await api.follow.unfollow(userId)
        setFollowingMap((prev) => ({ ...prev, [userId]: false }))
      } else {
        await api.follow.follow(userId)
        setFollowingMap((prev) => ({ ...prev, [userId]: true }))
      }
    } catch {
      // handle
    }
  }

  onMount(fetchUsers)

  return (
    <div class="mx-auto max-w-4xl px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight">Users</h1>
        <p class="text-muted-foreground">Discover and follow other users</p>
      </div>

      {/* Loading */}
      <Show when={loading()}>
        <div class="flex justify-center py-20">
          <LoaderCircle class="size-8 animate-spin text-muted-foreground" />
        </div>
      </Show>

      {/* Empty State */}
      <Show when={!loading() && users().length === 0}>
        <div class="py-20 text-center">
          <UsersIcon class="mx-auto size-14 text-muted-foreground/40" />
          <h3 class="mt-4 text-xl font-semibold">No other users yet</h3>
          <p class="mt-2 text-muted-foreground">Be the first to invite someone!</p>
        </div>
      </Show>

      {/* List */}
      <Show when={!loading() && users().length > 0}>
        <div class="space-y-3">
          <For each={users()}>
            {(user) => (
              <Card class="transition-shadow hover:shadow-md">
                <CardContent class="flex items-center gap-4">
                  {/* Avatar */}
                  <Avatar class="size-10">
                    <AvatarFallback>
                      {user.first_name[0]}
                      {user.last_name[0]}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div class="min-w-0 flex-1">
                    <A
                      href={`/users/${user.id}`}
                      class="font-semibold transition-colors hover:text-primary"
                    >
                      {user.first_name} {user.last_name}
                    </A>
                    <p class="truncate text-sm text-muted-foreground">@{user.username}</p>
                  </div>

                  {/* Follow Button */}
                  <Button
                    variant={followingMap()[user.id] ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => toggleFollow(user.id)}
                    class="w-28 shrink-0"
                  >
                    <Show when={followingMap()[user.id]} fallback={<UserPlus class="size-4" />}>
                      <UserCheck class="size-4" />
                    </Show>
                    {followingMap()[user.id] ? 'Following' : 'Follow'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

export default UsersPage
