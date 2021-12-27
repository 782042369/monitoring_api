/*
 * @Author: 杨宏旋
 * @Date: 2020-07-20 17:48:58
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-27 11:30:54
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
      mark_user: { type: String }, // 统一用户标识
      mark_uv: { type: String }, // 统一uv标识
      url: { type: String }, // 访问url
      pre_url: { type: String, default: '' }, // 上一页面来源
      performance: { type: Mixed, default: {} }, // 用户浏览器性能数据
      log_list: { type: Mixed, default: {} }, // 日志信息列表
      resource_list: { type: Mixed, default: [] }, // 资源性能数据列表
      device: {
        w: { type: Number }, // 屏幕宽度
        h: { type: Number }, // 屏幕高度
        lan: { type: String }, // 语言版本
        net: { type: String }, // 网络版本
        orientation: { type: String }, // 横屏竖屏
        fingerprint: { type: String } // 浏览器指纹
      },
      type: { type: Number }, // 1：网页性能上报  2：ajax上报 3：js异常 4：资源加载日志
      selector: { type: String, default: '' }, // 选择器层级
      is_first_in: { type: Number } // 首次进入 1:是 2:不是
    },
    {
      versionKey: false,
      timestamps: { createdAt: true, updatedAt: false }
    }
  )
  WebReportSchema.index({ createdAt: 1, app_id: 1 })
  return conn.model('WebReport', WebReportSchema, 'web-report')
}
