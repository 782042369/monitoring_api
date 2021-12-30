/*
 * @Author: yanghongxuan
 * @Date: 2021-12-24 10:34:41
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-30 10:19:47
 * @Description: 定时清洗日志
 */

export default (app) => {
  return {
    schedule: {
      cron: app.config.redis_consumption.task_time,
      type: 'worker' // 指定所有的 worker都需要执行
    },
    async task(ctx) {
      if (app.config.is_web_task_run || app.config.is_wx_task_run) {
        // 查询db是否正常,不正常则重启
        try {
          app.logger.info('-----------定时redis清洗日志-----------')

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
