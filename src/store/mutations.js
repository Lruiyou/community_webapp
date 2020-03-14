export default {
    updateUser(state, payload) {
        state.userInfo = payload.userInfo
    },
    removeUser(state, payload) {
        console.log(payload, 'payload');
        state.userInfo = payload.userInfo
        console.log(state.userInfo, 'state')
    }
}