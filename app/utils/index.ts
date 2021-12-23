/*
 * @Author: 杨宏旋
 * @Date: 2021-03-17 10:46:35
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-22 16:29:02
 * @Description:
 */
export const handleTrend = (num: string | number, flag = true): string => {
  if (!num || num === 0) {
    return '0'
  }
  if (num === 1) {
    return `${(num * 100).toFixed(2)}%`
  }
  if (typeof num === 'number') {
    const val = flag ? num * 100 : num
    return `${val.toFixed(2)}%`
  }
  return '0'
}
/**
 *
 * @param {*} num 传入参数 千分位切割
 */
export const thousandthFormat = (num: number): string => {
  if (!num) {
    return '0'
  }
  let val = String(num)
  if (!val.includes('.')) {
    val += '.'
  }
  return val
    .replace(/(\d)(?=(\d{3})+\.)/g, (_$0, $1) => {
      return `${$1},`
    })
    .replace(/\.$/, '')
}
export const randomString = (len = 7) => {
  len = len || 7
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const maxPos = $chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd + Date.now()
}
