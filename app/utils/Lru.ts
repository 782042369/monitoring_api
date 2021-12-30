/*
 * @Author: 杨宏旋
 * @Date: 2021-02-03 11:54:36
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-29 11:05:26
 * @Description: LRU 缓存
 */

class LRUCache {
  cache: Map<string, string | number | any>
  capacity: number
  constructor(capacity: number) {
    this.cache = new Map()
    this.capacity = capacity
  }

  get(key: string) {
    if (this.cache.has(key)) {
      // 存在即更新
      const temp = this.cache.get(key)
      this.cache.delete(key)
      this.cache.set(key, temp)
      return temp
    }
    return false
  }

  set(key: string, value: string | number | object) {
    if (this.cache.has(key)) {
      // 存在即更新（删除后加入）
      this.cache.delete(key)
    } else if (this.cache.size >= this.capacity) {
      // 不存在即加入
      // 缓存超过最大值，则移除最近没有使用的  也就是第一个数据
      this.cache.delete(this.cache.keys().next().value)
    }
    return this.cache.set(key, value)
  }
}
export default LRUCache
