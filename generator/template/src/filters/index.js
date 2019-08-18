/*
 * @Author: Devin Shi
 * @Email: yutian.shi@definesys.com
 * @Date: 2019-08-11 23:15:16
 * @LastEditTime: 2019-08-15 11:50:40
 * @LastEditors: Devin Shi
 * @Description: 
 */
import Vue from 'vue';
import {formatDate} from 'utils';

/**
 * [formateTime description]
 * @param  {[type]} timeStamp [description]
 * @param  {[type]} fmt       [description]
 * @return {[type]}           [description]
 */
export function formatTime(timeStamp, fmt) {
  return formatDate(timeStamp, fmt);
}

// register global utility filters.
const filters = {
  formatDate
};

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});
