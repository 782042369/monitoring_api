/*
 * @Author: yanghongxuan
 * @Date: 2021-12-23 17:25:44
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-28 18:16:42
 * @Description:
 */
import * as parser from 'cron-parser'
import BaseController from '../base/base'
import { SelfController, methodWrap } from '../../router'

// const lru = new LRUCache(15)
@SelfController()
export default class Controller extends BaseController {
  // 获取处理时间和今日数据缓存
  @methodWrap('/api/getWebPvUvIpSituation', 'get', 0)
  async getWebPvUvIpSituation() {
    const { ctx } = this
    try {
      const query = ctx.request.query
      const appId = query.appId
      if (!appId) throw new Error('pvuvip概况统计：appId不能为空')
      // 计算定时任务间隔
      const interval = parser.parseExpression(
        this.app.config.pvuvip_task_minute_time
      )
      const timer = interval.prev().toString()
      console.log('timer: ', timer)
      const timestrat = new Date(interval.prev().toString()).getTime()
      console.log('timestrat: ', timestrat)
      const betweenTime = Math.abs(new Date(timer).getTime() - timestrat)
      console.log('betweenTime: ', betweenTime)

      // 今日数据概况
      let result = await this.app.redis.get(`${appId}_pv_uv_ip_realtime`)
      if (result) result = JSON.parse(result)
      this.success(200, 'ok', {
        time: betweenTime,
        data: result
      })
    } catch (error) {
      this.error(500, `用户列表查询失败，${error}`, error)
    }
  }
  // 定时执行每分钟的数据
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
  @methodWrap('/api/getWebPvUvIpByDay', 'get', 0)
  // 获得web端 pvuvip
  async getWebPvUvIpByDay() {
    const { ctx } = this
    try {
      // const query = ctx.query
      // const { appId, beginTime, endTime } = query
      // if (!appId) throw new Error('pvuvip概况统计：appId不能为空')
      // if (!beginTime) throw new Error('pvuvip概况统计：beginTime不能为空')
      // if (!endTime) throw new Error('pvuvip概况统计：endTime不能为空')
      // const result = await ctx.service.web.pvuvip.getTheDataWithinATimePeriod({
      //   beginTime: this.getStartDate(beginTime),
      //   endTime: this.getEndDate(endTime),
      //   appId: query.appId
      // })
      // this.success(200, 'ok', result)
      ctx.service.web.reportTask.savaDataCleaningByDimension()
    } catch (error) {
      this.error(500, `用户列表查询失败，${error}`, error)
    }
  }
}
