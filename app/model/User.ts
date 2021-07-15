/*
 * @Author: 杨宏旋
 * @Date: 2020-07-20 17:48:58
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-07-15 10:36:54
 * @Description:
 */
import { MongooseTypes } from './types'

module.exports = (app: MongooseTypes) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const conn = app.mongooseDB.get('User')

  const UserSchema = new Schema(
    {
      version: { type: Number, default: 1 },
      name: { type: String },
      email: { type: String },
      passwd: { type: String },
      passwd2: { type: String },
    },
    { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
  )
  UserSchema.index({ id: 1, _id: 1 }, { unique: true })
  return conn.model('User', UserSchema, 'main')
}
