/*
 * @Author: yanghongxuan
 * @Date: 2021-12-29 14:43:33
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-31 16:20:17
 * @Description:
 */

export default (app) => {
  return {
    schedule: {
      cron: app.config.pvuvip_task_day_time,
      type: 'worker',
      disable: !(app.config.is_web_task_run || app.config.is_wx_task_run),
      env: ['prod']
    },
    // 定时处pv，uv,ip统计信息 每分钟执行一次
    async task(ctx) {
      // 保证集群servers task不冲突
      const preminute = (await app.redis.get('pvuvip_task_day_time')) || ''
      const value =
        app.config.cluster.listen.ip + ':' + app.config.cluster.listen.port
      if (preminute && preminute !== value) return
      if (!preminute) {
        await app.redis.set('pvuvip_task_day_time', value, 'EX', 200000)
        const preminutetwo = await app.redis.get('pvuvip_task_day_time')
        if (preminutetwo !== value) return
      }
      if (app.config.is_web_task_run) {
        await ctx.service.web.pvuvipTask.getWebPvUvIpByDay()
      }
      // if (app.config.is_wx_task_run) {
      //   await ctx.service.pvuvipTask.getWxPvUvIpByMinute()
      // }
    }
  }
}
