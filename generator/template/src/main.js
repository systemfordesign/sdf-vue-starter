/*
 * @Author: Devin Shi
 * @Email: yutian.shi@definesys.com
 * @Date: 2019-08-11 23:15:16
 * @LastEditTime: 2019-08-23 15:35:34
 * @LastEditors: Devin Shi
 * @Description: 
 */
import Vue from 'vue';
import App from './App.vue';
import router from './router/.invoke/router.js';
import './components/global';
import './plugins'
import './icons';
import './filters';
import './services';
import './vendor/ant';
import store from './store'
import './registerServiceWorker'

/* eslint-disable */
Vue.config.productionTip = process.env.NODE_ENV === 'production';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  // use Runtime-only
  // https://vuejs.org/v2/guide/installation.html
  render: (h) => h(App)
});
