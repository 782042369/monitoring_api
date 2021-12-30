/*
 * @Author: 杨宏旋
 * @Date: 2021-03-17 10:46:35
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-30 09:43:27
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
export const getStartDate = (date: any): Date => {
  const dater = date instanceof Date ? date : new Date(date || '')
  dater.setHours(0)
  dater.setMinutes(0)
  dater.setSeconds(0)
  dater.setMilliseconds(0)
  return dater
}

export const getEndDate = (date: any): Date => {
  const dater = date instanceof Date ? date : new Date(date || '')
  dater.setHours(23)
  dater.setMinutes(59)
  dater.setSeconds(59)
  dater.setMilliseconds(999)
  return dater
}
export const timeFormat = (date: Date, fmt: string) => {
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'H+': date.getHours() > 12 ? date.getHours() - 12 : date.getHours(),
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds() // 秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

export function converUnit(bytes: number): string {
  if (bytes === 0) {
    return '0 B'
  }
  const k = 1024, // or 1024
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toPrecision(3)} ${sizes[i < 0 ? 0 : i]}`
}
