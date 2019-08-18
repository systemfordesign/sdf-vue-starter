/*
 * @Author: Devin Shi
 * @Email: yutian.shi@definesys.com
 * @Date: 2019-08-11 23:15:16
 * @LastEditTime: 2019-08-15 11:46:18
 * @LastEditors: Devin Shi
 * @Description: 
 */
module.exports = [
  {
    name: 'ui-framework',
    type: 'list',
    message: 'choice UI Framework(default:ant-design-vue)',
    choices: [{
      name: 'ant-design-vue',
      value: 'ant'
    },
    {
      name: 'none',
      value: 'none'
    }],
    default: 'ant-design-vue'
  }
];