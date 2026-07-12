import { createSignal, For, Show, createEffect, on } from 'solid-js'
import { A, useParams } from '@solidjs/router'
import Icon from '@/components/Icon'
import api from '@/apis'
import { useAuth, type User } from '@/stores/auth'

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
    <div class="tw:max-w-3xl tw:mx-auto tw:px-4 tw:py-8">
      <Show when={loading()}>
        <div class="tw:flex tw:justify-center tw:py-20">
          <span class="tw:loading tw:loading-spinner tw:loading-lg tw:text-primary" />
        </div>
      </Show>

      <Show when={!loading() && user()}>
        {(userAccessor) => {
          const u = userAccessor()
          return (
            <>
              {/* Profile Card */}
              <div class="tw:card tw:bg-base-100 tw:shadow-lg tw:mb-6">
                {/* Cover */}
                <div class="tw:bg-linear-to-r tw:from-primary tw:to-secondary tw:h-32 tw:rounded-t-2xl" />

                <div class="tw:card-body tw:pt-0">
                  <div class="tw:flex tw:flex-col sm:tw:flex-row tw:items-center sm:tw:items-end tw:gap-4 tw:-mt-12">
                    {/* Avatar */}
                    <div class="tw:avatar tw:placeholder">
                      <div class="tw:bg-neutral tw:text-neutral-content tw:w-24 tw:h-24 tw:rounded-full tw:ring-4 tw:ring-base-100">
                        <span class="tw:text-3xl">
                          {u.first_name[0]}
                          {u.last_name[0]}
                        </span>
                      </div>
                    </div>

                    <div class="tw:flex-1 tw:text-center sm:tw:text-left">
                      <h1 class="tw:text-2xl tw:font-bold">
                        {u.first_name} {u.last_name}
                      </h1>
                      <p class="tw:text-base-content/60">@{u.username}</p>
                    </div>

                    {/* Follow Button */}
                    <Show when={!isOwnProfile()}>
                      <button
                        onClick={toggleFollow}
                        class="tw:btn"
                        classList={{
                          'tw:btn-outline': isFollowing(),
                          'tw:btn-primary': !isFollowing(),
                        }}
                      >
                        <Icon
                          icon={isFollowing() ? 'mdi:account-check' : 'mdi:account-plus'}
                          class="tw:w-5 tw:h-5"
                        />
                        {isFollowing() ? 'Following' : 'Follow'}
                      </button>
                    </Show>
                  </div>

                  {/* Stats */}
                  <div class="tw:flex tw:justify-center sm:tw:justify-start tw:gap-8 tw:mt-6">
                    <div class="tw:text-center">
                      <span class="tw:text-xl tw:font-bold">{followers().length}</span>
                      <p class="tw:text-sm tw:text-base-content/60">Followers</p>
                    </div>
                    <div class="tw:text-center">
                      <span class="tw:text-xl tw:font-bold">{following().length}</span>
                      <p class="tw:text-sm tw:text-base-content/60">Following</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Followers */}
              <Show when={followers().length > 0}>
                <div class="tw:card tw:bg-base-100 tw:shadow-lg tw:mb-6">
                  <div class="tw:card-body">
                    <h2 class="tw:text-lg tw:font-bold tw:mb-3">Followers</h2>
                    <div class="tw:flex tw:flex-wrap tw:gap-3">
                      <For each={followers()}>
                        {(f) => (
                          <A
                            href={`/users/${f.id}`}
                            class="tw:flex tw:items-center tw:gap-2 tw:bg-base-200 tw:rounded-full tw:px-3 tw:py-1 hover:tw:bg-base-300 tw:transition-colors"
                          >
                            <div class="tw:avatar tw:placeholder">
                              <div class="tw:bg-primary tw:text-primary-content tw:w-6 tw:h-6 tw:rounded-full">
                                <span class="tw:text-xs">{f.first_name[0]}</span>
                              </div>
                            </div>
                            <span class="tw:text-sm">{f.username}</span>
                          </A>
                        )}
                      </For>
                    </div>
                  </div>
                </div>
              </Show>

              {/* Following */}
              <Show when={following().length > 0}>
                <div class="tw:card tw:bg-base-100 tw:shadow-lg">
                  <div class="tw:card-body">
                    <h2 class="tw:text-lg tw:font-bold tw:mb-3">Following</h2>
                    <div class="tw:flex tw:flex-wrap tw:gap-3">
                      <For each={following()}>
                        {(f) => (
                          <A
                            href={`/users/${f.id}`}
                            class="tw:flex tw:items-center tw:gap-2 tw:bg-base-200 tw:rounded-full tw:px-3 tw:py-1 hover:tw:bg-base-300 tw:transition-colors"
                          >
                            <div class="tw:avatar tw:placeholder">
                              <div class="tw:bg-secondary tw:text-secondary-content tw:w-6 tw:h-6 tw:rounded-full">
                                <span class="tw:text-xs">{f.first_name[0]}</span>
                              </div>
                            </div>
                            <span class="tw:text-sm">{f.username}</span>
                          </A>
                        )}
                      </For>
                    </div>
                  </div>
                </div>
              </Show>
            </>
          )
        }}
      </Show>
    </div>
  )
}

export default UserProfilePage
