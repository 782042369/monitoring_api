/*
 * @Author: 杨宏旋
 * @Date: 2021-07-22 12:13:03
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-07-22 12:15:50
 * @Description:
 */
/*
 * @Author: 杨宏旋
 * @Date: 2021-07-19 18:15:10
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-07-22 10:38:43
 * @Description:
 */
/**
 * 错误类型枚举
 */

export enum ErrorCategoryEnum {
  /**
   * js 错误
   */
  'js_error' = 'js_error',
  /**
   * 资源引用错误
   */
  'resource_error' = 'resource_error',
  /**
   * Vue错误
   */
  'vue_error' = 'vue_error',
  /**
   * promise 错误
   */
  'promise_error' = 'promise_error',
  /**
   * ajax异步请求错误
   */
  'ajax_error' = 'ajax_error',
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
  'performance' = 'performance',
}
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
  'PERFORMANCE' = 'performance',

  'CONSOLE_INFO' = 'console_info',
  'CONSOLE_WARN' = 'console_warn',
  'CONSOLE_ERROR' = 'console_error',
}

/**
 * 错误level枚举
 */
export enum ErrorLevelEnum {
  /**
   * 错误信息
   */
  'error' = 'error',
  /**
   * 警告信息
   */
  'warning' = 'warning',
  /**
   * 日志信息
   */
  'info' = 'info',
  /**
   * 用户自定义事件
   */
  'custom' = 'custom',
}

/**
 * Ajax库枚举
 */
export enum AjaxLibEnum {
  'xhr' = 'xhr',
  'fetch' = 'fetch',
}
/**
 * Ajax请求方式枚举
 */
export enum AjaxMethodEnum {
  'get' = 'get',
  'post' = 'post',
  'delete' = 'delete',
  'put' = 'put',
}
