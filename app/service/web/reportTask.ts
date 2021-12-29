/*
 * @Author: yanghongxuan
 * @Date: 2021-12-24 10:37:24
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-29 10:31:04
 * @Description: 上报日志按应用级别做数据清 洗
 */

import IndexService from '../index'
import * as url from 'url'
import * as UAParser from 'ua-parser-js'
import { Context } from 'egg'
import { ReportInfoProps, ResourceListProps } from '../../types'

const MAP = new Map()
export default class Project extends IndexService {
  cacheIpJson: {
    [x: string]: { city: string; province: string }
  }
  cacheJson: {}
  cacheArr: string[]
  system: {}
  constructor(params: Context<any>) {
    super(params)
    this.cacheJson = {}
    this.cacheIpJson = {}
    this.cacheArr = []
    this.system = {}
  }
  // 上报数据按维度做数据清洗
  public async savaDataCleaningByDimension() {
    // 线程遍历
    const onecount = this.app.config.redis_consumption.thread_web
    for (let i = 0; i < onecount; i++) {
      this.saveDataToDb()
    }
  }

  // 存储数据
  async saveDataToDb() {
    const { app } = this
    // 遍历数据
    try {
      const query = await this.app.redis.rpop('web_repore_datas')
      if (!query) return
      const item = JSON.parse(query)
      let system: any = {}
      if (MAP.get(item.app_id)) {
        console.log(111, item.app_id)
        return
      }
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
        markUv: item.mark_uv || '',
        url: item.url,
        pre_url: item.pre_url,
        performance: item.performance,
        log_list: item.log_list,
        resource_list: item.resource_list,
        isFristIn: item.is_first_in,
        selector: item.selector,
        user_agent: item.user_agent,
        created_time: new Date(item.created_time),
        device: {
          browser: result.browser,
          os: result.os,
          w,
          h,
          ...device
        }
      }
      const arr: Promise<void>[] = []
      // 页面级别
      if (system.is_statisi_pages === 0 && querytype === 1) {
        arr.push(this.savePages(processedData, system.slow_page_time))
      }
      // 资源级别
      if (system.is_statisi_resource === 0 && querytype === 1) {
        arr.push(this.forEachResources(processedData, system))
      }
      // 请求类日志
      if (system.is_statisi_ajax === 0 && querytype === 2) {
        arr.push(this.saveAjaxs(processedData, system.slow_ajax_time))
      }
      // 错误类日志
      if (system.is_statisi === 0 && [3, 4].includes(querytype)) {
        arr.push(this.saveErrors(processedData))
      }
      if (system.is_statisi_system === 0) {
        arr.push(this.saveEnvironment(processedData))
      }
      // 存取
      await Promise.all(arr)
      MAP.delete(item.app_id)
    } catch (error) {
      app.logger.error('saveDataToDb 数据错误', error)
    }
  }
  // 储存网页性能数据
  async savePages(data: ReportInfoProps, slowPageTime = 5) {
    const { app } = this
    try {
      const newurl = url.parse(data.url)
      const newName = `${newurl.protocol}//${newurl.host}${newurl.pathname}${
        newurl.hash ? newurl.hash : ''
      }`
      const pages = new (this.models.WebPages(data.app_id))()
      const performance = data.performance
      if (performance && performance?.loadPageTime > 0) {
        slowPageTime = slowPageTime * 1000
        const speedType = performance.loadPageTime >= slowPageTime ? 2 : 1
        // 算出页面资源大小
        let totalSize = 0
        const sourslist = data.resource_list || []
        for (let i = 0; i < sourslist.length; i++) {
          if (sourslist[i].decodedBodySize) {
            totalSize += sourslist[i].decodedBodySize
          }
        }

        pages.app_id = data.app_id
        pages.url = newName
        pages.pre_url = data.pre_url
        pages.is_first_in = data.isFristIn
        pages.mark_uv = data.markUser || data.markUv
        pages.device = data.device
        pages.created_time = data.created_time
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
    } catch (error) {
      app.logger.error('储存网页性能数据 savePages 错误 ', error)
    }
  }

  //  存储ajax信息
  async saveAjaxs(data: ReportInfoProps, slowAjaxTime = 2) {
    const { app } = this
    try {
      const { logother } = data.log_list
      const newurl = url.parse(logother.path)
      const newName = newurl.protocol + '//' + newurl.host + newurl.pathname
      let duration = Math.abs(logother.duration || 0)
      if (duration > 60000) duration = 60000
      slowAjaxTime = slowAjaxTime * 1000
      const speedType = duration >= slowAjaxTime ? 2 : 1
      const ajaxs = new (this.models.WebAjaxs(data.app_id))()
      ajaxs.app_id = data.app_id
      ajaxs.mark_uv = data.markUser || data.markUv
      ajaxs.selector = data.selector
      ajaxs.call_url = data.url
      ajaxs.device = data.device
      ajaxs.created_time = data.created_time
      ajaxs.speed_type = speedType
      ajaxs.url = newName
      ajaxs.method = logother.method
      ajaxs.duration = duration
      ajaxs.decoded_body_size = logother.decodedBodySize
      ajaxs.status = logother.status
      await ajaxs.save()
    } catch (error) {
      app.logger.error('存储ajax信息 saveAjaxs 错误 ', error)
    }
  }
  // 根据资源类型存储不同数据
  async forEachResources(
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
    if (system.is_statisi_resource === 0) {
      const arr = data.resource_list.map((item) =>
        this.saveResours(data, item, system)
      )
      await Promise.all(arr)
    }
  }
  //  储存网页资源性能数据
  async saveResours(
    data: ReportInfoProps,
    item: ResourceListProps,
    system: {
      slow_css_time: number
      slow_js_time: number
      slow_img_time: number
    }
  ) {
    const { app } = this
    try {
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
      resours.call_url = data.url
      resours.created_time = data.created_time
      resours.mark_uv = data.markUser || data.markUv
      resours.speed_type = speedType
      resours.name = newName
      resours.duration = duration
      resours.url = item.name
      resours.method = item.method
      resours.decoded_body_size = item.decodedBodySize
      resours.next_hop_protocol = item.nextHopProtocol
      await resours.save()
    } catch (error) {
      app.logger.error('储存网页资源性能数据 saveResours 错误 ', error)
    }
  }

  // 存储错误信息
  async saveErrors(data: ReportInfoProps) {
    const { app } = this
    try {
      if (!data?.log_list) return
      const errors = new (this.models.WebErrors(data.app_id))()
      errors.app_id = data.app_id
      errors.msg = data.log_list.errorstack
      errors.col = data.log_list.errorcol
      errors.line = data.log_list.errorline
      errors.call_url = data.url
      errors.mark_uv = data.markUser || data.markUv
      errors.selector = data.selector
      errors.device = data.device
      await errors.save()
    } catch (error) {
      app.logger.error('储存网页资源性能数据 saveResours 错误 ', error)
    }
  }

  //   储存用户的设备信息
  async saveEnvironment(data: ReportInfoProps) {
    const { app } = this
    try {
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
        if (this.cacheIpJson[copyip]) {
          datas = this.cacheIpJson[copyip]
        } else {
          // 通过reids获得用户IP对应的地理位置信息
          const info = await app.redis.get(copyip)
          console.log('info: ', info)

          // if (info) {
          //   datas = JSON.parse(info)
          //   this.cacheIpJson[copyip] = datas
          // }
        }
      }

      const environment = new (this.models.WebEnvironment(data.app_id))()
      environment.app_id = data.app_id
      environment.url = data.url
      environment.mark_uv = data.markUser || data.markUv
      environment.browser = data.device.browser.name || ''
      environment.borwser_version = data.device.browser.version || ''
      environment.system = data.device.os.name || ''
      environment.system_version = data.device.os.version || ''
      environment.system_w = data.device.w || 0
      environment.system_h = data.device.h || 0
      environment.system_net = data.device.net || ''
      environment.system_lan = data.device.lan || ''
      environment.ip = data.ip
      environment.created_time = data.created_time
      // 处理 127.0.0.1 请求 不做城市判断
      if (datas?.city) {
        environment.province = datas.province
        environment.city = datas.city
      }
      await environment.save()
    } catch (error) {
      app.logger.error('储存用户的设备信息 saveEnvironment 错误 ', error)
    }
  }
}
