/*
 * @Author: 杨宏旋
 * @Date: 2020-07-23 16:47:19
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-07-15 12:33:46
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
