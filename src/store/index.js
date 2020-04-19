import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth: {
      token: "",
      username: ""
    },
  },
  mutations: {
    setAuth: (state, payload) => state.auth = { ...state.auth, ... payload }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    isLoggedIn: state => !!state.auth.token,
    token: state => state.auth.token,
    username: state => state.auth.username
  }
})
