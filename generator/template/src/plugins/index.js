/*
 * @Author: Devin Shi
 * @Email: yutian.shi@definesys.com
 * @Date: 2019-08-15 17:50:28
 * @LastEditTime: 2019-08-20 15:43:10
 * @LastEditors: Devin Shi
 * @Description: 
 */

import Vue from 'vue'
import GlobalError from './errorHandler/errorPlugin'
import EventBusPlugin from './eventbus/eventbus.plugin'
import NetworkPlugin from './network/network.plugin'
import LodashPlugin from './lodash/lodash.plugin'
import StoragePlugin from './storage/storage.plugin'

/**
 * 此处顺序不要改变
 */
Vue.use(GlobalError)
Vue.use(LodashPlugin, { name: 'lodash' })
Vue.use(EventBusPlugin)
Vue.use(StoragePlugin, {
  localStorage: true,
  sessionStorage: true,
  cookie: true
})

Vue.use(NetworkPlugin, {
  baseURL: process.env.VUE_APP_BASEURL,
  businessErrorCatch: function (failRes, response, needShowMessage) {
    if (failRes.code !== '-50001' && failRes.code !== '-50002' && needShowMessage) {
      Vue.prototype.$message.info(failRes.message)
    } else if (failRes.code === '-50001' || failRes.code === '-50002') {
      Vue._accountPlugin.clearCurrentAccount(response)
    }
  }
})