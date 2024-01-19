import store from '../vuex/store.js'

export const authMiddleware = async (to, from, next) => {
  const user = store.getters.getUser
  if (to.path === '/my' && !user) {
    next('/login')
  } else {
    next()
  }
}