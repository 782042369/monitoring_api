/*
 * @Author: 杨宏旋
 * @Date: 2021-07-15 10:22:04
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-07-15 10:30:22
 * @Description:
 */
import BaseController from '../base/base'
import { SelfController, methodWrap } from '../../router'

@SelfController()
export default class UserController extends BaseController {
  // 用户分页
  @methodWrap('/api/user/page', 'get')
  public async page() {}
  // 用户列表
  @methodWrap('/api/user/list', 'get')
  public async list() {}
  @methodWrap('/api/user', 'post')
  public async created() {}
  @methodWrap('/api/user/', 'put')
  public async update() {}
  @methodWrap('/api/user/list', 'delete')
  public async delete() {}
}
