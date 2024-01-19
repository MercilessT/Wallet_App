import axios from 'axios'

const userModule = {
  state: {
    currentUser: null,
  },

  mutations: {
    setUserData: (state, action) => {
      state.currentUser = action
    },
    delUserData: (state) => {
      state.currentUser = null
    },
  },

  actions: {
    async handleLogin(context, { email, password }) {
      try {
        const res = await axios.post('api/auth/login', { email, password })
        context.commit('setUserData', res.data)
        return { status: 200 }
      } catch (err) {
        console.log('Error during login:', err)
        return { status: err.response.status }
      }
    },

    async handleLogout(context) {
      try {
        context.commit('delUserData')
        const res = await axios.post('api/auth/logout')
        return { status: 200 }
      } catch (err) {
        console.log('Error during logout:', err)
        return { status: err.response.status }
      }
    },

    async updateUserToken(context, { id }) {
      try {
        const res = await axios.put('api/user/update_token', { id })
        context.commit('setUserData', res.data)
        return { status: 200 }
      } catch (err) {
        console.log('Error during login:', err)
        return { status: err.response.status }
      }
    },

    async addTransaction(context, { amount, target }) {
      try {
        const res = await axios.post('api/user/add_transaction', { amount, target })
        context.commit('setUserData', res.data)
      } catch (err) {
        console.log(err)
      }
    },
    async deleteTransaction(context, { transaction_id }) {
      try {
        const res = await axios.delete(`api/user/delete_transaction/${transaction_id}`);
        context.commit('setUserData', res.data);
      } catch (err) {
        console.log(err);
      }
    },
  },
  getters: {
    getUser(state) {
      return state.currentUser
    },
  },
}

export default userModule