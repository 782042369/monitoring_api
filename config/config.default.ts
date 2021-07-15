/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-spread */
/* eslint-disable array-bracket-spacing */
/*
 * @Author: 杨宏旋
 * @Date: 2020-07-20 17:11:50
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-07-15 10:55:36
 * @Description:
 */
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'
import * as path from 'path'
import BaseConfig from './BaseConfig'
import DBConfig from './DBConfig'

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
    dir: path.join(appInfo.baseDir, 'logs'),
  }
  config.logrotator = {
    maxFiles: 10, // pieces rotate by size
    maxDays: 7, // keep max days log files, default is `31`. Set `0` to keep all logs
  }
  // config.alinode = {
  //   // 从 `Node.js 性能平台` 获取对应的接入参数
  //   enable: true,
  //   appid: '85961',
  //   secret: '05c1bfc8dce430470476c006504d9d305caba647',
  // }
  config.cors = {
    origin: '*',
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  }
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    // domainWhiteList: ['http://localhost:8000'],
  }
  config.httpclient = {
    request: {
      // 默认 request 超时时间
      timeout: 300000000,
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
      maxFreeSockets: 256,
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
      maxFreeSockets: 256,
    },
  }
  config.security = {
    csrf: {
      enable: false,
      ignoreJson: true,
    },
    domainWhiteList: ['*'],
  }
  config.jwt = {
    secret: BaseConfig.secret,
  }
  config.validate = {
    convert: true,
    // validateRoot: false,
  }
  config.middleware = ['compress', 'error']
  config.error = {
    // 这里使用appInfo.env来判断环境，仅仅在非生产环境下打开堆栈信息，用于调试
    postFormat: (_e: any, { stack, ...rest }: any) =>
      appInfo.env === 'prod' ? rest : { stack, ...rest },
  }
  config.compress = {
    threshold: 1024, // body大于配置的threshold才会压缩
  }
  config.bodyParser = {
    enable: true,
    jsonLimit: '10mb',
  }
  config.multipart = {
    files: 50, // body大于配置的threshold才会压缩
    fields: 50, // body大于配置的threshold才会压缩
  }
  config.BaseCfg = {
    delete: 3,
  }
  config.mongoose = {
    clients: {
      User: {
        url: `mongodb://${DBConfig.mongo_host}:${DBConfig.mongo_port}/User?authSource=admin`,
        options: {
          user: DBConfig.mongo_user,
          pass: DBConfig.mongo_pwd,
        },
      },
    },
  }
  config.multipart = {
    mode: 'stream',
    fileSize: '100mb', // 接收文件大小
    fileExtensions: [''],
  }
  // config.oss = {
  //   // 这里需要的东西去自己的服务器里看，我用的阿里云
  //   client: {
  //     accessKeyId: 'LTAI4FxRVefjbj135e2U64Ca',
  //     accessKeySecret: 'Pl0fFapdG6xctDVpJyJgUcZDMl76O9',
  //     bucket: 'adx-creative',
  //     endpoint: 'http://oss-cn-beijing.aliyuncs.com',
  //     timeout: 300000000,
  //   },
  // }
  config.development = {
    // overrideDefault: true,
    // watchDirs: [
    //   '/app/controller',
    //   '/app/middleware',
    //   '/app/router',
    //   '/app/service',
    //   '/app/extend',
    //   '/app/model',
    //   '/app/schedule',
    //   '/app/types',
    //   '/app/public',
    //   '/app/schema',
    //   '/app/validate',
    //   '/config',
    // ],
    // ignoreDirs: ['/app/file'],
  }
  return {
    ...config,
  }
}
