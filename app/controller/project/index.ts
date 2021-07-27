/*
 * @Author: 杨宏旋
 * @Date: 2021-07-15 10:22:04
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-07-27 10:23:03
 * @Description:
 */
import BaseController from '../base/base'
import { SelfController, methodWrap } from '../../router'

@SelfController()
export default class ProductController extends BaseController {
  // 项目列表
  @methodWrap('/api/v1/project/list', 'get')
  public async list() {
    try {
      this.success(200, '项目列表查询成功')
    } catch (error) {
      this.error(500, `项目列表查询失败，${error}`, error)
    }
  }
  @methodWrap('/api/v1/project', 'post', 0)
  public async created() {
    const { ctx, validateRule, app } = this
    ctx.validate(validateRule.addProject, ctx.request.body)
    try {
      const { name, domain } = ctx.request.body
      const projectInfo = await ctx.service.project.handleGetOne({
        name,
        domain,
        status: {
          $ne: app.config.STATUSTYPE.DELETE_TYPE
        }
      })
      if (projectInfo) {
        this.error(500, `创建项目失败，${name}-${domain}已存在。`)
        return
      }
      ctx.request.body.app_id = this.randomAppIdString()
      const result = await ctx.service.project.handleAddOne()
      this.success(200, '创建项目成功', result)
    } catch (error) {
      ctx.logger.info('createdProject error: ', error)
      this.error(500, `创建项目失败，${error}`)
      return error
    }
  }
  @methodWrap('/api/v1/project', 'put')
  public async update() {
    try {
      this.success(200, '更新项目成功')
    } catch (error) {
      this.error(500, `更新项目失败，${error}`, error)
    }
  }
  @methodWrap('/api/v1/project', 'delete')
  public async delete() {
    try {
      this.success(200, '删除项目成功')
    } catch (error) {
      this.error(500, `删除项目失败，${error}`, error)
    }
  }
}
