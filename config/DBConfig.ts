/*
 * @Author: 杨宏旋
 * @Date: 2021-07-15 10:44:00
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-07-15 10:54:49
 * @Description:
 */
const { NODE_ENV } = process.env

export default {
  mongo_host: NODE_ENV === 'development' ? '1.116.160.128' : '127.0.0.1',
  mongo_port: 27017,
  mongo_user: 'root',
  mongo_pwd: 'oPt$Fv3qOJ',
}
