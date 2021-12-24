import { CategoryEnum, ErrorLevelEnum } from '../enum'
/*
 * @Author: 杨宏旋
 * @Date: 2020-07-23 16:47:19
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-22 17:17:01
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
