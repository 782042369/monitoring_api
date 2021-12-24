/*
 * @Author: yanghongxuan
 * @Date: 2021-07-21 17:29:25
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-24 12:56:05
 * @Description:
 */

import { MongooseTypes } from './types'

module.exports = (app: MongooseTypes) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const conn = app.mongooseDB.get('Report')

  const WebStatisSchema = new Schema(
    {
      app_id: { type: String }, // 所属系统ID
      top_pages: { type: Array }, // top访问page列表
      top_jump_out: { type: Array }, // top访问跳出率页面列表
      top_browser: { type: Array }, // top浏览器排行
      provinces: { type: Array } // 省份访问流量排行
    },
    {
      versionKey: false,
      timestamps: { createdAt: true, updatedAt: false }
    }
  )

  WebStatisSchema.index({ app_id: 1, createdAt: 1 })

  return conn.model('WebStatis', WebStatisSchema)
}
