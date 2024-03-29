/*
 * @Author: Devin Shi
 * @Email: yutian.shi@definesys.com
 * @Date: 2019-08-15 18:08:02
 * @LastEditTime: 2019-08-15 18:15:13
 * @LastEditors: Devin Shi
 * @Description: 
 */
module.exports = {
  root: true,
  // JavaScript 语言选项
  parserOptions: {
    parser: 'babel-eslint'
  },
  //环境定义了预定义的全局变量。更多在官网查看
  env: {
    node: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    'eslint:recommended'
  ],

  /** add your custom rules here
   *  'off' 或 0 - 关闭规则
   *  'warn' 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出),
   *  'error' 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
   */
  rules: {
    ////////////////
    // 可能的错误  //
    ////////////////
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 禁用 console
    'no-console': 'off',
    // 禁用 alert、confirm 和 prompt
    'no-alert': 'error',

    //////////////
    // 风格指南  //
    //////////////
    // 要求或禁止使用分号而不是 ASI（这个才是控制行尾部分号的，）
    'semi': ['off', 'always'],
    // 强制在 function的左括号之前使用一致的空格
    'space-before-function-paren': ['off', 'always'],

    //////////////
    // 最佳实践 //
    //////////////


    //////////////
    // ES6.相关 //
    //////////////
    // 要求箭头函数的参数使用圆括号
    'arrow-parens': 'error',
    // allow async-await
    'generator-star-spacing': 'off',
    'no-unused-vars': 'warn'
  }
}
