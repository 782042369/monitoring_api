/*
 * @Author: 杨宏旋
 * @Date: 2020-07-20 18:34:57
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-28 10:11:23
 * @Description:
 */
import { Service } from 'egg'
import { ObjProps, ServicePageProps } from '../types'

export default class User extends Service {
  /**
   * 用户列表
   * @param query 查询参数
   */
  public async handleGetList(query: ServicePageProps) {
    const { ctx } = this
    try {
      const { pageNo, limit, ...queryval } = query
      const [count, pageList] = await Promise.all([
        ctx.model.User.countDocuments(queryval),
        ctx.model.User.find(queryval)
          .sort({
            updated: -1
          })
          .skip((pageNo - 1) * limit)
          .limit(limit)
          .lean<ObjProps[]>()
      ])
      return { pageList, count }
    } catch (error) {
      ctx.logger.info('user handleGetList error', error)
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
      const list = await ctx.model.User.find(query)
        .sort({
          created: -1
        })
        .lean<ObjProps[]>()
      return list
    } catch (error) {
      ctx.logger.info('user handleGetAllList error', error)
      return error
    }
  }

  /**
   * 用户详情
   * @param query 查询参数
   */
  public async handleGetOne(query) {
    const { ctx } = this
    try {
      return await ctx.model.User.findOne(query).lean<ObjProps>()
    } catch (error) {
      ctx.logger.info('user handleGetOne error', error)
      return error
    }
  }
  /**
   * 新增user
   */
  public async handleAddOne() {
    const { ctx } = this
    try {
      const data = new ctx.model.User(ctx.request.body)
      const result = data.save()
      return result
    } catch (error) {
      ctx.logger.info('user handleAddOne error', error)
      return error
    }
  }
  /**
   * 编辑user
   */
  public async handleUpdateOne(_id: string) {
    const { ctx } = this
    try {
      const result = await ctx.model.User.updateOne(
        {
          _id
        },
        ctx.request.body
      )
      return result
    } catch (error) {
      ctx.logger.info('user handleUpdateOne error', error)
      return error
    }
  }
  /**
   * 删除user
   */
  async handleDeleteOne(_id: string) {
    const { ctx } = this
    try {
      const result = await ctx.model.User.updateOne(
        {
          _id
        },
        {
          status: 3
        }
      )
      return result
    } catch (error) {
      ctx.logger.info('user handleDeleteOne error', error)
      return error
    }
  }
}
