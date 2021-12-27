/*
 * @Author: yanghongxuan
 * @Date: 2021-12-23 17:25:44
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-27 10:02:50
 * @Description:
 */
import BaseController from '../base/base'
import { SelfController, methodWrap } from '../../router'

// const lru = new LRUCache(15)
@SelfController()
export default class Controller extends BaseController {
  // 获得web端 pvuvip
  // async getWebPvUvIpByDay() {
  //   const interval = parser.parseExpression(
  //     this.app.config.pvuvip_task_day_time
  //   )
  //   const endTime = new Date(interval.prev().toString())
  //   const beginTime = new Date(interval.prev().toString())
  //   const query = { create_time: { $gte: beginTime, $lt: endTime } }

  //   const datas = await this.ctx.model.System.distinct('app_id', {
  //     type: 'web'
  //   })
  //     .read('sp')
  //     .exec()
  //   this.groupData(datas, 2, query, beginTime, endTime)
  // }
  // // 定时执行每分钟的数据
  // async getWebPvUvIpByMinute() {
  //   const interval = parser.parseExpression(
  //     this.app.config.pvuvip_task_minute_time
  //   )
  //   const endTime = new Date(interval.prev().toString())
  //   const beginTime = new Date(interval.prev().toString())
  //   const query = { create_time: { $gte: beginTime, $lt: endTime } }

  //   const datas = await this.ctx.model.System.distinct('app_id', {
  //     type: 'web'
  //   })
  //     .read('sp')
  //     .exec()
  //   this.groupData(datas, 1, query, endTime)
  // }
  // 用户列表
  @methodWrap('/api/uvpvtask', 'get', 0)
  // 某日概况
  async getPvUvIpSurveyOne() {
    const { ctx } = this
    try {
      // const query = ctx.request.query
      // const appId = query.appId
      // const beginTime = query.beginTime
      // const endTime = query.endTime
      // if (!appId) throw new Error('pvuvip概况统计：appId不能为空')
      // if (!beginTime) throw new Error('pvuvip概况统计：beginTime不能为空')
      // if (!endTime) throw new Error('pvuvip概况统计：endTime不能为空')
      ctx.service.web.reportTask.savaDataCleaningByDimension()
      this.success(200, 'ok')
    } catch (error) {
      this.error(500, `用户列表查询失败，${error}`, error)
    }
  }
}
