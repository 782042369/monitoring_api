/*
 * @Author: 杨宏旋
 * @Date: 2020-07-20 18:34:57
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-07-22 14:53:27
 * @Description:
 */
import { Service } from 'egg'
import { MongooseFilterQuery } from 'mongoose'
import { ObjProps, ServicePageProps } from '../types'

export default class WebReport extends Service {
  /**
   * 用户列表
   * @param query 查询参数
   */
  public async handleGetList(query: ServicePageProps) {
    const { ctx } = this
    try {
      const { pageNo, limit, ...queryval } = query
      const [count, pageList] = await Promise.all([
        ctx.model.WebReport.countDocuments(queryval),
        ctx.model.WebReport.find(queryval)
          .sort({
            updated: -1,
          })
          .skip((pageNo - 1) * limit)
          .limit(limit)
          .lean<ObjProps>(),
      ])
      return { pageList, count }
    } catch (error) {
      ctx.logger.info('WebReport handleGetList error', error)
      return error
    }
  }
  /**
   * 用户列表
   * @param query 查询参数
   */
  public async handleGetAllList(query: ObjProps) {
    const { ctx } = this
    try {
      const list = await ctx.model.WebReport.find(query)
        .sort({
          created: -1,
        })
        .lean<ObjProps>()
      return list
    } catch (error) {
      ctx.logger.info('WebReport handleGetAllList error', error)
      return error
    }
  }

  /**
   * 用户详情
   * @param query 查询参数
   */
  public async handleGetOne(
    query: MongooseFilterQuery<Pick<any, string | number | symbol>> | undefined
  ) {
    const { ctx } = this
    try {
      return await ctx.model.WebReport.findOne(query).lean<ObjProps>()
    } catch (error) {
      ctx.logger.info('WebReport handleGetOne error', error)
      return error
    }
  }
  /**
   * 新增user
   */
  public async handleAddOne() {
    const { ctx } = this
    try {
      const data = new ctx.model.WebReport(ctx.query)
      const result = data.save()
      return result
    } catch (error) {
      ctx.logger.info('WebReport handleAddOne error', error)
      return error
    }
  }
}
