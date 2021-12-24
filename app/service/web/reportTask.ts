/*
 * @Author: yanghongxuan
 * @Date: 2021-12-24 10:37:24
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-24 17:37:13
 * @Description: 上报日志按应用级别做数据清洗
 */

import { Service } from 'egg'
import * as path from 'path'
import * as fs from 'fs'
import * as url from 'url'
export default class Project extends Service {
  cacheIpJson: {
    [x: string]: { city: string; province: string }
  }
  cacheJson: {}
  cacheArr: never[]
  system: {}
  constructor(params) {
    super(params)
    this.cacheJson = {}
    this.cacheIpJson = {}
    this.cacheArr = []
    this.system = {}
    // 缓存一次ip地址库信息
    this.ipCityFileCache()
  }
  /**
   * 获取ip地址缓存
   */
  async ipCityFileCache() {
    this.cacheIpJson = {}
    try {
      const filepath = path.resolve(
        __dirname,
        '../../cache/web_ip_city_cache_file.txt'
      )
      const ipDatas = fs.readFileSync(filepath, { encoding: 'utf8' })
      const result = JSON.parse(`{${ipDatas.slice(0, -1)}}`)
      this.cacheIpJson = result
    } catch (err) {
      this.cacheIpJson = {}
    }
  }
  // 上报数据按维度做数据清洗
  public async savaDataCleaningByDimension() {
    const { ctx, app } = this
    let beginTime: any = await app.redis.get('web_task_begin_time')
    const endTime = new Date()
    const query: any = { createdAt: { $lt: endTime } }

    if (beginTime) {
      beginTime = new Date(new Date(beginTime).getTime() + 1000)
      query.createdAt.$gt = beginTime
    }
    /*
     * 请求数据库进行同步数据
     * 查询是否正常,不正常则重启
     */
    try {
      const datas = await ctx.model.WebReport.find(query)
        .read('sp')
        .sort({ createdAt: 1 })
        .exec()
      app.logger.info(
        `-------------savaDataCleaningByDimension 查询web端数据库是否可用---${datas.length}-------`
      )
      // 储存数据
      this.commonSaveDatas(datas)
    } catch (err) {
      // (app as any).models.restartMongodbs('', this.ctx, err)
    }
  }
  public async commonSaveDatas(datas: any[]) {
    const { app } = this
    // 开启多线程执行
    this.cacheJson = {}
    this.cacheArr = []
    if (datas && datas.length) {
      const length = datas.length
      const number = Math.ceil(length / app.config.report_thread)

      for (let i = 0; i < app.config.report_thread; i++) {
        const newSpit = datas.splice(0, number)
        if (datas.length) {
          this.saveDataToDb(newSpit)
        } else {
          this.saveDataToDb(newSpit)
        }
      }
    }
  }

