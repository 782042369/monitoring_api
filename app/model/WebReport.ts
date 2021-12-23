/*
 * @Author: 杨宏旋
 * @Date: 2020-07-20 17:48:58
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-23 09:41:24
 * @Description:
 */
import { MongooseTypes } from './types'

module.exports = (app: MongooseTypes) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const conn = app.mongooseDB.get('Report')
  const Mixed = Schema.Types.Mixed
  const WebReportSchema = new Schema(
    {
      app_id: { type: String }, // 系统标识
      user_agent: { type: String }, // 用户浏览器信息标识
      ip: { type: String }, // 用户ip
      mark_page: { type: String }, // 所有资源页面统一标识 html img css js 用户系统信息等
      mark_user: { type: String }, // 统一某一时间段用户标识
      mark_uv: { type: String }, // 统一uv标识
      url: { type: String }, // 访问url
      pre_url: { type: String }, // 上一页面来源
      performance: { type: Mixed }, // 用户浏览器性能数据
      error_list: { type: Mixed }, // 错误信息列表
      resource_list: { type: Mixed }, // 资源性能数据列表
      device: {
        w: { type: Number }, // 屏幕宽度
        h: { type: Number }, // 屏幕高度
        type: { type: String }, // 设备
        os: { type: String }, // 设备操作系统
        osv: { type: String }, // 设备操作系统版本
        lan: { type: String }, // 语言版本
        net: { type: String }, // 网络版本
        orientation: { type: String }, // 横屏竖屏
        fingerprint: { type: String }, // 浏览器指纹
        browser: { type: Mixed } // 浏览器信息
      },
      type: { type: Number }, // 1：网页性能上报  2：ajax上报 3：js异常 4：资源加载错误
      selector: { type: String } // 出错选择器
    },
    {
      versionKey: false,
      timestamps: false
    }
  )
  WebReportSchema.index({ create_time: 1 })
  return conn.model('WebReport', WebReportSchema, 'web-report')
}
