/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/*
 * @Author: 杨宏旋
 * @Date: 2020-07-20 17:55:43
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-07-15 10:27:28
 * @Description:
 */

import { Controller, Context } from 'egg'
import validateRule from '../../validate/rule'
import { validateRuleType } from '../../types/index'
import * as crypto from 'crypto'

// const MapData = new Map()

export default class BaseController extends Controller {
  validateRule: validateRuleType
  constructor(ctx: Context) {
    super(ctx)
    this.validateRule = validateRule
  }
  /**
   *
   * @param {*} code 接口状态码自定义
   * @param {*} message 提示信息
   * @param {*} data 数据
   */
  public async success(code: number, message: string, data?: any) {
    const { ctx } = this
    ctx.body = {
      code,
      data,
      message,
    }
  }
  /**
   *
   * @param {*} code 接口状态码自定义
   * @param {*} message 提示信息
   * @param {*} data 数据
   */
  public async error(code: number, message: string, data?: any) {
    const { ctx } = this
    ctx.logger.warn('——————————————error——————————————')
    ctx.logger.warn('error', data, message)
    ctx.logger.warn('WARNNING!!!!', ctx.request.body)
    ctx.logger.warn('——————————————error——————————————')
    ctx.status = 500
    ctx.body = {
      data,
      code,
      message: message.includes(
        'Cast to ObjectId failed for value "1" at path "_id" for model'
      )
        ? '请输入正确的ID'
        : message,
    }
  }
  /**
   * md5
   * @param content string | Buffer
   * @return string
   */
  public md5(content: string | Buffer) {
    return crypto.createHash('md5').update(content).digest('hex')
  }
}
