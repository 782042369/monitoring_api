/*
 * @Author: yanghongxuan
 * @Date: 2021-07-21 17:29:25
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-24 14:52:01
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
      mark_page: { type: String }, // 所有资源页面统一标识 html img css js 用户系统信息等
      mark_user: { type: String }, // 统一某一时间段用户标识
      mark_uv: { type: String }, // 统一uv标识
      browser: { type: String }, // 浏览器名称
      borwser_version: { type: String }, // 浏览器版本
      system: { type: String }, // 操作系统
      system_version: { type: String }, // 系统版本
      ip: { type: String }, // 访问者IP
      county: { type: String }, // 国家
      province: { type: String }, // 省
      city: { type: String } // 市
    },
    {
      versionKey: false,
      timestamps: { createdAt: true, updatedAt: false }
    }
  )
  WebEnvironmentSchema.index({ url: 1, createdAt: -1 })
  WebEnvironmentSchema.index({ ip: 1, createdAt: -1 })
  WebEnvironmentSchema.index({ createdAt: -1 })
  WebEnvironmentSchema.index({ mark_page: 1 })
  WebEnvironmentSchema.index({ mark_user: 1 })

  app.models.WebEnvironment = (appId: string) => {
    return conn.model(`web_environment_${appId}`, WebEnvironmentSchema)
  }
}
