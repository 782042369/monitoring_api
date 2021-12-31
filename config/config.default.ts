/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-spread */
/* eslint-disable array-bracket-spacing */
/*
 * @Author: 杨宏旋
 * @Date: 2020-07-20 17:11:50
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-31 14:12:07
 * @Description:
 */
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'
import * as path from 'path'
import BaseConfig from './BaseConfig'

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>
  config.outputJSON = true
  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1595236305675_8856'
  // config.cluster = {
  //   listen: {
  //     port: 7070,
  //     hostname: '127.0.0.1',
  //   },
  // }
  config.logger = {
    // encoding: 'gbk',
    outputJSON: true,
    dir: path.join(appInfo.baseDir, 'logs')
  }
  // config.logrotator = {
  //   maxFiles: 10, // pieces rotate by size
  //   maxDays: 7 // keep max days log files, default is `31`. Set `0` to keep all logs
  // }
  // config.alinode = {
  //   // 从 `Node.js 性能平台` 获取对应的接入参数
  //   enable: true,
  //   appid: '85961',
  //   secret: '05c1bfc8dce430470476c006504d9d305caba647',
  // }
  config.cors = {
    origin: (ctx) => ctx.get('origin'),
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['http://localhost:3000']
  }
  config.httpclient = {
    request: {
      // 默认 request 超时时间
      timeout: 300000000
    },
    httpAgent: {
      // 默认开启 http KeepAlive 功能
      keepAlive: true,
      // 空闲的 KeepAlive socket 最长可以存活
      freeSocketTimeout: 300000000,
      // 当 socket 超过 都没有任何活动，就会被当作超时处理掉
      timeout: 300000000,
      // 允许创建的最大 socket 数
      maxSockets: Number.MAX_SAFE_INTEGER,
      // 最大空闲 socket 数
      maxFreeSockets: 256
    },

    httpsAgent: {
      // 默认开启 https KeepAlive 功能
      keepAlive: true,
      // 空闲的 KeepAlive socket 最长可以存活
      freeSocketTimeout: 300000000,
      // 当 socket 超过 都没有任何活动，就会被当作超时处理掉
      timeout: 300000000,
      // 允许创建的最大 socket 数
      maxSockets: Number.MAX_SAFE_INTEGER,
      // 最大空闲 socket 数
      maxFreeSockets: 256
    }
  }
  config.security = {
    csrf: {
      enable: false,
      ignoreJson: true
    },
    domainWhiteList: ['*']
  }
  config.jwt = {
    secret: BaseConfig.secret
  }
  config.validate = {
    convert: true
    // validateRoot: false,
  }
  config.middleware = ['compress', 'error']
  config.error = {
    // 这里使用appInfo.env来判断环境，仅仅在非生产环境下打开堆栈信息，用于调试
    postFormat: (_e: any, { stack, ...rest }: any) =>
      appInfo.env === 'prod' ? rest : { stack, ...rest }
  }
  config.compress = {
    threshold: 1024 // body大于配置的threshold才会压缩
  }
  config.bodyParser = {
    enable: true,
    jsonLimit: '10mb'
  }
  config.multipart = {
    files: 50, // body大于配置的threshold才会压缩
    fields: 50 // body大于配置的threshold才会压缩
  }
  config.BaseCfg = {
    delete: 3
  }

  config.multipart = {
    mode: 'stream',
    fileSize: '1024mb', // 接收文件大小
    fileExtensions: ['']
  }
  config.APPTYPE = BaseConfig.APPTYPE
  config.USERTYPE = BaseConfig.USERTYPE
  config.STATUSTYPE = BaseConfig.STATUSTYPE
  // 执行pvuvip定时任务的时间间隔 每2分钟定时执行一次 (可更改)
  config.pvuvip_task_minute_time = '0 */2 * * * *'
  // 执行pvuvip定时任务的时间间隔 每天定时执行一次
  config.pvuvip_task_day_time = '0 0 0 */1 * *'
  // 执行ip地理位置转换的定时任务 每分钟定时执行一次
  config.ip_task_time = '0 */1 * * * *'
  // 信息数据清洗
  config.report_task_time = '0 */1 * * * *'
  // web浏览器端定时任务是否执行
  config.is_web_task_run = true
  // wx小程序端定时任务是否执行
  config.is_wx_task_run = false
  // 上报线程
  config.report_thread = 10

  config.redis_consumption = {
    // 定时任务执行时间
    task_time: '*/20 * * * * *',
    // 每次定时任务消费线程数(web端)
    thread_web: 200,
    // 消息队列池限制数, 0：不限制 number: 限制条数，高并发时服务优雅降级方案
    total_limit_web: 10000
  }
  // top数据分析提取前N条配置
  config.top_alalysis_size = {
    web: 10,
    wx: 10
  }
  return {
    ...config
  }
}
