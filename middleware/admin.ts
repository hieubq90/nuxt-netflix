export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const user = useSupabaseUser()
  const client = useSupabaseClient()
  if (user.value) {
    const { data, error } = await client.from('profiles').select().eq('id', user?.value.id)
    if (error || !data || data.length === 0 || !data[0]?.is_admin)
      return navigateTo('/')
  }
  else {
    return navigateTo('/')
  }
})
