/*
 * @Author: yanghongxuan
 * @Date: 2021-07-21 17:29:25
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-29 09:24:21
 * @Description:
 */

import { MongooseTypes } from './types'

module.exports = (app: MongooseTypes) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const conn = app.mongooseDB.get('Report')

  const WebEnvironmentSchema = new Schema(
    {
      app_id: { type: String }, // 所属系统
      url: { type: String }, // 访问页面的url
      mark_uv: { type: String }, // 统一uv标识
      browser: { type: String }, // 浏览器名称
      borwser_version: { type: String }, // 浏览器版本
      system: { type: String }, // 操作系统
      system_version: { type: String }, // 系统版本
      ip: { type: String }, // 访问者IP
      county: { type: String, default: '' }, // 国家
      province: { type: String, default: '' }, // 省
      city: { type: String, default: '' }, // 市
      system_w: { type: Number }, // 屏幕宽
      system_h: { type: Number }, // 屏幕高
      System_net: { type: String }, // 网络
      system_lan: { type: String }, // 语言
      created_time: { type: Date }
    },
    {
      versionKey: false,
      timestamps: { createdAt: false, updatedAt: false }
    }
  )
  WebEnvironmentSchema.index({ ip: 1, url: 1, created_time: -1 })

  app.models.WebEnvironment = (appId: string) => {
    return conn.model(`web_environment_${appId}`, WebEnvironmentSchema)
  }
}
