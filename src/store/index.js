import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'

Vue.use(Vuex)

const state = {
    userInfo: {
        id: 1
    }
}

const store = new Vuex.Store({
    state,
    mutations,
})

export default store;