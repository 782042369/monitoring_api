/*
 * @Author: 杨宏旋
 * @Date: 2021-07-15 10:22:04
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-07-15 13:04:46
 * @Description:
 */
import BaseController from '../base/base'
import { SelfController, methodWrap } from '../../router'

@SelfController()
export default class ProductController extends BaseController {
  // 项目列表
  @methodWrap('/api/project/list', 'get')
  public async list() {
    try {
      this.success(200, '项目列表查询成功')
    } catch (error) {
      this.error(500, `项目列表查询失败，${error}`, error)
    }
  }
  @methodWrap('/api/project', 'post', 0)
  public async created() {
    const { ctx, app, validateRule } = this
    ctx.validate(validateRule.addUserRules, ctx.request.body)
    try {
      const { email, passwd } = ctx.request.body
      const userInfo = await ctx.service.user.handleGetOne({
        email,
        status: {
          $ne: app.config.STATUSTYPE.DELETE_TYPE,
        },
      })
      if (userInfo) {
        this.error(500, `创建项目失败，${email}已存在。`)
        return
      }
      const user = await ctx.service.user.handleGetAllList({})
      ctx.request.body.passwd = this.handlePwdToMd5(passwd)
      ctx.request.body.passwd2 = passwd
      ctx.request.body.type = user?.length === 0 || !user ? 1 : 0
      await ctx.service.user.handleAddOne()
      this.success(200, '创建项目成功')
    } catch (error) {
      ctx.logger.info('createdUser error: ', error)
      this.error(500, `创建项目失败，${error}`)
      return error
    }
  }
  @methodWrap('/api/project', 'put')
  public async update() {
    try {
      this.success(200, '更新项目成功')
    } catch (error) {
      this.error(500, `更新项目失败，${error}`, error)
    }
  }
  @methodWrap('/api/project', 'delete')
  public async delete() {
    try {
      this.success(200, '删除项目成功')
    } catch (error) {
      this.error(500, `删除项目失败，${error}`, error)
    }
  }
}
