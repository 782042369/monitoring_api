/*
 * @Author: 杨宏旋
 * @Date: 2021-07-15 10:22:04
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-07-27 10:28:23
 * @Description:
 */
import BaseController from '../base/base'
import { SelfController, methodWrap } from '../../router'
import { ReportProps } from '../../types'
// import LRUCache from '../../untils/Lru'

// const lru = new LRUCache(15)
@SelfController()
export default class UserController extends BaseController {
  // 用户列表
  @methodWrap('/api/up.gif', 'get', 0)
  public async list() {
    const { ctx } = this
    try {
      // const ip = ctx.get('X-Real-IP') || ctx.get('X-Forwarded-For') || ctx.ip
      const { category, level, appID, deviceInfo }: ReportProps =
        ctx.query as any
      console.log('category: ', category)
      console.log('level: ', level)
      console.log('appID: ', appID)
      console.log('deviceInfo: ', deviceInfo)
      // 获取上报的ua信息
      ctx.query.userAgent = ctx.headers['user-agent']
      // 获取上报用户的ip地址
      const ip = ctx.get('X-Real-IP') || ctx.get('X-Forwarded-For') || ctx.ip
      ctx.query.ip = ip
      // 处理 127.0.0.1 请求 不做城市判断
      if (!ip || ip !== '127.0.0.1') {
        const data: {
          city: string
          province: string
        } = this.cacheIpJson[ip]
        ctx.query.city = data.city
        ctx.query.province = data.province
      }
      await ctx.service.webreport.handleAddOne()
      this.success(200, 'ok')
    } catch (error) {
      this.error(500, `用户列表查询失败，${error}`, error)
    }
  }
}
