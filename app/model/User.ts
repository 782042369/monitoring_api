/*
 * @Author: 杨宏旋
 * @Date: 2020-07-20 17:48:58
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-07-15 12:22:12
 * @Description:
 */
import { MongooseTypes } from './types'

module.exports = (app: MongooseTypes) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const conn = app.mongooseDB.get('User')

  const UserSchema = new Schema(
    {
      name: { type: String },
      email: { type: String },
      passwd: { type: String },
      passwd2: { type: String },
      type: { type: Number },
      projectid: [String], // 可见项目id
    },
    {
      versionKey: false,
      timestamps: false,
    }
  )
  return conn.model('User', UserSchema, 'main')
}
