/*
 * @Author: yanghongxuan
 * @Date: 2021-12-27 15:54:28
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-27 15:55:30
 * @Description:
 */
import { Service, Context } from 'egg'
import { Model } from 'mongoose'

export default class Index extends Service {
  models: {
    [key: string]: (appid: string) => Model<any>
  }
  constructor(params: Context<any>) {
    super(params)
    this.models = (this.app as any).models
  }
}
