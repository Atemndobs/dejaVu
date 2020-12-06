import axios from "axios";

const state = {
  items:{}
}

  const actions = {
  async get({
    commit
  }) {
    await axios.get('http://atemkeng.com/api')
      .then((res) => {
        if (res.status === 200) {
          commit('get', res.data.data)
        }
      })
  },

    fetchItem ({ commit }, url) {
      return axios.post("http://atemkeng.com/api"+url, )
        .then(({ data }) => {
        commit('set', data)
      }).catch(error => {
          console.log(error.response.data.errors)
          commit('set', error.response.data.errors)
        })
    }
}

const mutations = {
  set(state, items) {
    state.items = items
  },
}

export default {
  namespaced : true,
  state,
  mutations,
  actions,
}
