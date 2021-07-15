/*
 * @Author: 杨宏旋
 * @Date: 2020-12-25 17:56:04
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-07-15 11:31:26
 * @Description:
 */
export default {
  USERTYPE: {
    ROOT_USER: 0, // 超管
    DEV_USER: 1, // 开发
    PRODUCT_USER: 1, // 开发
  },
  APPTYPE: {
    PC: 1, // pc端
    H5: 2, // 移动端
    NATIVE: 3, // 原生端
    NODEJS: 4, // API端
  },
  STATUSTYPE: {
    ENABLE_TYPE: 1, // 停用
    DISABLE_TYPE: 2, // 启用
    DELETE_TYPE: 3, // 删除
  },
  secret: 'yunji123@$%&!',
}
