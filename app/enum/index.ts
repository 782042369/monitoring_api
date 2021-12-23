/*
 * @Author: 杨宏旋
 * @Date: 2021-07-19 18:15:10
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-22 17:16:28
 * @Description:
 */
/**
 * 错误类型枚举
 */

export enum ErrorCategoryEnum {
  /**
   * js 错误
   */
  'JS_ERROR' = 'js_error',
  /**
   * 资源引用错误
   */
  'RESOURCE_ERROR' = 'resource_error',
  /**
   * Vue错误
   */
  'VUE_ERROR' = 'vue_error',
  /**
   * promise 错误
   */
  'PROMISE_ERROR' = 'promise_error',
  /**
   * ajax异步请求错误
   */
  'AJAX_ERROR' = 'ajax_error',
  /**
   * 跨域js错误
   */
  'CROSS_SCRIPT_ERROR' = 'cross_srcipt_error',
  /**
   * 未知异常
   */
  'UNKNOW_ERROR' = 'unknow_error',
  /**
   * 性能上报
   */
  'PERFORMANCE' = 'performance'
}

/**
 * 错误level枚举
 */
export enum ErrorLevelEnum {
  /**
   * 错误信息
   */
  'ERROR' = 'error',
  /**
   * 警告信息
   */
  'WARN' = 'warning',
  /**
   * 日志信息
   */
  'INFO' = 'info',
  /**
   * 用户自定义事件
   */
  'Custom' = 'custom'
}

/**
 * Ajax库枚举
 */
export enum AjaxLibEnum {
  'XHR' = 'xhr',
  'FETCH' = 'fetch'
}
/**
 * Ajax请求方式枚举
 */
export enum AjaxMethodEnum {
  'GET' = 'get',
  'POST' = 'post',
  'DELETE' = 'delete',
  'PUT' = 'put'
}