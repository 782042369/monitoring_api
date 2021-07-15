/*
 * @Author: 杨宏旋
 * @Date: 2021-07-15 10:25:59
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-07-15 10:25:59
 * @Description:
 */
/*
 * @Author: 杨宏旋
 * @Date: 2020-07-20 17:55:43
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2020-12-10 15:39:51
 * @Description:
 */
import BaseController from './base'
export default class UserController extends BaseController {
  public handlePwdToMd5(code) {
    const { app } = this
    // 110119
    // 8d7d66441caa25e5f14189568c38af52
    const pwdCode = this.md5(`${code}+${app.config.tail}`)
    return pwdCode
  }
  /**
   * 新增用户
   */
  public async createdUser(type) {
    const { ctx, app, validateRule } = this
    ctx.validate(validateRule.addUserRules, ctx.request.body)
    try {
      const { email, passwd } = ctx.request.body
      const userInfo = await ctx.service.user.handleGetOne({
        email,
        status: {
          $ne: app.config.BaseCfg.delete,
        },
      })
      if (userInfo) {
        return false
      }
      ctx.request.body.passwd = this.handlePwdToMd5(passwd)
      ctx.request.body.passwd2 = passwd
      ctx.request.body.type = type
      const data = await ctx.service.user.handleAddOne()
      return data
    } catch (error) {
      console.error('createdUser error: ', error)
      return error
    }
  }
  /**
   * 更新用户
   */
  public async updateUser(type: number, user_id: string) {
    const { ctx, validateRule } = this
    const { passwd, passwd2 } = ctx.request.body
    if (passwd && passwd === passwd2) {
      ctx.request.body.passwd = this.handlePwdToMd5(passwd)
      ctx.request.body.passwd2 = passwd
    } else {
      ctx.validate(validateRule.userRules, ctx.request.body)
      ctx.request.body.type = type
    }
    try {
      const data = await ctx.service.user.handleUpdateOne(user_id || ctx.params)
      if (data?.ok) {
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }
}
