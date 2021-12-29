/*
 * @Author: yanghongxuan
 * @Date: 2021-07-21 17:29:25
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-27 18:39:10
 * @Description:
 */

import { MongooseTypes } from './types'

module.exports = (app: MongooseTypes) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const conn = app.mongooseDB.get('Report')
  const WebPvUvIpSchema = new Schema(
    {
      app_id: { type: String }, // 所属系统ID
      pv: { type: Number }, // PV统计
      uv: { type: Number }, // uv统计
      ip: { type: Number }, // ip统计
      ajax: { type: Number }, // ajax访问量统计
      bounce: { type: String }, // 跳出率
      depth: { type: Number }, // 平均访问深度
      flow: { type: Number }, // 流量消费总额
      type: { type: Number, default: 1 }, // 1:每分钟数据  2：每小时数据
      created_time: { type: Date }
    },
    {
      versionKey: false,
      timestamps: { createdAt: false, updatedAt: false }
    }
  )

  WebPvUvIpSchema.index({
    type: 1,
    app_id: 1,
    bounce: 1,
    depth: 1,
    createdAt: 1
  })
  WebPvUvIpSchema.index({ type: 1, app_id: 1, createdAt: 1 })

  return conn.model('WebPvUvIp', WebPvUvIpSchema)
}
