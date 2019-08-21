<!--
 * @Author: Devin Shi
 * @Email: yutian.shi@definesys.com
 * @Date: 2019-08-20 15:21:23
 * @LastEditTime: 2019-08-20 15:33:31
 * @LastEditors: Devin Shi
 * @Description: 
 -->
## vue-cli-starter
> 此脚手架是快速开发Vue应用的脚手架工具，基于Vue-Cli 3.0

### 特性

- CSS 预编译语言：[less](http://lesscss.org/)

- Ajax: [axios](https://github.com/axios/axios)，做了一定的封装，详见 `src/services/request.js`

- 常用的 js 工具类： [cloud-utils](https://cloud-templates.github.io/cloud-utils/)

- 常用的 Less 的 mixins 集合：[magicless](https://github.com/cklwblove/magicless)

- Vuex 持久化存储: [vuex-persistedstate](https://github.com/robinvdvleuten/vuex-persistedstate)

- 全局EventBus

- 全局ErrorHandler

- 内置lodash: [lodash](https://www.lodashjs.com/)

- 内置Storage

- 自动路由生成: [vue-router-invoke-webpack-plugin](https://github.com/Qymh/vue-router-invoke-webpack-plugin)

### 目录介绍

```  javascript
.
├── build            # 生成压缩包
├── public           # 静态资源，不需要 webpack 处理
└── src
    ├── assets
    │   ├── fonts    # 字体文件
    │   ├── img      # 图片
    │   ├── js       # 不经过 npm 或 yarn 下载的第三方依赖包
    │   └── less     # reset 样式，及定义的常量文件等
    ├── components   # 组件
    ├── filters      # 全局过滤器 - 不建议使用
    ├── icons        # 动态 svg 文件 - 不建议使用
    ├── router       # 路由及拦截器 - 自动生成不建议修改
    ├── services     # 统一的服务接口请求处理
    ├── store        # vuex文件
    └── modules      # 模块数据
        └── hello
```

### 开发及发布

```  javascript
# 安装依赖
npm install

# 可以通过如下操作解决 yarn 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run serve

# 构建生产环境
npm run build

# 压缩 dist 文件夹，生成 zip 包
npm run deploy
```

### 其他

``` javascript
# --analyz 基于 webpack-bundle-analyzer 插件分析打包的文件构成及大小(vue ui 界面上的分析不习惯)
npm run analyz

# --report 生成静态报告文件
npm run report
```

## 相关链接

- [vue-cli3官方文档](https://cli.vuejs.org/zh/)
- [vue-cli 3.0 配置](https://blog.csdn.net/qq_35844177/article/details/81099492)
- [chainWebpack](https://github.com/neutrinojs/webpack-chain#getting-started)
- [[Vue CLI 3] 配置 webpack-bundle-analyzer 插件](https://segmentfault.com/a/1190000016247872)