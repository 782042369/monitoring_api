/*
 * @Author: 杨宏旋
 * @Date: 2020-12-16 17:58:24
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-01-14 16:18:56
 * @Description:
 */
import * as math from 'mathjs'

type mathProps = number | string | boolean | null

export const add = (a: mathProps, b: mathProps) => {
  return Number(
    math.format(math.add(math.bignumber(a || 0), math.bignumber(b || 0)))
  )
}
// 减法
export const subtract = (a: mathProps, b: mathProps) => {
  return Number(
    math.format(math.subtract(math.bignumber(a || 0), math.bignumber(b || 0)))
  )
}

// 除法
export const multiply = (a: mathProps, b: mathProps) => {
  return Number(
    math.format(math.multiply(math.bignumber(a || 0), math.bignumber(b || 0)))
  )
}

// 加法
export const divide = (a: mathProps, b: mathProps) => {
  return Number(
    math.format(math.divide(math.bignumber(a || 0), math.bignumber(b || 0)))
  )
}
export default {
  add,
  subtract,
  multiply,
  divide,
}
