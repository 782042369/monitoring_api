/*
 * @Author: yanghongxuan
 * @Date: 2021-07-21 17:29:25
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-27 13:52:15
 * @Description:
 */

import { MongooseTypes } from './types'

module.exports = (app: MongooseTypes) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const Mixed = Schema.Types.Mixed
  const conn = app.mongooseDB.get('Report')

  const WebResourceSchema = new Schema(
    {
      app_id: { type: String }, // 所属系统
      url: { type: String }, // 访问页面的url
      call_url: { type: String }, // 调用页面的URL
      speed_type: { type: Number }, // 访问速度类型 1：正常  2：慢
      resource_datas: { type: Mixed }, // 页面所有加载资源json对象
      name: { type: String }, // 资源名称
      method: { type: String, default: 'GET' }, // 资源请求方式
      duration: { type: Number, default: 0 }, // 资源请求耗时
      decoded_body_size: { type: Number, default: 0 }, // 资源请求返回大小
      next_hop_protocol: { type: String, default: 'http/1.1' }, // 资源请求类型
      mark_user: { type: String } // 统一某一时间段用户标识
    },
    {
      versionKey: false,
      timestamps: { createdAt: true, updatedAt: false }
    }
  )

  WebResourceSchema.index({ speed_type: 1, name: 1, createdAt: -1 })
  WebResourceSchema.index({ name: 1, createdAt: -1 })
  WebResourceSchema.index({ speed_type: 1, url: 1 })

  app.models.WebResource = (appId: string) => {
    return conn.model(`web_resources_${appId}`, WebResourceSchema)
  }
}
