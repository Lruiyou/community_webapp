export default {
    getUserInfo() {
        return JSON.parse(localStorage.getItem('user'));
    },
    saveUserInfo(payload) {
        localStorage.setItem('user', JSON.stringify(payload));
    },
    removeUserInfo() {
        localStorage.removeItem('user');
    }
}