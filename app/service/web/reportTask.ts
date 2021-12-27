/*
 * @Author: yanghongxuan
 * @Date: 2021-12-24 10:37:24
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-27 14:26:06
 * @Description: 上报日志按应用级别做数据清洗
 */

import { Service } from 'egg'
import * as path from 'path'
import * as fs from 'fs'
import * as url from 'url'
import * as UAParser from 'ua-parser-js'
import { Context } from 'egg'
import * as mongoose from 'mongoose'
import { ReportInfoProps, ResourceListProps } from '../../types'

export default class Project extends Service {
  cacheIpJson: {
    [x: string]: { city: string; province: string }
  }
  cacheJson: {}
  cacheArr: string[]
  system: {}
  models: {
    [key: string]: (appid: string) => mongoose.Model<any>
  }
  constructor(params: Context<any>) {
    super(params)
    this.cacheJson = {}
    this.cacheIpJson = {}
    this.cacheArr = []
    this.system = {}
    // 缓存一次ip地址库信息
    this.ipCityFileCache()
    this.models = (this.app as any).models
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
        `-------------savaDataCleaningByDimension，定时每分钟清洗日志，查询数据库是否可用---一共有${datas.length}条数据-------`
      )
      // 储存数据
      this.commonSaveDatas(datas)
    } catch (err) {
      // this.models.restartMongodbs('', this.ctx, err)
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
        }
      }
    }
  }

  // 存储数据
  async saveDataToDb(data: any[]) {
    const { app } = this
    // 遍历数据
    try {
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
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
        const parser = new UAParser(item.user_agent)
        const result = parser.getResult()
        const { w, h, ...device } = item.device
        const processedData: ReportInfoProps = {
          type: item.type,
          app_id: item.app_id,
          ip: item.ip,
          markUser: item.mark_user || '',
          markUv: item.mark_uv,
          url: item.url,
          pre_url: item.pre_url,
          performance: item.performance,
          log_list: item.log_list,
          resource_list: item.resource_list,
          isFristIn: item.is_first_in,
          selector: item.selector,
          user_agent: item.user_agent,
          device: {
            browser: result.browser,
            os: result.os,
            w,
            h,
            ...device
          }
        }
        // 页面级别
        if (system.is_statisi_pages === 0 && querytype === 1) {
          await this.savePages(processedData, system.slow_page_time)
        }
        // 资源级别
        if (system.is_statisi_resource === 0 && querytype === 1) {
          this.forEachResources(processedData, system)
        }
        // 请求类日志
        if (system.is_statisi_ajax === 0 && querytype === 2) {
          await this.saveAjaxs(processedData, system.slow_ajax_time)
        }
        // 错误类日志
        if (system.is_statisi === 0 && [3, 4].includes(querytype)) {
          await this.saveErrors(processedData)
        }
        if (system.is_statisi_system === 0) {
          await this.saveEnvironment(processedData)
        }
        if (querytype) {
          await this.app.redis.set('web_task_begin_time', item.createdAt)
        }
      }
    } catch (error) {
      app.logger.error('saveDataToDb 数据错误', error)
    }
  }
  // 储存网页性能数据
  async savePages(item: ReportInfoProps, slowPageTime = 5) {
    const { app } = this
    try {
      const newurl = url.parse(item.url)
      const newName = `${newurl.protocol}//${newurl.host}${newurl.pathname}${
        newurl.hash ? newurl.hash : ''
      }`
      const pages = new (this.models.WebPages(item.app_id))()
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
        pages.is_first_in = item.isFristIn
        pages.mark_user = item.markUser
        pages.device = item.device
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
  forEachResources(
    data: ReportInfoProps,
    system: {
      is_statisi_resource: number
      slow_css_time: number
      slow_js_time: number
      slow_img_time: number
    }
  ) {
    if (!data?.resource_list || !data?.resource_list.length) return

    // 遍历所有资源进行存储
    data.resource_list.forEach(async (item) => {
      if (system.is_statisi_resource === 0) {
        await this.saveResours(data, item, system)
      }
    })
  }
  // // 存储ajax信息
  async saveAjaxs(data: ReportInfoProps, slowAjaxTime = 2) {
    const { logother } = data.log_list
    const newurl = url.parse(logother.path)
    const newName = newurl.protocol + '//' + newurl.host + newurl.pathname
    let duration = Math.abs(logother.duration || 0)
    if (duration > 60000) duration = 60000
    slowAjaxTime = slowAjaxTime * 1000
    const speedType = duration >= slowAjaxTime ? 2 : 1
    const ajaxs = new (this.models.WebAjaxs(data.app_id))()
    ajaxs.app_id = data.app_id
    ajaxs.mark_user = data.markUser
    ajaxs.selector = data.selector
    ajaxs.call_url = data.url
    ajaxs.device = data.device
    ajaxs.speed_type = speedType
    ajaxs.url = newName
    ajaxs.method = logother.method
    ajaxs.duration = duration
    ajaxs.decoded_body_size = logother.decodedBodySize
    ajaxs.status = logother.status
    await ajaxs.save()
  }

  // // 储存网页资源性能数据
  async saveResours(
    data: ReportInfoProps,
    item: ResourceListProps,
    system: {
      slow_css_time: number
      slow_js_time: number
      slow_img_time: number
    }
  ) {
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
    const resours = new (this.models.WebResource(data.app_id))()
    resours.app_id = data.app_id
    resours.url = item.name
    resours.call_url = data.url
    resours.speed_type = speedType
    resours.name = newName
    resours.duration = duration
    resours.method = item.method
    resours.decoded_body_size = item.decodedBodySize
    resours.next_hop_protocol = item.nextHopProtocol
    resours.mark_user = data.markUser
    await resours.save()
  }

  // 存储错误信息
  async saveErrors(data: ReportInfoProps) {
    if (!data?.log_list) return
    const errors = new (this.models.WebErrors(data.app_id))()
    errors.app_id = data.app_id
    errors.msg = data.log_list.errorstack
    errors.col = data.log_list.errorcol
    errors.line = data.log_list.errorline
    errors.call_url = data.url
    errors.mark_user = data.markUser
    errors.selector = data.selector
    errors.device = data.device
    await errors.save()
  }

  // //  储存用户的设备信息
  async saveEnvironment(data: ReportInfoProps) {
    const { app } = this

    const ip = data.ip

    if (!ip) return
    const copyipArr = ip.split('.')
    const copyip = `${copyipArr[0]}.${copyipArr[1]}.${copyipArr[2]}`
    let datas: {
      city: string
      province: string
    } = {
      city: '',
      province: ''
    }
    if (!data.ip || data.ip !== '127.0.0.1') {
      this.saveIpDatasInFile(copyip, {
        city: '',
        province: ''
      })
    } else if (this.cacheIpJson[copyip]) {
      datas = this.cacheIpJson[copyip]
    } else if (app.config.ip_redis_or_mongodb === 'redis') {
      // 通过reids获得用户IP对应的地理位置信息
      const info = await app.redis.get(copyip)

      if (info) {
        datas = JSON.parse(info)
        this.cacheIpJson[copyip] = datas
        this.saveIpDatasInFile(copyip, {
          city: datas.city,
          province: datas.province
        })
      }
    }

    const environment = new (this.models.WebEnvironment(data.app_id))()
    environment.app_id = data.app_id
    environment.url = data.url
    environment.mark_user = data.markUser
    environment.mark_uv = data.markUv
    environment.browser = data.device.browser.name || ''
    environment.borwser_version = data.device.browser.version || ''
    environment.system = data.device.os.name || ''
    environment.system_version = data.device.os.version || ''
    environment.system_w = data.device.w || 0
    environment.system_h = data.device.h || 0
    environment.system_net = data.device.net || ''
    environment.system_lan = data.device.lan || ''
    environment.ip = data.ip
    // 处理 127.0.0.1 请求 不做城市判断
    if (datas?.city) {
      environment.province = datas.province
      environment.city = datas.city
    }
    console.log('environment: ', environment)
    await environment.save()
  }
  // 缓存存到cache文件
  saveIpDatasInFile(copyip: string, json: { city: string; province: string }) {
    if (this.cacheIpJson[copyip]) return
    this.cacheIpJson[copyip] = json
    const filepath = path.resolve(
      __dirname,
      `../../cache/${this.app.config.ip_city_cache_file.web}`
    )
    const str = `"${copyip}":${JSON.stringify(json)},`
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fs.appendFile(filepath, str, { encoding: 'utf8' }, () => {})
  }
}
