/* eslint-disable space-before-function-paren */
/*
 * @Author: 杨宏旋
 * @Date: 2020-07-20 17:11:50
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-02-05 18:25:25
 * @Description:
 */
// import { Application } from 'egg'
// import UserRouter from './routes/UserRouter'
// import OperateLog from './routes/OperateLog'
// import StaticInfo from './routes/StaticInfo'
// import Stats from './routes/Stats'
// import Base from './routes/base'
// export default (app: Application) => {
//   // 用户 广告源 开发者 登陆
//   UserRouter(app)
//   // 日志
//   OperateLog(app)
//   // 流量调度  应用 广告位
//   StaticInfo(app)
//   // 填充监控  财务 实时报表
//   Stats(app)
//   // 公用
//   Base(app)
// }
/**
 * @param {Egg.Application} app - egg application
 */
import { Application, Context } from 'egg'
import 'reflect-metadata'
// import DocumentRouter from './router/document.router'
const CONTROLLER_PREFIX = ''
const methodMap = new Map()
const rootApiPath = ''

interface CurController {
  pathName: string
  fullPath: string
}
type methodNameProps = 'post' | 'get' | 'put' | 'delete'

/**
 * controller 装饰器，设置api公共前缀
 * @param pathPrefix {string}
 * @class
 */
export const SelfController = (pathPrefix?: string): ClassDecorator => (
  targetClass
): void => {
  // 在controller上定义pathPrefix的元数据
  // https://github.com/rbuckton/reflect-metadata
  Reflect.defineMetadata(CONTROLLER_PREFIX, pathPrefix, targetClass)
}
/**
 *
 * @param path 路径
 * @param requestMethod 请求方式
 * @param jwtFlag 是否开启jwt检测 1 开启 0 关闭
 */
export const methodWrap = (
  path: string,
  requestMethod: methodNameProps,
  jwtFlag = 1
): MethodDecorator => (target, methodName): void => {
  // 路由装饰器参数为空时，路由为方法名
  const key = path
    ? `${requestMethod}·${path}·${String(methodName)}·${jwtFlag}`
    : `${requestMethod}·${String(methodName)}·/${String(methodName)}·${jwtFlag}`
  methodMap.set(key, target)
}

export default (app: Application): void => {
  const { router, jwt } = app
  // 遍历methodMap， 注册路由
  methodMap.forEach((curController: CurController, configString: string) => {
    // 请求方法, 请求路径, 方法名
    const [requestMethod, path, methodName, jwtFlag] = configString.split('·')
    const wrap: (this: Context, ...args) => Promise<any> = async function (
      ...args
    ) {
      return new (curController.constructor as any)(this)[methodName](...args)
    }
    if (jwtFlag === '1') {
      // 注册路由
      router[requestMethod](rootApiPath + path, jwt, wrap)
    } else {
      // 注册路由 不用jwt校验
      router[requestMethod](rootApiPath + path, wrap)
    }
  })
  // // 其他路由
  // DocumentRouter(app)
  // router.post('/dingTalk', controller.message.dingTalkRobot)
}
