import { createSignal, onMount, For, Show } from 'solid-js'
import { A } from '@solidjs/router'
import Icon from '@/components/Icon'
import api from '@/apis'
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
    <div class="tw:max-w-4xl tw:mx-auto tw:px-4 tw:py-8">
      <div class="tw:mb-8">
        <h1 class="tw:text-3xl tw:font-bold tw:text-base-content">Users</h1>
        <p class="tw:text-base-content/60">Discover and follow other users</p>
      </div>

      <Show when={loading()}>
        <div class="tw:flex tw:justify-center tw:py-20">
          <span class="tw:loading tw:loading-spinner tw:loading-lg tw:text-primary" />
        </div>
      </Show>

      <Show when={!loading() && users().length === 0}>
        <div class="tw:text-center tw:py-20">
          <Icon
            icon="mdi:account-group-outline"
            class="tw:w-16 tw:h-16 tw:mx-auto tw:text-base-content/30"
          />
          <h3 class="tw:text-xl tw:font-semibold tw:mt-4">No other users yet</h3>
        </div>
      </Show>

      <Show when={!loading() && users().length > 0}>
        <div class="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-4">
          <For each={users()}>
            {(user) => (
              <div class="tw:card tw:bg-base-100 tw:shadow-sm hover:tw:shadow-md tw:transition-shadow">
                <div class="tw:card-body tw:p-4 tw:flex tw:flex-row tw:items-center tw:gap-4">
                  {/* Avatar */}
                  <div class="tw:avatar tw:placeholder">
                    <div class="tw:bg-primary tw:text-primary-content tw:w-12 tw:h-12 tw:rounded-full">
                      <span class="tw:text-lg">
                        {user.first_name[0]}
                        {user.last_name[0]}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div class="tw:flex-1">
                    <A
                      href={`/users/${user.id}`}
                      class="tw:font-semibold hover:tw:text-primary tw:transition-colors"
                    >
                      {user.first_name} {user.last_name}
                    </A>
                    <p class="tw:text-sm tw:text-base-content/50">@{user.username}</p>
                  </div>

                  {/* Follow Button */}
                  <button
                    onClick={() => toggleFollow(user.id)}
                    class="tw:btn tw:btn-sm"
                    classList={{
                      'tw:btn-outline': followingMap()[user.id],
                      'tw:btn-primary': !followingMap()[user.id],
                    }}
                  >
                    <Icon
                      icon={followingMap()[user.id] ? 'mdi:account-check' : 'mdi:account-plus'}
                      class="tw:w-4 tw:h-4"
                    />
                    {followingMap()[user.id] ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

export default UsersPage
