/*
 * @Author: 杨宏旋
 * @Date: 2021-07-15 10:15:20
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-24 10:06:10
 * @Description:
 */
/*
 * @Author: 杨宏旋
 * @Date: 2021-01-14 16:15:29
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-01-14 16:16:48
 * @Description:
 */
import * as mongoose from 'mongoose'
type MongooseSingleton = {
  clients: Map<string, mongoose.Connection>
  get(id: string): mongoose.Connection
}

export interface MongooseTypes {
  models: {
    [key: string]: (appid: string) => mongoose.Model<T>
  }
  mongoose: typeof mongoose
  mongooseDB: MongooseSingleton
}
