import { createSignal, For, Show, createEffect, on } from 'solid-js'
import { A, useParams } from '@solidjs/router'
import { ArrowLeft, LoaderCircle, UserCheck, UserPlus, Users as UsersIcon } from 'lucide-solid'

import api from '@/apis'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useAuth, type User } from '@/stores/auth'

function FollowList(props: Readonly<{ users: User[]; emptyText: string }>) {
  return (
    <Show
      when={props.users.length > 0}
      fallback={<p class="text-sm text-muted-foreground">{props.emptyText}</p>}
    >
      <div class="space-y-1">
        <For each={props.users}>
          {(f) => (
            <A
              href={`/users/${f.id}`}
              class="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
            >
              <Avatar>
                <AvatarFallback class="text-xs">
                  {f.first_name[0]}
                  {f.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p class="text-sm font-medium">
                  {f.first_name} {f.last_name}
                </p>
                <p class="text-xs text-muted-foreground">@{f.username}</p>
              </div>
            </A>
          )}
        </For>
      </div>
    </Show>
  )
}

const UserProfilePage = () => {
  const params = useParams()
  const auth = useAuth()

  const [user, setUser] = createSignal<User | null>(null)
  const [loading, setLoading] = createSignal(true)
  const [followers, setFollowers] = createSignal<User[]>([])
  const [following, setFollowing] = createSignal<User[]>([])
  const [isFollowing, setIsFollowing] = createSignal(false)

  const isOwnProfile = () => auth.user()?.id === user()?.id

  async function loadProfile() {
    setLoading(true)
    const userId = params.id || auth.user()?.id
    if (!userId) {
      setLoading(false)
      return
    }
    try {
      const userRes = await api.user.getUserById(userId)
      setUser(userRes.data.data.user)

      const [followersRes, followingRes, followStatusRes] = await Promise.all([
        api.follow.getFollowers(userId),
        api.follow.getFollowing(userId),
        auth.user()?.id === userId
          ? Promise.resolve({ data: { data: { isFollowing: false } } })
          : api.follow.isFollowing(userId),
      ])
      setFollowers(followersRes.data.data.followers)
      setFollowing(followingRes.data.data.following)
      setIsFollowing(followStatusRes.data.data.isFollowing)
    } catch {
      // handle
    } finally {
      setLoading(false)
    }
  }

  async function toggleFollow() {
    const u = user()
    if (!u) return
    try {
      if (isFollowing()) {
        await api.follow.unfollow(u.id)
        setIsFollowing(false)
        setFollowers((prev) => prev.filter((f) => f.id !== auth.user()?.id))
      } else {
        await api.follow.follow(u.id)
        setIsFollowing(true)
        const me = auth.user()
        if (me) setFollowers((prev) => [...prev, me])
      }
    } catch {
      // handle
    }
  }

  // Re-load whenever the route param changes
  createEffect(
    on(
      () => params.id,
      () => loadProfile(),
    ),
  )

  return (
    <div class="mx-auto max-w-3xl px-4 py-8">
      {/* Back */}
      <A href="/users" class={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mb-6')}>
        <ArrowLeft class="size-4" />
        Back to Users
      </A>

      {/* Loading */}
      <Show when={loading()}>
        <div class="flex justify-center py-20">
          <LoaderCircle class="size-8 animate-spin text-muted-foreground" />
        </div>
      </Show>

      <Show when={!loading() && user()}>
        {(userAccessor) => {
          const u = userAccessor()
          return (
            <>
              {/* Profile Card */}
              <Card class="mb-6">
                <CardContent class="space-y-4">
                  <div class="flex items-center gap-4">
                    {/* Avatar */}
                    <Avatar class="size-20">
                      <AvatarFallback class="text-2xl">
                        {u.first_name[0]}
                        {u.last_name[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div class="min-w-0 flex-1">
                      <h1 class="text-2xl font-bold tracking-tight">
                        {u.first_name} {u.last_name}
                      </h1>
                      <p class="text-muted-foreground">@{u.username}</p>
                    </div>

                    {/* Follow Button */}
                    <Show when={!isOwnProfile()}>
                      <Button
                        variant={isFollowing() ? 'outline' : 'default'}
                        onClick={toggleFollow}
                        class="shrink-0"
                      >
                        <Show when={isFollowing()} fallback={<UserPlus class="size-4" />}>
                          <UserCheck class="size-4" />
                        </Show>
                        {isFollowing() ? 'Following' : 'Follow'}
                      </Button>
                    </Show>
                  </div>

                  <Separator />

                  {/* Stats */}
                  <div class="flex gap-6 text-sm">
                    <p>
                      <span class="font-semibold">{followers().length}</span>{' '}
                      <span class="text-muted-foreground">Followers</span>
                    </p>
                    <p>
                      <span class="font-semibold">{following().length}</span>{' '}
                      <span class="text-muted-foreground">Following</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Followers / Following Lists */}
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle class="flex items-center gap-2 text-base">
                      <UsersIcon class="size-4" />
                      Followers ({followers().length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FollowList users={followers()} emptyText="No followers yet" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle class="flex items-center gap-2 text-base">
                      <UserCheck class="size-4" />
                      Following ({following().length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FollowList users={following()} emptyText="Not following anyone yet" />
                  </CardContent>
                </Card>
              </div>
            </>
          )
        }}
      </Show>
    </div>
  )
}

export default UserProfilePage
