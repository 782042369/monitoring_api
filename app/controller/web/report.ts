/*
 * @Author: 杨宏旋
 * @Date: 2021-07-15 10:22:04
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-29 13:46:15
 * @Description:
 */
import BaseController from '../base/base'
import { SelfController, methodWrap } from '../../router'

@SelfController()
export default class Controller extends BaseController {
  // 用户列表
  @methodWrap('/api/up.gif', 'get', 0)
  public async list() {
    const { ctx } = this
    try {
      ctx.set('Access-Control-Allow-Origin', '*')
      ctx.set('Content-Type', 'application/json;charset=UTF-8')
      ctx.set('X-Response-Time', '2s')
      ctx.set('Connection', 'close')
      ctx.status = 200
      // 获取上报用户的ip地址
      const ip = ctx.get('X-Real-IP') || ctx.get('X-Forwarded-For') || ctx.ip
      ctx.query.ip = ip
      ctx.service.web.report.handleAddOne()
    } catch (error) {
      this.error(500, `用户列表查询失败，${error}`, error)
    }
  }
}
