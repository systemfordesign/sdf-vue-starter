/* eslint-disable */
import lodash from 'lodash'

const genericInstall = (Vue) => {
  Vue._ = lodash
  Object.defineProperties(Vue.prototype, {
    _: { get() { return lodash } }
  })
}

const LodashPlugin = {
  install (Vue, options) {
    if (options && options.name) {
      Vue['_' + options.name] = lodash
      Object.defineProperties(Vue.prototype, {
        [options.name]: { get() { return lodash } }
      })
    }
    genericInstall(Vue)
  }
}

export default LodashPlugin
