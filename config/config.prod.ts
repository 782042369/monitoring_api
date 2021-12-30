/*
 * @Author: 杨宏旋
 * @Date: 2020-11-16 12:07:28
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-30 17:04:33
 * @Description:
 */
import { EggAppConfig, PowerPartial } from 'egg'
import DBConfig from './DBConfig'

export default () => {
  const config: PowerPartial<EggAppConfig> = {}
  // redis配置
  config.redis = {
    client: {
      port: DBConfig.redis_port_prod, // Redis port
      host: DBConfig.redis_host_prod, // Redis host
      password: '',
      db: 0
    }
  }
  config.mongoose = {
    clients: {
      Report: {
        url: `mongodb://${DBConfig.mongo_host_prod}:${DBConfig.mongo_port_prod}/Report?authSource=admin`,
        options: {
          user: DBConfig.mongo_user_prod,
          pass: DBConfig.mongo_pwd_prod
        }
      }
    }
  }
  return config
}
