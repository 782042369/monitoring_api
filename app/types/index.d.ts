/*
 * @Author: 杨宏旋
 * @Date: 2020-07-23 16:47:19
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-07-15 10:40:15
 * @Description:
 */
export interface ObjProps {
  [x: string]: any
}
export interface validateRuleType {
  addUserRules: ObjProps
  userRules: ObjProps
}
export interface ServicePageProps extends ObjProps {
  pageNo: number
  limit: number
}
