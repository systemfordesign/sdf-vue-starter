/*
 * @Author: Devin Shi
 * @Email: yutian.shi@definesys.com
 * @Date: 2019-08-15 18:36:29
 * @LastEditTime: 2019-08-15 18:36:48
 * @LastEditors: Devin Shi
 * @Description: 
 */
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

// 判断环境 vuex提示生产环境中不使用
const debug = process.env.NODE_ENV !== 'production'

const createPersisted = createPersistedState({
  storage: window.sessionStorage
})

export default new Vuex.Store({
  strict: debug,
  plugins: debug ? [createLogger(), createPersisted] : [createPersisted],
  modules: {
  },
  state: {

  },
  mutations: {

  },
  actions: {

  }
})
