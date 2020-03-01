export default {
    updateUser(state, payload) {
        state.userInfo = payload.userInfo
    },
    removeUser(state) {
        state.userInfo = null
    }
}