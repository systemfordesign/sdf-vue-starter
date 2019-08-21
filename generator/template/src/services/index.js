/*
 * @Author: Devin Shi
 * @Email: yutian.shi@definesys.com
 * @Date: 2019-08-11 23:15:16
 * @LastEditTime: 2019-08-20 14:00:42
 * @LastEditors: Devin Shi
 * @Description: 
 */
import Vue from 'vue';
import urls from './requestUrl';

let NetworkApis = {};

Object.keys(urls).forEach((key) => {
  NetworkApis['request' + key] = (options = {}) => {
    const config = {
      ...urls[key],
      options
    }
    return Vue.request(config);
  }
});

// // 将services挂载到vue的原型上
// // views引用的方法：this.$services.接口名（小驼峰）
// Object.defineProperty(Vue.prototype, '$services', {value: FUNS});

export default NetworkApis;
