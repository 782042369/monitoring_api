/*
 * @Author: 杨宏旋
 * @Date: 2020-07-22 11:19:38
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2020-07-22 11:54:27
 * @Description:
 */
const passwdReg = /[0-9A-Za-z]{8,16}$/
module.exports = (app) => {
  const { validator } = app
  // 添加自定义参数校验规则
  validator.addRule('passwdRule', (_rule, value) => {
    if (!passwdReg.test(value)) {
      return '密码应为8-16位数'
    }
  })
}
