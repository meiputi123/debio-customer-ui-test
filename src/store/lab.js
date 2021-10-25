import axios from "axios"

const defaultState = {
  labs: [],
  country: null,
  city: null,
  category: null
}

export default {
  namespaced: true,

  state: {
    ...defaultState
  },

  mutations: {
    SET_COUNTRY(state, country) {
      state.country = country
    },

    SET_CITY(state, city) {
      state.city = city
    },

    SET_CATEGORY(state, category) {
      state.category = category
    },

    SET_LABS(state, labs) {
      state.labs = labs
    }
  },
  actions: {
    async setCountryCity ({commit}, data) {
      commit("SET_COUNTRY", data.country)
      commit("SET_CITY", data.city)
    },

    async getLabByCategory({ commit, state }, category) {
      const baseUrl = process.env.VUE_APP_DEV_DEBIO_BACKEND_URL
      const labs = await axios.get(`${baseUrl}/labs/${state.country}/${state.city}/${category}`)
      commit("SET_LABS", labs.data.body.hits.hits)
      commit("SET_CATEGORY", category)
    }
  },

  getters: {
    getLabByCategory(state) {
      state.labs
    }
  }
}
