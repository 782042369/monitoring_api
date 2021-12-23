/*
 * @Author: 杨宏旋
 * @Date: 2021-07-15 10:24:33
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-07-27 13:05:52
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
  @methodWrap('/api/v1/login', 'post', 0)
  public async index() {
    try {
      const { ctx, app } = this
      const { email, passwd } = ctx.request.body
      const Md5PasswdVal = this.handlePwdToMd5(passwd)
      const userInfo = await ctx.service.user.handleGetOne({ email })
      const arr = this.ctx.cookies
      console.log('arr: ', arr)
      if (userInfo) {
        if (Md5PasswdVal !== userInfo?.passwd) {
          this.error(1, '用户名密码错误')
        } else {
          delete userInfo.passwd
          delete userInfo.passwd2
          const secret = app.jwt.sign(
            {
              userInfo
            },
            app.config.jwt.secret,
            {
              expiresIn: '168h'
            }
          )
          this.success(0, '登录成功', {
            ...userInfo,
            secret
          })
        }
      } else {
        this.error(1, '登录失败，该用户不存在。')
      }
    } catch (error) {
      this.error(1, '登录错误', error)
    }
  }
}
