/* eslint-disable @typescript-eslint/indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable object-shorthand */
/* eslint-disable newline-per-chained-call */
import { ObjProps } from './../../types/index.d'
/* eslint-disable indent */
import { getEndDate, getStartDate } from '../../utils'
import IndexService from '../index'
declare function emit(k, v)

export default class Index extends IndexService {
  // 用户漏斗分析列表
  async getAnalysislist(appId, beginTime, endTime, ip, pageNo, pageSize) {
    pageNo = pageNo * 1
    pageSize = pageSize * 1

    const query: ObjProps = { $match: {} }
    if (ip) query.$match.ip = ip
    if (beginTime && endTime) {
      query.$match.created_time = {
        $gte: new Date(beginTime),
        $lte: new Date(endTime)
      }
    }

    return ip
      ? await this.oneThread(appId, query, pageNo, pageSize)
      : await this.moreThread(
          appId,
          beginTime,
          endTime,
          query,
          pageNo,
          pageSize
        )
  }

  // 平均求值数多线程
  async moreThread(appId, beginTime, endTime, queryjson, pageNo, pageSize) {
    const result: any[] = []
    let distinct =
      (await this.models
        .WebEnvironment(appId)
        .distinct('mark_uv', queryjson.$match)
        .exec()) || []
    const copdistinct = distinct

    const betinIndex = (pageNo - 1) * pageSize
    if (distinct && distinct.length) {
      distinct = distinct.slice(betinIndex, betinIndex + pageSize)
    }
    const resolvelist: Promise<any>[] = []
    for (let i = 0, len = distinct.length; i < len; i++) {
      resolvelist.push(
        Promise.resolve(
          this.models
            .WebEnvironment(appId)
            .aggregate([
              {
                $match: {
                  mark_uv: distinct[i],
                  created_time: {
                    $gte: new Date(beginTime),
                    $lte: new Date(endTime)
                  }
                }
              },
              {
                $group: {
                  _id: {
                    ip: '$ip',
                    markuser: '$mark_uv',
                    browser: '$browser',
                    system: '$system'
                  }
                }
              }
            ])
            .read('sp')
            .exec()
        )
      )
    }
    const all = (await Promise.all(resolvelist)) || []
    all.forEach((item) => {
      result.push(item[0])
    })

    return {
      datalist: result,
      totalNum: copdistinct.length,
      pageNo
    }
  }

  // 单个api接口查询平均信息
  async oneThread(appId, queryjson, pageNo, pageSize) {
    const count = Promise.resolve(
      this.models
        .WebEnvironment(appId)
        .distinct('mark_uv', queryjson.$match)
        .exec()
    )
    const datas = Promise.resolve(
      this.models
        .WebEnvironment(appId)
        .aggregate([
          queryjson,
          {
            $group: {
              _id: {
                ip: '$ip',
                markuser: '$mark_uv',
                browser: '$browser',
                system: '$system'
              }
            }
          },
          { $skip: (pageNo - 1) * pageSize },
          { $sort: { count: -1 } },
          { $limit: pageSize }
        ])
        .read('sp')
        .exec()
    )
    const all = await Promise.all([count, datas])
    const [totalNum, datalist] = all

    return {
      datalist,
      totalNum: totalNum.length,
      pageNo
    }
  }

  // 单个用户行为轨迹列表
  async getAnalysisOneList(appId, markuser) {
    return (
      (await this.models
        .WebEnvironment(appId)
        .find({ mark_uv: markuser })
        .read('sp')
        .sort({ created_time: 1 })
        .exec()) || {}
    )
  }

  // TOP datas
  async getTopDatas(appId, beginTime, endTime, type) {
    type = type * 1
    let result = {}
    if (type === 1) {
      const pages = Promise.resolve(
        this.getRealTimeTopPages(appId, beginTime, endTime)
      )
      const jump = Promise.resolve(
        this.getRealTimeTopJumpOut(appId, beginTime, endTime)
      )
      const browser = Promise.resolve(
        this.getRealTimeTopBrowser(appId, beginTime, endTime)
      )
      const province = Promise.resolve(
        this.getRealTimeTopProvince(appId, beginTime, endTime)
      )
      const all = await Promise.all([pages, jump, browser, province])
      result = {
        top_pages: all[0],
        top_jump_out: all[1],
        top_browser: all[2],
        provinces: all[3]
      }
    } else if (type === 2) {
      result = (await this.getDbTopAnalysis(appId, beginTime, endTime)) || {}
    }
    return result
  }

