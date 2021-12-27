import { CategoryEnum, ErrorLevelEnum } from '../enum'
/*
 * @Author: 杨宏旋
 * @Date: 2020-07-23 16:47:19
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-27 13:52:25
 * @Description:
 */
export interface ObjProps {
  [x: string]: any
}
export interface validateRuleType {
  addUserRules: {
    name: string
    email: string
    passwd: string
  }
  addProject: {
    domain: string
    name: string
  }
}
export interface ServicePageProps extends ObjProps {
  pageNo: number
  limit: number
}
export interface UserInfoProps {
  name: string
  email: string
  passwd: string
  passwd2: string
  type: number
  projectid: string[] // 可见项目id
}

export interface ReportProps {
  category: CategoryEnum
  level: ErrorLevelEnum
  deviceInfo: string
  appID: string
  time?: number
  url: string
  logInfo: string
  markUser: string
  markUv: string
  selector?: string
}
export interface ResourceListProps {
  duration: number
  initiatorType: string
  name: string
  method: string
  decodedBodySize: number
  nextHopProtocol: string
  redirectTime: string
  dnsTime: string
  tcpTime: string
  ttfbTime: string
  responseTime: string
  reqTotalTime: string
}
export interface ReportInfoProps {
  type: number
  app_id: string
  ip: string
  markUser: string
  markUv: string
  url: string
  pre_url: string
  performance: { [x: string]: string | number }
  isFristIn: number
  user_agent: string
  resource_list: ResourceListProps[]
  selector: string
  log_list: {
    logother: {
      method: string
      logotherL: ObjProps
      decodedBodySize: number
      duration: number
      status: number
      path: string
    }
    [x: string]: string | number
  }
  device: {
    w: number
    h: number
    browser: UAParser.IBrowser
    os: UAParser.IOS
    lan: string
    net: string
    orientation: string
    fingerprint: string
  }
}
