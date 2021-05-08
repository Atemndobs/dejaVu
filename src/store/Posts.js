
const state = {
  posts: [],
}

const mutations = {

  addPost(state, payload) {
    let posts = state.posts
    posts[payload.id] = payload
  },

  addComment(state, payload) {
    let posts = state.posts
    let comments = posts[payload.id].comments
    comments.unshift(payload.comment)
  },

  addChildren(state, payload) {
    let posts = state.posts
    posts[payload.post_id].comments[payload.comment_id].children = payload.children

  },

  addReply(state, payload) {
    let posts = state.posts
    posts[payload.post_id].comments[payload.comment_id].children.unshift(payload.reply)

  },
}

const actions =  {
  addPost({commit}, post) {
    commit('addPost', post)
  },

  addComment({commit}, comment) {
    commit('addComment', comment)
  },

  addReply({commit}, comment) {
    commit('addReply', comment)
  },

  addChildren({commit}, data) {
    commit('addChildren', data)
  },
}

const getters = {
  getPosts (state) {
    return state.posts
  }

}

export default {
  namespaced : true,
  state,
  mutations,
  actions,
  getters
}
