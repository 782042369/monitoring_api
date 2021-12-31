/* eslint-disable no-constant-condition */
/*
 * @Author: yanghongxuan
 * @Date: 2021-12-23 17:25:44
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-31 13:59:47
 * @Description:
 */
import * as parser from 'cron-parser'
import BaseController from '../base/base'
import { SelfController, methodWrap } from '../../router'
import { converUnit, getEndDate, getStartDate, timeFormat } from '../../utils'
import { ObjProps } from '../../types'

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
      const timestrat = new Date(interval.prev().toString()).getTime()
      const betweenTime = Math.abs(new Date(timer).getTime() - timestrat)

      // 今日数据概况
      let result: any = await this.app.redis.get(`${appId}_pv_uv_ip_realtime`)
      if (result) {
        result = JSON.parse(result)
        result.flow = converUnit(result.flow)
      }
      this.success(200, 'ok', {
        time: betweenTime,
        data: result
      })
    } catch (error) {
      this.error(500, `获取数据失败，${error}`, error)
    }
  }
  @methodWrap('/api/getWebPvUvIpByDay', 'get', 0)
  // 获得web端 pvuvip
  async getWebPvUvIpByDay() {
    const { ctx } = this
    try {
      const query = ctx.query
      const { appId, beginTime, endTime } = query
      if (!appId) throw new Error('pvuvip概况统计：appId不能为空')
      if (!beginTime) throw new Error('pvuvip概况统计：beginTime不能为空')
      if (!endTime) throw new Error('pvuvip概况统计：endTime不能为空')
      const result = await ctx.service.web.pvuvip.getPvUvIpSurveyOne({
        beginTime: getStartDate(beginTime),
        endTime: getEndDate(endTime),
        appId: query.appId
      })
      this.success(200, 'ok', {
        ...(result?._doc || result),
        flow: converUnit(result?.flow || result?._doc?.flow || 0)
      })
    } catch (error) {
      this.error(500, `pvuvip数据获取失败，${error}`, error)
    }
  }
  @methodWrap('/api/getPvUvIpList', 'get', 0)
  // 获得多条数据
  async getPvUvIpList() {
    const { ctx } = this
    const query = ctx.query
    const appId = query.appId
    // 参数校验
    if (!appId) throw new Error('界面查询pvuvip：appId不能为空')

    // 计算定时任务间隔
    const interval = parser.parseExpression(
      this.app.config.pvuvip_task_minute_time
    )
    const timer = interval.prev().toString()
    const timestrat = new Date(interval.prev().toString()).getTime()
    const betweenTime = Math.abs(new Date(timer).getTime() - timestrat)

    const beginTime = new Date(query.beginTime || timestrat - betweenTime * 30)
    const endTime = new Date(query.endTime || timestrat)

    const datalist =
      (await ctx.service.web.pvuvip.getPvUvIpData(appId, beginTime, endTime)) ||
      []
    const result = await this.getTimeList(beginTime, endTime, datalist)

    this.success(200, 'ok', {
      time: betweenTime,
      data: result
    })
  }
  // 获得时间列表
  async getTimeList(beginTime, endTime, datalist) {
    const result: any[] = []
    const options = {
      currentDate: new Date(beginTime),
      endDate: new Date(endTime),
      iterator: true
    }
    const interval = parser.parseExpression(
      this.app.config.pvuvip_task_minute_time,
      options
    )
    while (true) {
      // eslint-disable-line
      try {
        const obj: ObjProps = interval.next()
        const date = new Date(obj.value.toString())
        const timer = timeFormat(date, 'yyyy/MM/dd hh:mm:ss')
        const items = {
          time: timer,
          pv: 0,
          uv: 0,
          ip: 0,
          ajax: 0,
          flow: 0
        }
        datalist.forEach((item) => {
          if (date.getTime() === new Date(item.created_time).getTime()) {
            items.pv = item.pv || 0
            items.uv = item.uv || 0
            items.ip = item.ip || 0
            items.ajax = item.ajax || 0
            items.flow = Number(
              Number((item.flow || 0) / 1024 / 1024).toFixed(2)
            )
          }
        })
        result.push(items)
      } catch (e) {
        break
      }
    }
    const length = result.length
    if (length > 1) {
      const last = result[length - 1]
      if (!last.pv) result.splice(length - 1, 1)
    }
    return result
  }
  @methodWrap('/api/getPvUvIpOne', 'get', 0)

  // 获得单条数据
  async getPvUvIpOne() {
    const { ctx } = this
    const query = ctx.query
    const appId = query.appId
    // 参数校验
    if (!appId) throw new Error('界面查询pvuvip：appId不能为空')

    // 计算定时任务间隔
    const interval = parser.parseExpression(
      this.app.config.pvuvip_task_minute_time
    )
    interval.prev()
    const endTime = new Date(interval.prev().toString())
    const beginTime = new Date(interval.prev().toString())

    const datalist =
      (await ctx.service.web.pvuvip.getPvUvIpData(appId, beginTime, endTime)) ||
      []
    let result = {}
    if (datalist.length) {
      result = {
        time: timeFormat(datalist[0].created_time, 'yyyy/MM/dd hh:mm:ss'),
        pv: datalist[0].pv || 0,
        uv: datalist[0].uv || 0,
        ip: datalist[0].ip || 0,
        ajax: datalist[0].ajax || 0,
        flow: Number(Number((datalist[0].flow || 0) / 1024 / 1024).toFixed(2))
      }
    } else {
      result = {
        time: timeFormat(endTime, 'yyyy/MM/dd hh:mm') + ':00',
        pv: 0,
        uv: 0,
        ip: 0,
        ajax: 0,
        flow: 0
      }
    }
    this.success(200, 'ok', result)
  }
  // @methodWrap('/api/getHistoryPvUvIplist', 'get', 0)
  // // 获得历史概况
  // async getHistoryPvUvIplist() {
  //   const { ctx } = this
  //   const query = ctx.rquery
  //   const appId = query.appId
  //   if (!appId) throw new Error('pvuvip获得历史概况：appId不能为空')
  //   const result = await ctx.service.web.pvuvip.getHistoryPvUvIplist(appId)

  //   this.success(200, 'ok', result)
  // }
}
