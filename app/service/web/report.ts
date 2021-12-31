/*
 * @Author: 杨宏旋
 * @Date: 2020-07-20 18:34:57
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-31 15:49:46
 * @Description:
 */
import IndexService from '../index'
import { CategoryEnum } from '../../enum/index'
import { ObjProps } from '../../types'

/**
 * 参数说明
 *  app_id: { type: String }, // 系统标识
    user_agent: { type: String }, // 用户浏览器信息标识
    ip: { type: String }, // 用户ip
    mark_user: { type: String }, // 统一用户标识
    mark_uv: { type: String }, // 统一uv标识
    url: { type: String }, // 访问url
    pre_url: { type: String, default: '' }, // 上一页面来源
    performance: { type: Mixed, default: {} }, // 用户浏览器性能数据
    log_list: { type: Mixed, default: {} }, // 日志信息列表
    resource_list: { type: Mixed, default: [] }, // 资源性能数据列表
    device: {
      w: { type: Number }, // 屏幕宽度
      h: { type: Number }, // 屏幕高度
      lan: { type: String }, // 语言版本
      net: { type: String }, // 网络版本
      orientation: { type: String }, // 横屏竖屏
      fingerprint: { type: String } // 浏览器指纹
    },
    type: { type: Number }, // 1：网页性能上报  2：ajax上报 3：js异常 4：资源加载日志
    selector: { type: String, default: '' }, // 选择器层级
    is_first_in: { type: Number } // 首次进入 1:是 0:不是
 */
export default class Index extends IndexService {
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
