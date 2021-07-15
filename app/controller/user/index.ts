/*
 * @Author: 杨宏旋
 * @Date: 2021-07-15 10:22:04
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-07-15 12:46:50
 * @Description:
 */
import UserBaseController from '../base/userbase'
import { SelfController, methodWrap } from '../../router'

@SelfController()
export default class UserController extends UserBaseController {
  // 用户列表
  @methodWrap('/api/user/list', 'get')
  public async list() {
    try {
      this.success(200, '用户列表查询成功')
    } catch (error) {
      this.error(500, `用户列表查询失败，${error}`, error)
    }
  }
  @methodWrap('/api/user', 'post', 0)
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
        this.error(500, `创建用户失败，${email}已存在。`)
        return
      }
      const user = await ctx.service.user.handleGetAllList({})
      ctx.request.body.passwd = this.handlePwdToMd5(passwd)
      ctx.request.body.passwd2 = passwd
      ctx.request.body.type = user?.length === 0 || !user ? 1 : 0
      await ctx.service.user.handleAddOne()
      this.success(200, '创建用户成功')
    } catch (error) {
      ctx.logger.info('createdUser error: ', error)
      this.error(500, `创建用户失败，${error}`)
      return error
    }
  }
  @methodWrap('/api/user', 'put')
  public async update() {
    try {
      this.success(200, '更新用户成功')
    } catch (error) {
      this.error(500, `更新用户失败，${error}`, error)
    }
  }
  @methodWrap('/api/user', 'delete')
  public async delete() {
    try {
      this.success(200, '删除用户成功')
    } catch (error) {
      this.error(500, `删除用户失败，${error}`, error)
    }
  }
}
