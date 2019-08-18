/*
 * @Author: Devin Shi
 * @Email: yutian.shi@definesys.com
 * @Date: 2019-08-11 23:15:16
 * @LastEditTime: 2019-08-15 18:29:08
 * @LastEditors: Devin Shi
 * @Description: 
 */
module.exports = (api, options, rootOptions) => {
  api.extendPackage({
    dependencies: {
      'ant-design-vue': '^1.3.8'
    }
  });
  api.render('../ui/ant-design-vue');
  api.injectImports('src/vendor/index.js', `import './ant.js'`);
  api.onCreateComplete(() => {
  });
};
