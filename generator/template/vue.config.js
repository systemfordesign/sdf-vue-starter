/*
 * @Author: Devin Shi
 * @Email: yutian.shi@definesys.com
 * @Date: 2019-08-11 23:15:16
 * @LastEditTime: 2019-08-20 15:36:08
 * @LastEditors: Devin Shi
 * @Description: 
 */
'use strict';

const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require('chalk');
const VueRouterInvokeWebpackPlugin = require('@liwb/vue-router-invoke-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const resolve = (dir) => {
  return path.join(__dirname, './', dir);
};

const isProd = () => {
  return process.env.NODE_ENV === 'production';
};

function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, 'src/assets/less/variable.less'),
        path.resolve(__dirname, 'node_modules/magicless/magicless.less'),
      ],
      injector: 'prepend',
    });
}

const genPlugins = () => {
  const plugins = [
    new ProgressBarPlugin({
      format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
      clear: false
    }),
    new VueRouterInvokeWebpackPlugin({
      dir: 'src/modules',
      // must set the alias for the dir option which you have set
      alias: '@/modules',
      mode: 'hash',
      routerDir: 'src/router',
      ignore: ['images', 'components', '.js'],
      redirect: [
        {
          redirect: '/hello',
          path: '/'
        }
      ]
    }),
    // // 为静态资源文件添加 hash，防止缓存
    // new AddAssetHtmlPlugin({
    //   filepath: path.resolve(__dirname, './public/config.local.js'),
    //   hash: true
    // }),
  ];

  if (isProd()) {
    plugins.push(
       //生产环境自动删除console
       new UglifyJsPlugin({
        uglifyOptions: {
          comments: false,
          warnings: false,
          drop_debugger: true,
          drop_console: true
        },
        sourceMap: true,
        parallel: true,
      })
    )
    plugins.push(
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
          '\\.(' +
          ['js', 'css', 'html'].join('|') +
          ')$'
        ),
        // deleteOriginalAssets: true,
        threshold: 10240,
        minRatio: 0.8,
        cache: false
      })
    )
  }

  return plugins;
};

module.exports = {
  /**
   * You can set by yourself according to actual condition
   * You will need to set this if you plan to deploy your site under a sub path,
   * for example GitHub pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then assetsPublicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail https://cli.vuejs.org/config/#publicPath
   */
  publicPath: './',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,
  // webpack-dev-server 相关配置
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    disableHostCheck: false,
    https: false,
    hotOnly: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',   //代理接口
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/mock'    //代理的路径
        }
      }
    }
  },
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: isProd() ? true : false,
    // 开启 CSS source maps?
    sourceMap: isProd() ? true : false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
  configureWebpack: () => ({
    name: 'vue-cli3-template',
    resolve: {
      alias: {
        '@': resolve('src'),
        '@assets': resolve('src/assets'),
        '@less': resolve('src/assets/less'),
        '@js': resolve('src/assets/js'),
        '@components': resolve('src/components'),
        '@mixins': resolve('src/mixins'),
        '@filters': resolve('src/filters'),
        '@store': resolve('src/store'),
        '@views': resolve('src/views'),

        // 文件别名
        'services': resolve('src/services'),
        'variable': resolve('src/assets/less/variable.less'),
        'utils': resolve('node_modules/@liwb/cloud-utils/dist/cloud-utils.esm'),
        'mixins': resolve('node_modules/magicless/magicless.less')
      }
    },
    plugins: genPlugins()
  }),
  // webpack配置
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: (config) => {
    // module
    // style-resources-loader
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach((type) =>
      addStyleResource(config.module.rule('less').oneOf(type))
    );

    config
      .when(process.env.NODE_ENV === 'development',
        (config) => config.devtool('cheap-eval-source-map')
      );

    // plugin

    // preload
    // runtime.js 内联的形式嵌入
    config
      .plugin('preload')
      .tap((args) => {
        args[0].fileBlacklist.push(/runtime\./);
        return args;
      });

    // webpack-html-plugin
    config
      .plugin('html')
      .tap((args) => {
        args[0].minify = {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        };
        return args;
      });

    // optimization
    config
      .when(process.env.NODE_ENV === 'production',
        (config) => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }]);
          config
            .optimization
            .splitChunks({
              chunks: 'all',
              cacheGroups: {
                vendors: {
                  name: 'chunk-vendors',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // 只打包初始时依赖的第三方
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // 可自定义拓展你的规则
                  minChunks: 3, // 最小公用次数
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            });
          config.optimization.runtimeChunk('single');
        }
      );
  },
  pluginOptions: {
    lintStyleOnBuild: true,
    stylelint: {}
  }
};
