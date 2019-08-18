/*
 * @Author: Devin Shi
 * @Email: yutian.shi@definesys.com
 * @Date: 2019-07-18 19:16:44
 * @LastEditTime: 2019-08-15 18:00:03
 * @LastEditors: Devin Shi
 * @Description:
 */
import Vue from 'vue'
import axios from 'axios'
import fileDownload from 'js-file-download'
import NETWORK_CONSTANT from './network.constant'

export default {
  install (vue, opts) {
    const requestInterceptorMap = new Map()
    const responseInterceptorMap = new Map()

    // eslint-disable-next-line no-extend-native
    Promise.prototype.aysncErrorCatch = function (catchFunction) {
      this.$currentErrorCatchFunction = catchFunction
      return this
    }

    // eslint-disable-next-line no-extend-native
    Promise.prototype.aysncThen = function (onResolve, onReject) {
      this.then(onResolve, onReject)
      return this
    }
    const options = {
      baseURL: opts.baseURL || '',
      timeout: opts.timeout || 50000,
      method: opts.method || 'get',
      headers: opts.headers || {},
      withCredentials: opts.withCredentials || false,
      responseType: opts.responseType || 'json',
      validateStatus: opts.validateStatus || function (status) {
        return status >= 200 && status < 300 // 默认的
      },
      dataMock: opts.dataMock || {
        enabled: false,
        mockUrl: '',
        realUrl: ''
      },
      maxRedirects: opts.maxRedirects || 5,
      onUploadProgress: opts.onUploadProgress,
      onDownloadProgress: opts.onDownloadProgress
    }

    const customOptions = {
      businessValid: opts.businessValid || function (response) {
        return response.code === '200' || response.code === 'ok'
      },
      businessTransform: opts.businessTransform || function (data, response) {
        data.headers = response.headers
        data.data = data.data || data.table
      },
      errorCatch: opts.errorCatch || function (err, needShowMessage) {
        if (!needShowMessage) {
          return
        }
        if (err.response) {
          if (err.response.status === NETWORK_CONSTANT.httpErrorCode.NotFound) {
            Vue.prototype.$message.error('404: 网络地址失踪了, 请联系管理员')
          } else if (err.response.status === NETWORK_CONSTANT.httpErrorCode.NoAuth) {
            Vue.prototype.$message.error('401: 您没有权限访问该数据')
          } else if (err.response.status >= NETWORK_CONSTANT.httpErrorCode.BadRequestMin && err.response.status <= NETWORK_CONSTANT.httpErrorCode.BadRequestMax) {
            Vue.prototype.$message.error('400 ~ 499: 当前无法发起正确的网络请求, 请联系管理员')
          } else if (err.response.status >= NETWORK_CONSTANT.httpErrorCode.ServerExceptionMin && err.response.status <= NETWORK_CONSTANT.httpErrorCode.ServerExceptionMax) {
            Vue.prototype.$message.error('500 ~ 599: 服务器出现异常，请耐心等待后重试或联系管理员')
          } else {
            Vue.prototype.$message.error('600 ~ : 出现了未知错误,  请联系管理员')
          }
        } else {
          Vue.prototype.$message.error('timeout : 网络连接超时了， 请检查您的网络设置')
        }
      },
      businessErrorCatch: opts.businessErrorCatch || function (failRes, response, needShowMessage) {
        if (needShowMessage) {
          Vue.prototype.$message.info(failRes.message)
        }
      }
    }

    // 设置通用配置
    let instance = axios.create({
      baseURL: options.baseURL,
      timeout: options.timeout,
      method: options.method,
      headers: options.headers,
      withCredentials: options.withCredentials,
      responseType: options.responseType,
      validateStatus: options.validateStatus,
      maxRedirects: options.maxRedirects
    })

    Vue.setGlobalConfig = function (networkConfig) {
      const globalOptions = {
        ...options,
        ...networkConfig
      }
      instance.defaults = {
        ...instance.defaults,
        ...globalOptions
      }
      Vue.axios = instance
      Vue.prototype.$axios = instance
    }

    Vue.addHeaders = function (headers) {
      options.headers = {
        ...options.headers,
        ...headers
      }
      instance.defaults = {
        ...instance.defaults,
        ...options
      }
      Vue.axios = instance
      Vue.prototype.$axios = instance
    }

    Vue.addInterceptorsRequest = function (interceptorKey, callback) {
      Vue.removeInterceptorsRequest(interceptorKey)
      const requestInterceptor = instance.interceptors.request.use(callback)
      requestInterceptorMap.set(interceptorKey, requestInterceptor)
    }

    Vue.removeInterceptorsRequest = function (interceptorKey) {
      if (requestInterceptorMap.get(interceptorKey)) {
        instance.interceptors.request.eject(requestInterceptorMap.get(interceptorKey))
      }
    }

    Vue.addInterceptorsResponse = function (interceptorKey, callback) {
      Vue.removeInterceptorsRequest(interceptorKey)
      const responseInterceptor = instance.interceptors.response.use(callback)
      responseInterceptorMap.set(interceptorKey, responseInterceptor)
    }

    Vue.removeInterceptorsResponse = function (interceptorKey) {
      if (responseInterceptorMap.get(interceptorKey)) {
        instance.interceptors.request.eject(responseInterceptorMap.get(interceptorKey))
      }
    }

    Vue.post = function (urlConfig, needShowMessage) {
      const config = {
        url: urlConfig.url,
        data: urlConfig.params,
        config: {
          ...urlConfig.config,
          method: 'post'
        }
      }
      return Vue.request(config, needShowMessage)
    }

    Vue.get = function (urlConfig, needShowMessage) {
      const config = {
        url: urlConfig.url,
        params: urlConfig.params,
        config: {
          ...urlConfig.config,
          method: 'get'
        }
      }
      Vue.request(config, needShowMessage)
    }

    Vue.request = function (urlConfig, needShowMessage = true) {
      urlConfig = Vue._lodash.cloneDeep(urlConfig)
      if (options.dataMock.enabled && urlConfig.mockUrl.indexOf(options.dataMock.mockUrl) !== -1) {
        urlConfig.method = 'get'
      }
      if (options.dataMock.enabled && urlConfig.mockUrl.indexOf(options.dataMock.mockUrl) !== -1) {
        urlConfig.url = Vue._lodash.replace(urlConfig.url, options.dataMock.mockUrl, options.dataMock.realUrl)
      }

      if (urlConfig.url.indexOf('?') !== -1) {
        urlConfig.url = urlConfig.url + '&' + '__timestamp=' + (new Date()).valueOf()
      } else {
        urlConfig.url = urlConfig.url + '?' + '__timestamp=' + (new Date()).valueOf()
      }

      const config = {
        url: urlConfig.url,
        method: urlConfig.method,
        data: urlConfig.params,
        headers: {
          ...options.headers,
          ...urlConfig.headers
        },
        config: {
          ...options,
          ...urlConfig.config
        }
      }
      // eslint-disable-next-line no-extend-native
      let promise
      promise = new Promise(function (resolve, reject) {
        instance.request(config)
          .then(response => {
            const data = response.data
            // 自定义解析字段，并带上相关请求头
            if (customOptions.businessValid(data)) {
              customOptions.businessTransform(data, response)
              resolve(data)
            } else {
              customOptions.businessErrorCatch(data, response, needShowMessage)
              reject(data)
            }
          })
          .catch(err => {
            customOptions.errorCatch(err, needShowMessage)
            if (promise && promise.$currentErrorCatchFunction) {
              promise.$currentErrorCatchFunction(err)
            }
          })
      })
      // eslint-disable-next-line no-new
      return promise
    }

    /**
     * 默认使用post方式下载文件，若需要修改则需要在传入参数的config中，添加相关配置 { method: 'post'}
     */
    Vue.download = function (urlConfig, onDownloadProgress, needShowMessage = true) {
      const config = {
        url: urlConfig.url,
        params: urlConfig.params,
        config: {
          method: 'get',
          ...urlConfig,
          responseType: 'blob',
          onDownloadProgress: onDownloadProgress || urlConfig.onDownloadProgress
        }
      }

      // eslint-disable-next-line no-new
      let promise
      promise = new Promise((resolve, _reject) => {
        instance.request(config)
          .then(response => {
            const disposition = response.headers['content-disposition']
            const filename = decodeURI(disposition.match(/filename="(.*)"/)[1])
            fileDownload(response.data, filename)
            // 将文件配置放入数据
            resolve(disposition)
          })
          .catch(err => {
            customOptions.errorCatch(err, needShowMessage)
            if (promise && promise.$currentErrorCatchFunction) {
              promise.$currentErrorCatchFunction(err)
            }
          })
      })
      return promise
    }

    /**
     * @param urlConfig.params 参数必须是FormData
     */
    Vue.upload = function (urlConfig, onUploadProgress, needShowMessage = true) {
      const config = {
        url: urlConfig.url,
        params: urlConfig.params,
        config: {
          method: 'post',
          ...urlConfig,
          onUploadProgress: onUploadProgress || urlConfig.onUploadProgress,
          headers: {
            ...options.headers,
            ...urlConfig.headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      }
      // eslint-disable-next-line no-new
      let promise
      promise = Promise((resolve, reject) => {
        instance.request(config)
          .then(response => {
            const data = response.data
            // 自定义解析字段，并带上相关请求头
            if (customOptions.businessValid(data)) {
              customOptions.businessTransform(data, response)
              resolve(data)
            } else {
              customOptions.businessErrorCatch(data, response, needShowMessage)
              reject(data)
            }
          })
          .catch(err => {
            customOptions.errorCatch(err, needShowMessage)
            if (promise && promise.$currentErrorCatchFunction) {
              promise.$currentErrorCatchFunction(err)
            }
          })
      })
      return promise
    }

    Vue.prototype.$post = Vue.post
    Vue.prototype.$get = Vue.get
    Vue.prototype.$request = Vue.request
    Vue.prototype.$download = Vue.download
    Vue.prototype.$upload = Vue.upload

    Vue.axios = instance
    Vue.prototype.$axios = instance
  }
}
