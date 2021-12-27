/*
 * @Author: 杨宏旋
 * @Date: 2021-07-15 10:22:04
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-27 14:05:54
 * @Description:
 */
import BaseController from '../base/base'
import { SelfController, methodWrap } from '../../router'

// const lru = new LRUCache(15)
@SelfController()
export default class Controller extends BaseController {
  // 用户列表
  @methodWrap('/api/up.gif', 'get', 0)
  public async list() {
    const { ctx } = this
    try {
      // 获取上报用户的ip地址
      const ip = ctx.get('X-Real-IP') || ctx.get('X-Forwarded-For') || ctx.ip
      ctx.query.ip = ip
      await ctx.service.web.report.handleAddOne()
      this.success(200, 'ok')
    } catch (error) {
      this.error(500, `用户列表查询失败，${error}`, error)
    }
  }
}
