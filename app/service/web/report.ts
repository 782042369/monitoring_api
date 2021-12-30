/*
 * @Author: 杨宏旋
 * @Date: 2020-07-20 18:34:57
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-29 14:00:54
 * @Description:
 */
import IndexService from '../index'
import { CategoryEnum } from '../../enum/index'
import { ObjProps, ServicePageProps } from '../../types'

export default class Index extends IndexService {
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
            updated: -1
          })
          .skip((pageNo - 1) * limit)
          .limit(limit)
          .lean<ObjProps[]>()
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
          created: -1
        })
        .lean<ObjProps[]>()
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
  public async handleGetOne(query) {
    const { ctx } = this
    try {
      return await ctx.model.WebReport.findOne(query).lean<ObjProps>()
    } catch (error) {
      ctx.logger.info('WebReport handleGetOne error', error)
      return error
    }
  }
  /**
   * 新增上报记录
   */
  public async handleAddOne() {
    const { ctx, app } = this
    try {
      const { log, selector = null, device, ...query }: any = ctx.query
      const system: any = await this.service.project.handleGetOne({
        app_id: query.appID
      })
      if (system === undefined || system?.is_use !== 0) return {}
      const report: ObjProps = {}

      const logInfo = JSON.parse(log)
      if (query.category === CategoryEnum.RESOURCE) {
        // 资源加载
        report.type = 4
        report.log_list = logInfo
      } else if (
        query.category === CategoryEnum.AJAX ||
        query.category === CategoryEnum.CROSS_SCRIPT
      ) {
        // 请求日志上报
        report.type = 2
        report.log_list = logInfo
      } else if (query.category === CategoryEnum.PERFORMANCE) {
        // 性能上报
        const { resourceList, performance } = logInfo
        report.type = 1
        report.performance = performance
        report.resource_list = resourceList
      } else {
        // js 等其他代码
        report.type = 3
        report.log_list = logInfo
      }
      report.app_id = query.appID
      report.ip = query.ip
      report.mark_user = query.markUser
      report.mark_uv = query.markUv
      report.url = query.url || ctx.headers.referer
      report.pre_url = query.preUrl
      report.user_agent = ctx.headers['user-agent']
      report.is_first_in = query.first
      report.device = JSON.parse(device)
      report.selector = selector || ''
      report.created_time = new Date()
      if (app.config.redis_consumption.total_limit_web) {
        // 限流
        const length = await app.redis.llen('web_report_datas')
        if (length >= app.config.redis_consumption.total_limit_web) {
          return
        }
      }
      // 生产者
      app.redis.lpush('web_report_datas', JSON.stringify(report))
    } catch (error) {
      ctx.logger.info('WebReport handleAddOne error', error)
      return error
    }
  }
}
