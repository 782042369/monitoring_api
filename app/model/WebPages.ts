/*
 * @Author: yanghongxuan
 * @Date: 2021-07-21 17:29:25
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-24 15:10:16
 * @Description:
 */

import { MongooseTypes } from './types'

module.exports = (app: MongooseTypes) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const conn = app.mongooseDB.get('Report')

  const WebPagesSchema = new Schema(
    {
      app_id: { type: String }, // 所属系统id
      url: { type: String }, // url域名
      pre_url: { type: String }, // 用户访问的上一个页面，本页面来源
      speed_type: { type: Number }, // 访问速度类型 1：正常  2：慢
      is_first_in: { type: Number }, // 是否是某次会话的首次进入 2: 首次  1：非首次
      mark_page: { type: String }, // 所有资源页面统一标识 html img css js 用户系统信息等
      mark_user: { type: String }, // 统一某一时间段用户标识
      load_time: { type: Number, default: 0 }, // 页面完全加载时间 单位：ms
      dns_time: { type: Number, default: 0 }, // dns解析时间 单位：ms
      tcp_time: { type: Number, default: 0 }, // TCP连接时间
      dom_time: { type: Number, default: 0 }, // DOM构建时间 单位：ms
      resource_list: { type: Array }, // 资源性能数据列表
      total_res_size: { type: Number, default: 0 }, // 页面资源大小
      white_time: { type: Number, default: 0 }, // 白屏时间 单位：ms
      redirect_time: { type: Number, default: 0 }, // 页面重定向时间
      unload_time: { type: Number, default: 0 }, // unload 时间
      request_time: { type: Number, default: 0 }, // request请求耗时
      analysisDom_time: { type: Number, default: 0 }, // 解析dom耗时
      ready_time: { type: Number, default: 0 }, // 页面准备时间
      screenwidth: { type: Number }, // 屏幕宽度
      screenheight: { type: Number } // 屏幕高度
    },
    {
      versionKey: false,
      timestamps: { createdAt: true, updatedAt: false }
    }
  )

  WebPagesSchema.index({
    speed_type: 1,
    is_first_in: 1,
    url: 1,
    createdAt: -1
  })
  WebPagesSchema.index({ createdAt: -1 })

  app.models.WebPages = (appId: string) => {
    return conn.model(`web_pages_${appId}`, WebPagesSchema)
  }
}
