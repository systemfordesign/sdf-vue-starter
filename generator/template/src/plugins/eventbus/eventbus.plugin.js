function EventBusPlugin (Vue) {
  const bus = new Vue()

  bus.prototype = {
    ...bus.prototype,
    $allListenEventMap: new Map(),
    $on: function (event, callback) {
      this.$allListenEventMap.set(event, callback)
      this.$on(event, callback)
    },
    $once: function (event, callback) {
      var onceEventName = event + '-once'
      this.$allListenEventMap.set(onceEventName, callback)
      this.$once(event, callback)
    },
    $off: function (event, callback) {
      var onceEventName = event + '-once'
      if (this.$allListenEventMap.has(onceEventName)) {
        this.$allListenEventMap.delete(onceEventName, callback)
      }
      if (this.$allListenEventMap.has(event)) {
        this.$allListenEventMap.delete(event, callback)
      }
      this.$off(event, callback)
    },
    $emit: function (event, callback) {
      var onceEventName = event + '-once'
      if (this.$allListenEventMap.has(onceEventName)) {
        this.$allListenEventMap.delete(onceEventName, callback)
      }
      this.$emit(event, callback)
    }
  }

  Object.defineProperty(Vue, '_bus', {
    get () {
      return bus
    }
  })

  Object.defineProperty(Vue.prototype, '$bus', {
    get () {
      return bus
    }
  })
}

export default EventBusPlugin
