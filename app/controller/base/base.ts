/* eslint-disable indent */
/* eslint-disable @typescript-eslint/indent */
/*
 * @Author: 杨宏旋
 * @Date: 2020-07-20 17:55:43
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-29 14:01:45
 * @Description:
 */

import { Controller, Context } from 'egg'
import validateRule from '../../validate'
import { validateRuleType, UserInfoProps } from '../../types/index'
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
      message
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
    ctx.logger.info('——————————————error——————————————')
    ctx.logger.info('error', data, message)
    ctx.logger.info('WARNNING!!!!', ctx.request.body)
    ctx.logger.info('——————————————error——————————————')
    ctx.status = 500
    ctx.body = {
      data,
      code,
      message: message.includes(
        'Cast to ObjectId failed for value "1" at path "_id" for model'
      )
        ? '请输入正确的ID'
        : message
    }
  }
  /**
   * md5
   * @param content string | Buffer
   * @return {string} string
   */
  public md5(content: string | Buffer): string {
    return crypto.createHash('md5').update(content).digest('hex')
  }
  /**
   * jwt 获取当前登陆用户
   * @return
   */
  public async GetUserByjwt(): Promise<UserInfoProps> {
    const { ctx, app } = this
    const token = (ctx.request.header.authorization as string).split(' ')[1]
    const { _id }: any = ctx.app.jwt.verify(token, app.config.jwt.secret)
    const userInfo: UserInfoProps = await ctx.service.user.handleGetOne({
      _id
    })
    return userInfo
  }
  /**
   * 生成随机串
   * @param {number} len number
   * @return {string} string
   */
  randomAppIdString(len = 5): string {
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    const maxPos = $chars.length
    let pwd = ''
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd + Date.now()
  }
}
