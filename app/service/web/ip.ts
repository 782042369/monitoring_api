/*
 * @Author: yanghongxuan
 * @Date: 2021-12-31 15:48:28
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-31 16:40:12
 * @Description:
 */
import IndexService from '../index'

export default class Index extends IndexService {
  // 定时更新应用中ip信息没有城市信息的数据
  async getNoCityByIpTask() {
    const datas = await this.ctx.model.Project.distinct('app_id')
      .read('sp')
      .exec()
    datas.forEach(async (appId) => {
      const ips = await this.models
        .WebEnvironment(appId)
        .find({
          ip: {
            $ne: '127.0.0.1'
          }
        })
        .lean()
      ips.forEach((ele) => this.getIpDataForIP_API(ele.ip, appId))
    })
  }
  // 124.64.16.112
  // 根据ip-api.com的api获得地址信息 (国内、国外都可以)
  async getIpDataForIP_API(ip, appId) {
    if (!ip || ip === '127.0.0.1') return
    try {
      const url = `http://demo.ip-api.com/json/${ip}?lang=zh-CN`
      const result = await this.app.curl(url, {
        dataType: 'json'
      })
      if (result.data.status === 'success') {
        const json = {
          province: result?.data?.regionName || '',
          city: result?.data?.city || '',
          country: result?.data?.country || ''
        }
        // 更新redis缓存
        this.app.redis.set(ip, JSON.stringify(json))
        // 更新用户地址信息
        await this.updateWebEnvironment(json, ip, appId)
      }
    } catch (err) {
      this.ctx.logger.info(`调用ip-api.com发现了错误${err}`)
    }
  }
  // 更新IP相关信息
  async updateWebEnvironment(data, ip, appId) {
    await this.models
      .WebEnvironment(appId)
      .updateMany(
        { ip },
        {
          province: data.province || '',
          city: data.city || '',
          country: data?.country || ''
        }
      )
      .exec()
  }
}
