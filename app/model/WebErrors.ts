/*
 * @Author: yanghongxuan
 * @Date: 2021-07-21 17:29:25
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-27 18:01:18
 * @Description:
 */
import { MongooseTypes } from './types'

module.exports = (app: MongooseTypes) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const conn = app.mongooseDB.get('Report')

  const WebErrorsSchema = new Schema(
    {
      app_id: { type: String }, // 所属系统
      call_url: { type: String }, // 调用页面的URL
      msg: { type: String }, // 错误信息
      type: { type: String }, // 错误类型
      col: { type: String }, // js错误列号
      line: { type: String }, // js错误行号
      mark_uv: { type: String }, // 统一uv标识
      selector: { type: String, default: '' }, // 选择器层级
      device: {
        w: { type: Number }, // 屏幕宽度
        h: { type: Number }, // 屏幕高度
        lan: { type: String }, // 语言版本
        net: { type: String }, // 网络版本
        fingerprint: { type: String }, // 浏览器指纹
        browser: {
          name: { type: String, default: '' },
          version: { type: String, default: '' },
          major: { type: String, default: '' }
        },
        os: {
          name: { type: String, default: '' },
          version: { type: String, default: '' }
        }
      },
      created_time: { type: Date }
    },
    {
      versionKey: false,
      timestamps: { createdAt: false, updatedAt: false }
    }
  )

  WebErrorsSchema.index({ category: 1, resource_url: 1, created_time: -1 })
  WebErrorsSchema.index({ resource_url: 1, created_time: -1 })
  WebErrorsSchema.index({ created_time: -1 })

  app.models.WebErrors = (appId: string) => {
    return conn.model(`web_errors_${appId}`, WebErrorsSchema)
  }
}
