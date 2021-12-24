/*
 * @Author: yanghongxuan
 * @Date: 2021-07-21 17:29:25
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-24 15:53:50
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
      mark_user: { type: String }, // 统一某一时间段用户标识
      selector: { type: String, default: '' } // 选择器层级
    },
    {
      versionKey: false,
      timestamps: { createdAt: true, updatedAt: false }
    }
  )

  WebErrorsSchema.index({ category: 1, resource_url: 1, createdAt: -1 })
  WebErrorsSchema.index({ resource_url: 1, createdAt: -1 })
  WebErrorsSchema.index({ createdAt: -1 })

  app.models.WebErrors = (appId: string) => {
    return conn.model(`web_errors_${appId}`, WebErrorsSchema)
  }
}
