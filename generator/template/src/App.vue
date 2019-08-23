<!--
 * @Author: Devin Shi
 * @Email: yutian.shi@definesys.com
 * @Date: 2019-08-11 23:15:16
 * @LastEditTime: 2019-08-23 15:10:25
 * @LastEditors: Devin Shi
 * @Description: 
 -->
<template>
  <div id="app">
    <div class="pages">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<style lang="less" rel="stylesheet/less">
  @import "~@/assets/less/app.less";

  body {
    height: 100vh;
  }

  #app {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.2s ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
</style>
