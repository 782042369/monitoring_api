/* eslint-disable space-before-function-paren */
/* eslint-disable object-shorthand */
/* eslint-disable newline-per-chained-call */
/*
 * @Author: yanghongxuan
 * @Date: 2021-12-23 17:15:42
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-31 15:02:45
 * @Description:
 */
/*
 * @Author: 杨宏旋
 * @Date: 2020-07-20 18:34:57
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-23 17:07:00
 * @Description:
 */
import IndexService from '../index'
// import { ObjProps, ServicePageProps } from '../../types'
declare function emit(k, v)

export default class Index extends IndexService {
  // 保存用户上报的数据
  async getPvUvIpData(appId, beginTime, endTime) {
    const querydata = {
      app_id: appId,
      type: 1,
      created_time: { $gte: beginTime, $lt: endTime }
    }
    return await this.ctx.model.WebPvuvip.find(querydata)
      .read('sp')
      .lean()
      .exec()
  }
  // 历史概况
  async getHistoryPvUvIplist({ app_id, endTime }) {
    const query = { app_id, type: 2, created_time: { $lt: endTime } }
    return await this.ctx.model.WebPvuvip.find(query)
      .read('sp')
      .sort({ created_time: -1 })
      .limit(5)
      .exec()
  }
  // 查询某日概况
  async getPvUvIpSurveyOne({ appId, beginTime, endTime }) {
    const pvuvipdata = await this.getTheDataWithinATimePeriod({
      appId,
      beginTime,
      endTime,
      type: true
    })
    return pvuvipdata
  }
  /**
   * @param query 查询参数
   */
  public async getTheDataWithinATimePeriod(query: {
    appId: string
    beginTime: Date
    endTime: Date
    type?: boolean
  }) {
    const { appId, beginTime, type, endTime } = query
    const querydata = {
      created_time: { $gte: beginTime, $lte: endTime }
    }
    const pv = this.pv(appId, querydata)
    const uv = this.uv(appId, querydata)
    const ip = this.ip(appId, querydata)
    const ajax = this.ajax(appId, querydata)
    const flow = this.flow(appId, querydata)
    if (!type) {
      const data = await Promise.all([pv, uv, ip, ajax, flow])
      return {
        pv: data[0] || 0,
        uv: data[1].length ? data[1][0].count : 0,
        ip: data[2].length ? data[2][0].count : 0,
        ajax: data[3] || 0,
        flow: data[4] || 0
      }
    }
    const user = this.user(appId, querydata)
    const bounce = this.bounce(appId, querydata)
    const data = await Promise.all([pv, uv, ip, ajax, user, flow, bounce])
    return {
      pv: data[0] || 0,
      uv: data[1].length ? data[1][0].count : 0,
      ip: data[2].length ? data[2][0].count : 0,
      ajax: data[3],
      user: data[4].length ? data[4][0].count : 0,
      flow: data[5] || 0,
      bounce: data[6] || 0
    }
  }
  // pv
  public async pv(appId, querydata) {
    return await this.models.WebPages(appId).countDocuments(querydata).exec()
  }
  // ajax
  public async ajax(appId, querydata) {
    return await this.models.WebAjaxs(appId).countDocuments(querydata)
  }
  // uv
  public async uv(appId, querydata) {
    return await this.models
      .WebEnvironment(appId)
      .aggregate([
        { $match: querydata },
        { $project: { mark_uv: true } },
        { $group: { _id: '$mark_uv' } },
        { $group: { _id: null, count: { $sum: 1 } } }
      ])
      .exec()
  }
  // ip
  public async ip(appId, querydata) {
    return this.models
      .WebEnvironment(appId)
      .aggregate([
        { $match: querydata },
        { $project: { ip: true } },
        { $group: { _id: '$ip' } },
        { $group: { _id: null, count: { $sum: 1 } } }
      ])
      .exec()
  }
  // user
  public async user(appId, querydata) {
    return await this.models
      .WebEnvironment(appId)
      .aggregate([
        { $match: querydata },
        { $project: { mark_uv: true } },
        { $group: { _id: '$mark_uv' } },
        { $group: { _id: null, count: { $sum: 1 } } }
      ])
      .exec()
  }
  // 流量消费
  public async flow(appId, querydata) {
    const pagequery = Object.assign({}, querydata, { is_first_in: 0 })
    const pageflow = this.models
      .WebPages(appId)
      .aggregate([
        { $match: pagequery },
        { $group: { _id: null, amount: { $sum: '$total_res_size' } } }
      ])
      .exec()
    const ajaxflow = this.models
      .WebAjaxs(appId)
      .aggregate([
        { $match: querydata },
        { $group: { _id: null, amount: { $sum: '$decoded_body_size' } } }
      ])
      .exec()
    const data = await Promise.all([pageflow, ajaxflow])
    const page_flow = data[0].length ? data[0][0].amount : 0
    const ajax_flow = data[1].length ? data[1][0].amount : 0
    return page_flow + ajax_flow
  }
  // 跳出率
  async bounce(appId, querydata) {
    const res = await this.models.WebEnvironment(appId).mapReduce({
      map: function () {
        emit((this as any).mark_uv, 1)
      },
      reduce: function (_key, values) {
        return values.length === 1
      },
      query: querydata,
      out: { replace: 'webjumpout' }
    })
    const result = await res.model
      .find()
      .where('value')
      .equals(1)
      .count()
      .exec()
    return result
  }
  // 保存pvuvip数据
  async savePvUvIpData({ appId, endTime, type, pvuvipdata }) {
    const pvuvip = new this.ctx.model.WebPvuvip().lean()
    pvuvip.app_id = appId
    pvuvip.pv = pvuvipdata.pv || 0
    pvuvip.uv = pvuvipdata.uv || 0
    pvuvip.ip = pvuvipdata.ip || 0
    pvuvip.ajax = pvuvipdata.ajax || 0
    pvuvip.flow = pvuvipdata.flow || 0
    pvuvip.bounce = pvuvipdata.bounce
      ? ((pvuvipdata.bounce / pvuvipdata.pv) * 100).toFixed(2) + '%'
      : 0
    pvuvip.depth =
      pvuvipdata.pv && pvuvipdata.user
        ? Number(pvuvipdata.pv / pvuvipdata.user)
        : 0
    pvuvip.created_time = endTime
    pvuvip.type = type
    return await pvuvip.save()
  }
}