  // 历史 top
  async getDbTopAnalysis(appId, beginTime, endTime) {
    const data = await this.ctx.model.WebStatis.findOne({
      app_id: appId,
      created_time: { $gte: new Date(beginTime), $lte: new Date(endTime) }
    })
      .lean()
      .read('sp')
      .exec()
    if (data) return data
    // 不存在则储存
    return await this.saveRealTimeTopTask(appId, 2, beginTime, endTime)
  }

  // top 页面
  async getRealTimeTopPages(appId, beginTime, endTime) {
    let result = await this.app.redis.get(`${appId}_top_pages_realtime`)
    result = result
      ? JSON.parse(result)
      : await this.getRealTimeTopPagesForDb(appId, beginTime, endTime)
    return result
  }
  async getRealTimeTopPagesForDb(appId, beginTime, endTime, type?: number) {
    try {
      const result = await this.models
        .WebPages(appId)
        .aggregate([
          {
            $match: {
              created_time: {
                $gte: new Date(beginTime),
                $lte: new Date(endTime)
              }
            }
          },
          {
            $group: {
              _id: { url: '$url' },
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } },
          { $limit: this.app.config.top_alalysis_size.web || 10 }
        ])
        .read('sp')
        .exec()

      // 每分钟执行存储到redis
      if (type === 1) {
        this.app.redis.set(
          `${appId}_top_pages_realtime`,
          JSON.stringify(result)
        )
      }
      return result
    } catch (err) {
      console.error(err)
    }
  }

  // top跳出率
  async getRealTimeTopJumpOut(appId, beginTime, endTime) {
    let result = await this.app.redis.get(`${appId}_top_jump_out_realtime`)
    result = result
      ? JSON.parse(result)
      : await this.getRealTimeTopJumpOutForDb(appId, beginTime, endTime)
    return result
  }
  async getRealTimeTopJumpOutForDb(appId, beginTime, endTime, type?: number) {
    try {
      const res = await this.models.WebEnvironment(appId).mapReduce({
        map: function () {
          emit((this as any).mark_uv, (this as any).url)
        },
        // eslint-disable-next-line space-before-function-paren
        reduce: function (_key, values) {
          return values.length === 1
        },
        query: {
          created_time: { $gte: new Date(beginTime), $lte: new Date(endTime) }
        },
        out: { replace: 'collectionName' }
      })
      const result = await res.model
        .aggregate([
          { $match: { value: { $ne: false } } },
          {
            $group: {
              _id: { value: '$value' },
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } },
          { $limit: this.app.config.top_alalysis_size.web || 10 }
        ])
        .exec()
      if (type === 1) {
        this.app.redis.set(
          `${appId}_top_jump_out_realtime`,
          JSON.stringify(result)
        )
      }
      return result
    } catch (err) {
      console.error(err)
    }
  }

  // top浏览器排行
  async getRealTimeTopBrowser(appId, beginTime, endTime) {
    let result = await this.app.redis.get(`${appId}_top_browser_realtime`)
    result = result
      ? JSON.parse(result)
      : await this.getRealTimeTopBrowserForDb(appId, beginTime, endTime)
    return result
  }
  async getRealTimeTopBrowserForDb(appId, beginTime, endTime, type?: number) {
    try {
      const result = await this.models
        .WebEnvironment(appId)
        .aggregate([
          {
            $match: {
              created_time: {
                $gte: new Date(beginTime),
                $lte: new Date(endTime)
              }
            }
          },
          {
            $group: {
              _id: { browser: '$browser' },
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } },
          { $limit: this.app.config.top_alalysis_size.web || 10 }
        ])
        .read('sp')
        .exec()

      // 每分钟执行存储到redis
      if (type === 1) {
        this.app.redis.set(
          `${appId}_top_browser_realtime`,
          JSON.stringify(result)
        )
      }
      return result
    } catch (err) {
      console.error(err)
    }
  }

