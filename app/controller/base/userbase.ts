/*
 * @Author: 杨宏旋
 * @Date: 2021-07-15 10:25:59
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-07-15 12:44:50
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
    const pwdCode = this.md5(`${code}+${app.config.tail}`)
    return pwdCode
  }
}
