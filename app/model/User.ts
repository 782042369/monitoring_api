/*
 * @Author: 杨宏旋
 * @Date: 2020-07-20 17:48:58
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-24 13:00:36
 * @Description:
 */
import { MongooseTypes } from './types'

module.exports = (app: MongooseTypes) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const conn = app.mongooseDB.get('Report')

  const UserSchema = new Schema(
    {
      name: { type: String },
      email: { type: String },
      passwd: { type: String },
      passwd2: { type: String },
      type: { type: Number },
      projectid: [String], // 可见项目id
      status: { type: Number, default: 1 } // 1 启用 2 停用 3 删除
    },
    {
      versionKey: false,
      timestamps: { createdAt: true, updatedAt: false }
    }
  )
  return conn.model('User', UserSchema, 'user')
}
