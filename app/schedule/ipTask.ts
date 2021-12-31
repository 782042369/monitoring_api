/*
 * @Author: yanghongxuan
 * @Date: 2021-12-29 14:43:33
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-31 16:20:13
 * @Description:
 */

export default (app) => {
  return {
    schedule: {
      cron: app.config.ip_task_time,
      type: 'worker',
      disable: !(app.config.is_web_task_run || app.config.is_wx_task_run),
      env: ['prod']
    },
    // 定时处pv，uv,ip统计信息 每分钟执行一次
    async task(ctx) {
      // 保证集群servers task不冲突
      if (app.config.is_web_task_run) {
        await ctx.service.web.ip.getNoCityByIpTask()
      }
      // if (app.config.is_wx_task_run) {
      //   await ctx.service.pvuvipTask.getWxPvUvIpByMinute()
      // }
    }
  }
}