  // 存储数据
  async saveDataToDb(data) {
    if (!data && !data.length) return

    // 遍历数据
    data.forEach(async (item) => {
      let system: any = {}
      // 做一次appId缓存
      if (this.cacheJson[item.app_id]) {
        system = this.cacheJson[item.app_id]
      } else {
        system = await this.service.project.handleGetOne({
          app_id: item.app_id
        })
        this.cacheJson[item.app_id] = system
      }

      // 是否禁用上报
      if (system.is_use !== 0) return

      const querytype = item.type || 1
      const processedData = await this.handleData({
        type: item.type,
        appId: item.app_id,
        ip: item.ip,
        markUser: item.mark_user || '',
        markUv: item.mark_uv,
        url: item.url,
        preUrl: item.pre_url,
        performance: item.performance,
        log_list: item.log_list,
        resource_list: item.resource_list,
        isFristIn: item.is_first_in,
        device: item.device,
        selector: item.selector
      })
      // 页面级别
      if (system.is_statisi_pages === 0 && querytype === 1) {
        await this.savePages(processedData, system.slow_page_time)
      }
      // // 资源级别
      if (system.is_statisi_resource === 0 && querytype === 1) {
        this.forEachResources(processedData, system)
      }
      // 请求类日志
      if (system.is_statisi_ajax === 0 && querytype === 2) {
        await this.saveAjaxs(processedData, system.slow_ajax_time)
      }
      // 错误类日志
      if (system.is_statisi === 0 || [3, 4].includes(querytype)) {
        await this.saveErrors(processedData)
      }
      // if (system.is_statisi_system === 0) {await this.saveEnvironment(processedData)}
      if (querytype) {
        await this.app.redis.set('web_task_begin_time', item.createdAt)
      }
    })
  }
  // 数据操作层
  async handleData(query) {
    const type = query.type || 1

    let item = {
      app_id: query.appId,
      ip: query.ip,
      mark_user: query.markUser || '',
      mark_uv: query.markUv || '',
      url: query.url,
      ...query
    }

    if (type === 1) {
      // 页面级性能
      item = Object.assign(item, {
        is_first_in: query.isFristIn ? 2 : 1,
        pre_url: query.preUrl,
        performance: query.performance
      })
    }
    return item
  }
  // 储存网页性能数据
  async savePages(item, slowPageTime = 5) {
    const { app } = this
    try {
      const newurl = url.parse(item.url)
      const newName = `${newurl.protocol}//${newurl.host}${newurl.pathname}${
        newurl.hash ? newurl.hash : ''
      }`
      const pages = (app as any).models.WebPages(item.app_id)()
      const performance = item.performance
      if (performance && performance?.loadPageTime > 0) {
        slowPageTime = slowPageTime * 1000
        const speedType = performance.loadPageTime >= slowPageTime ? 2 : 1
        // 算出页面资源大小
        let totalSize = 0
        const sourslist = item.resource_list || []
        for (let i = 0; i < sourslist.length; i++) {
          if (sourslist[i].decodedBodySize) {
            totalSize += sourslist[i].decodedBodySize
          }
        }

        pages.app_id = item.app_id
        pages.url = newName
        pages.pre_url = item.pre_url
        pages.is_first_in = item.is_first_in
        pages.mark_page = item.mark_page
        pages.mark_user = item.mark_user
        pages.total_res_size = totalSize
        pages.speed_type = speedType
        pages.resource_list = sourslist
        pages.load_time = performance.loadPageTime
        pages.dns_time = performance.dnsTime
        pages.tcp_time = performance.tcpTime
        pages.dom_time = performance.domReadyTime
        pages.white_time = performance.blankTime
        pages.redirect_time = performance.redirectTime
        pages.unload_time = performance.unloadTime
        pages.request_time = performance.reqTime
        pages.analysisDom_time = performance.analysisTime
        pages.ready_time = performance.radt
        await pages.save()
      }
    } catch (err) {
      app.logger.error('储存网页性能数据 savePages 错误 ', err)
    }
  }

  // // 根据资源类型存储不同数据
  forEachResources(data, system) {
    if (!data?.resource_list || !data?.resource_list.length) return

    // 遍历所有资源进行存储
    data.resource_list.forEach((item) => {
      if (system.is_statisi_resource === 0) {
        this.saveResours(data, item, system)
      }
    })
  }
  // // 存储ajax信息
  async saveAjaxs(data, slowAjaxTime = 2) {
    const { logother } = data.log_list
    const { app } = this
    const newurl = url.parse(logother.path)
    const newName = newurl.protocol + '//' + newurl.host + newurl.pathname
    let duration = Math.abs(logother.duration || 0)
    if (duration > 60000) duration = 60000
    slowAjaxTime = slowAjaxTime * 1000
    const speedType = duration >= slowAjaxTime ? 2 : 1
    const ajaxs = (app as any).models.WebAjaxs(data.app_id)()
    ajaxs.app_id = data.app_id
    ajaxs.mark_user = data.mark_user
    ajaxs.selector = data.selector
    ajaxs.call_url = data.url
    ajaxs.speed_type = speedType
    ajaxs.url = newName
    ajaxs.method = logother.method
    ajaxs.duration = duration
    ajaxs.decoded_body_size = logother.decodedBodySize
    ajaxs.status = logother.status
    await ajaxs.save()
  }

