/*
 * @Author: yanghongxuan
 * @Date: 2021-12-24 10:34:41
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-24 17:37:11
 * @Description: 定时清洗日志
 */

export default (app) => {
  return {
    schedule: {
      cron: app.config.pvuvip_task_minute_time,
      type: 'worker' // 指定所有的 worker都需要执行
    },
    async task(ctx) {
      if (app.config.is_web_task_run || app.config.is_wx_task_run) {
        // 查询db是否正常,不正常则重启
        try {
          const result = await ctx.model.Project.count({}).exec()
          app.logger.info(
            `-----------定时清洗日志查询数据库是否可用----${result}------`
          )

          if (app.config.is_web_task_run) {
            ctx.service.web.reportTask.savaDataCleaningByDimension()
          }
          // if (app.config.is_wx_task_run) {
          //   ctx.service.wx.reportTask.saveWxReportDatasForMongodb()
          // }
        } catch (err) {
          // app.restartMongodbs('', ctx, err)
        }
      }
    }
  }
}
