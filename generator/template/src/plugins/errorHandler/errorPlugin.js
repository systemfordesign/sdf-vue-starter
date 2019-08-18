/*
 * @Author: Devin Shi
 * @Email: yutian.shi@definesys.com
 * @Date: 2019-08-11 23:15:16
 * @LastEditTime: 2019-08-15 17:59:32
 * @LastEditors: Devin Shi
 * @Description: 
 * 优雅的处理vue项目异常
 * 增加全局异常处理有助于
   提高代码健壮性
   减少崩溃
   快速定位bug
s */
/**
 * 全局异常处理
 * @param error
 * @param vm
 * @param info
 */
const errorHandler = (error, vm, info) => {
  console.error('抛出全局异常');
  console.error(vm);
  console.error(error);
  console.error(info);
};

const GlobalError = {
  install: (Vue, _options) => {
    Vue.config.errorHandler = errorHandler;
    Vue.mixin({
      beforeCreate() {
        const methods = this.$options.methods || {};
        Object.keys(methods).forEach(key => {
          let fn = methods[key];
          this.$options.methods[key] = function (...args) {
            let ret = fn.apply(this, args);
            if (ret && typeof ret.then === 'function' && typeof ret.catch === 'function') {
              return ret.catch(errorHandler);
            } else { // 默认错误处理
              return ret;
            }
          };
        });
      },
    });
    Vue.prototype.$throw = errorHandler;
  },
};

export default GlobalError