  // // 储存网页资源性能数据
  async saveResours(data, item, system) {
    const { app } = this
    let slowTime = 2
    let speedType = 1
    let duration = Math.abs(item.duration || 0)
    if (duration > 60000) duration = 60000

    if (item.initiatorType === 'link' || item.initiatorType === 'css') {
      slowTime = (system.slow_css_time || 2) * 1000
    } else if (item.initiatorType === 'script') {
      slowTime = (system.slow_js_time || 2) * 1000
    } else if (item.initiatorType === 'img') {
      slowTime = (system.slow_img_time || 2) * 1000
    } else {
      slowTime = 2 * 1000
    }

    speedType = duration >= slowTime ? 2 : 1
    // 是否考虑相关性能只存储慢资源
    // if (duration < slowTime) return

    const newurl = url.parse(item.name)
    const newName = newurl.protocol + '//' + newurl.host + newurl.pathname

    const resours = (app as any).models.WebResource(data.app_id)()
    resours.app_id = data.app_id
    resours.url = item.name
    resours.call_url = data.url
    resours.speed_type = speedType
    resours.name = newName
    resours.method = item.method
    resours.type = item.type
    resours.duration = duration
    resours.decoded_body_size = item.decodedBodySize
    resours.next_hop_protocol = item.nextHopProtocol
    resours.mark_user = data.mark_user
    await resours.save()
  }

  // 存储错误信息
  async saveErrors(data) {
    const { app } = this
    if (!data?.log_list) return
    const errors = (app as any).models.WebErrors(data.app_id)()
    errors.app_id = data.app_id
    errors.msg = data.log_list.errorstack
    errors.col = data.log_list.errorcol
    errors.line = data.log_list.errorline
    errors.call_url = data.url
    errors.mark_user = data.mark_user
    errors.selector = data.selector
    await errors.save()
  }

  // //  储存用户的设备信息
  // async saveEnvironment(data) {
  //   const result = parser.getResult()
  //   const ip = data.ip

  //   if (!ip) return
  //   let copyip = ip.split('.')
  //   copyip = `${copyip[0]}.${copyip[1]}.${copyip[2]}`
  //   let datas = null

  //   if (this.cacheIpJson[copyip]) {
  //     datas = this.cacheIpJson[copyip]
  //   } else if (app.config.ip_redis_or_mongodb === 'redis') {
  //     // 通过reids获得用户IP对应的地理位置信息
  //     datas = await app.redis.get(copyip)
  //     if (datas) {
  //       datas = JSON.parse(datas)
  //       this.cacheIpJson[copyip] = datas
  //       this.saveIpDatasInFile(copyip, {
  //         city: datas.city,
  //         province: datas.province
  //       })
  //     }
  //   } else if (app.config.ip_redis_or_mongodb === 'mongodb') {
  //     // 通过mongodb获得用户IP对应的地理位置信息
  //     datas = await this.ctx.model.IpLibrary.findOne({ ip: copyip })
  //       .read('sp')
  //       .exec()
  //     if (datas) {
  //       this.cacheIpJson[copyip] = datas
  //       this.saveIpDatasInFile(copyip, {
  //         city: datas.city,
  //         province: datas.province
  //       })
  //     }
  //   }

  //   const environment = (app as any).models.WebEnvironment(data.app_id)()
  //   environment.app_id = data.app_id
  //   environment.url = data.url
  //   environment.mark_user = data.mark_user
  //   environment.mark_uv = data.mark_uv
  //   environment.browser = result.browser.name || ''
  //   environment.borwser_version = result.browser.version || ''
  //   environment.system = result.os.name || ''
  //   environment.system_version = result.os.version || ''
  //   environment.ip = data.ip
  //   environment.county = data.county
  //   environment.province = data.province
  //   if (datas) {
  //     environment.province = datas.province
  //     environment.city = datas.city
  //   }
  //   await environment.save()
  // }
}
