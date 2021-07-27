/*
 * @Author: 杨宏旋
 * @Date: 2020-07-22 12:09:12
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-07-27 10:13:38
 * @Description:
 */
const addUserRules = {
  name: 'string',
  email: 'email',
  passwd: 'string'
}
const userRules = {
  name: 'string',
  email: 'email',
  passwd: 'string',
  type: 'number'
}
const addProject = {
  name: 'string',
  domain: 'string'
}
export default {
  userRules,
  addUserRules,
  addProject
}
