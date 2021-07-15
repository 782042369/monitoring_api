/*
 * @Author: 杨宏旋
 * @Date: 2021-07-15 10:24:33
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-07-15 10:33:08
 * @Description:
 */
/*
 * @Author: 杨宏旋
 * @Date: 2019-08-02 13:13:04
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-04-14 17:10:44
 * @Description:
 */
import BaseController from '../base/userbase'
import { SelfController, methodWrap } from '../../router'

@SelfController()
export default class UserController extends BaseController {
  @methodWrap('/api/login', 'post', 0)
  public async index() {
    try {
      const { ctx } = this
      const { email, passwd } = ctx.request.body
      const Md5PasswdVal = this.handlePwdToMd5(passwd)
      const userInfo = await ctx.service.user.handleGetOne({ email })
      if (userInfo) {
        if (Md5PasswdVal !== userInfo?.passwd) {
          this.error(1, '用户名密码错误')
        } else {
          this.success(0, '登录成功', userInfo)
        }
      } else {
        this.error(1, '登录失败')
      }
    } catch (error) {
      this.error(1, '登录错误', error)
    }
  }
}
