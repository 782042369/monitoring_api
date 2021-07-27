/*
 * @Author: 杨宏旋
 * @Date: 2020-07-20 17:48:58
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-07-27 10:16:25
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
      timestamps: false
    }
  )
  return conn.model('User', UserSchema, 'user')
}
