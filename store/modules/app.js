const state = {
  statusBarHeight: plus.navigator.getStatusbarHeight()
}
const actions = {}
const mutations = {}
const getters = {
  getStatusBarHeight(state) {
    return state.statusBarHeight
  }
}
export default {
  state,
  actions,
  mutations,
  getters
}