  // top省市排行榜
  async getRealTimeTopProvince(appId, beginTime, endTime, type = 1) {
    let result = await this.app.redis.get(`${appId}_top_province_realtime`)
    result =
      result && type === 1
        ? JSON.parse(result)
        : await this.getRealTimeTopProvinceForDb(
            appId,
            beginTime,
            endTime,
            type
          )
    return result
  }
  async getRealTimeTopProvinceForDb(appId, beginTime, endTime, type?: number) {
    try {
      const result = await this.models
        .WebEnvironment(appId)
        .aggregate([
          {
            $match: {
              created_time: {
                $gte: new Date(beginTime),
                $lte: new Date(endTime)
              }
            }
          },
          {
            $group: {
              _id: { province: '$province' },
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } },
          { $limit: this.app.config.top_alalysis_size.web || 10 }
        ])
        .read('sp')
        .exec()

      // 每分钟执行存储到redis
      if (type === 1) {
        this.app.redis.set(
          `${appId}_top_province_realtime`,
          JSON.stringify(result)
        )
      }
      return result
    } catch (err) {
      console.error(err)
    }
  }

  // top排行榜 Task任务
  async saveRealTimeTopTask(appId, type, begin, end) {
    try {
      let beginTime = begin
      let endTime = end
      if (type === 1) {
        beginTime = getStartDate(new Date())
        endTime = getEndDate(new Date())
      }
      const pages = Promise.resolve(
        this.getRealTimeTopPagesForDb(appId, beginTime, endTime, type)
      )
      const jump = Promise.resolve(
        this.getRealTimeTopJumpOutForDb(appId, beginTime, endTime, type)
      )
      const browser = Promise.resolve(
        this.getRealTimeTopBrowserForDb(appId, beginTime, endTime, type)
      )
      const province = Promise.resolve(
        this.getRealTimeTopProvinceForDb(appId, beginTime, endTime, type)
      )
      this.getRealTimeTopPvUvIpAjax(appId, beginTime, endTime)

      if (type === 2) {
        // 每天数据存储到数据库
        const all = await Promise.all([pages, jump, browser, province])
        const [toppages, topjumpout, topbrowser, provinces] = all

        const statis = new this.ctx.model.WebStatis()
        statis.app_id = appId
        statis.top_pages = toppages
        statis.top_jump_out = topjumpout
        statis.top_browser = topbrowser
        statis.provinces = provinces
        statis.created_time = beginTime
        const result = await statis.save()

        // 触发日报邮件
        // this.ctx.service.web.sendEmail.getDaliyDatas(
        //   {
        //     appId,
        //     toppages,
        //     topjumpout,
        //     topbrowser,
        //     provinces
        //   },
        //   'toplist'
        // )

        return result
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 定时获得实时流量统计
  async getRealTimeTopPvUvIpAjax(appId, beginTime, endTime) {
    const query = {
      created_time: { $gte: new Date(beginTime), $lt: new Date(endTime) }
    }
    const pvpro = Promise.resolve(this.ctx.service.web.pvuvip.pv(appId, query))
    const uvpro = Promise.resolve(this.ctx.service.web.pvuvip.uv(appId, query))
    const ippro = Promise.resolve(this.ctx.service.web.pvuvip.ip(appId, query))
    const ajpro = Promise.resolve(
      this.ctx.service.web.pvuvip.ajax(appId, query)
    )
    const flpro = Promise.resolve(
      this.ctx.service.web.pvuvip.flow(appId, query)
    )
    const data = await Promise.all([pvpro, uvpro, ippro, ajpro, flpro])

    const pv = data[0] || 0
    const uv = data[1].length ? data[1][0].count : 0
    const ip = data[2].length ? data[2][0].count : 0
    const ajax = data[3] || 0
    const flow = data[4] || 0
    this.app.redis.set(
      `${appId}_pv_uv_ip_realtime`,
      JSON.stringify({ pv, uv, ip, ajax, flow })
    )
  }

  // 省份流量统计
  async getProvinceAvgCount(appId, beginTime, endTime, type) {
    if (type) type = type * 1
    if (type === 1) {
      let res = await this.app.redis.get(`${appId}_top_province_realtime`)
      res = res
        ? JSON.parse(res)
        : await this.getRealTimeTopProvinceForDb(appId, beginTime, endTime)
      return { provinces: res }
    } else if (type === 2) {
      return await this.getDbTopAnalysis(appId, beginTime, endTime)
    }
  }
}
