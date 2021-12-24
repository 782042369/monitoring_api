/*
 * @Author: yanghongxuan
 * @Date: 2021-12-23 17:15:42
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-24 09:23:08
 * @Description:
 */
/*
 * @Author: 杨宏旋
 * @Date: 2020-07-20 18:34:57
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-23 17:07:00
 * @Description:
 */
import { Service } from 'egg'
// import { ObjProps, ServicePageProps } from '../../types'

export default class WebReport extends Service {
  /**
   * 用户列表
   * @param query 查询参数
   */
  // public async getAnOverviewOfTheTimePeriod(query: ServicePageProps) {
  //   const querydata = {
  //     create_time: { $gte: new Date(beginTime), $lt: new Date(endTime) }
  //   }
  //   const { ctx } = this
  //   try {
  //     return { pageList, count }
  //   } catch (error) {
  //     ctx.logger.info('WebReport handleGetList error', error)
  //     return error
  //   }
  // }
  // // pv
  // public async pv(appId, querydata) {
  //   return this.app.model.WebPages(appId).count(querydata).read('sp').exec()
  // }
  // // ajax
  // public async ajax(appId, querydata) {
  //     return this.app.models.WebAjaxs(appId).count(querydata).read('sp')
  //         .exec();
  // },
  // // uv
  // public async uv(appId, querydata) {
  //     return this.app.models.WebEnvironment(appId).aggregate([
  //         { $match: querydata },
  //         { $project: { mark_uv: true } },
  //         { $group: { _id: '$mark_uv' } },
  //         { $group: { _id: null, count: { $sum: 1 } } },
  //     ]).read('sp')
  //         .exec();
  // },
  // // ip
  // public async ip(appId, querydata) {
  //     return this.app.models.WebEnvironment(appId).aggregate([
  //         { $match: querydata },
  //         { $project: { ip: true } },
  //         { $group: { _id: '$ip' } },
  //         { $group: { _id: null, count: { $sum: 1 } } },
  //     ]).read('sp')
  //         .exec();
  // },
  // // user
  // public async user(appId, querydata) {
  //     return this.app.models.WebEnvironment(appId).aggregate([
  //         { $match: querydata },
  //         { $project: { mark_user: true } },
  //         { $group: { _id: '$mark_user' } },
  //         { $group: { _id: null, count: { $sum: 1 } } },
  //     ]).read('sp')
  //         .exec();
  // },
  // // 跳出率
  // public async bounce(appId, querydata) {
  //     const option = {
  //         map: function () { emit(this.mark_user, 1); }, // eslint-disable-line
  //         reduce: function (key, values) { return values.length == 1 }, // eslint-disable-line
  //         query: querydata,
  //         out: { replace: 'webjumpout' },
  //     };
  //     const res = await this.app.models.WebEnvironment(appId).mapReduce(option);
  //     const result = await res.model.find().where('value').equals(1)
  //         .count()
  //         .exec();
  //     return result;
  // },
  // // 流量消费
  // public async flow(appId, querydata) {
  //     const pagequery = Object.assign({}, querydata, { is_first_in: 2 });
  //     const pageflow = Promise.resolve(this.app.models.WebPages(appId).aggregate([
  //         { $match: pagequery },
  //         { $group: { _id: null, amount: { $sum: '$total_res_size' } } },
  //     ]).read('sp')
  //         .exec());
  //     const ajaxflow = Promise.resolve(this.app.models.WebAjaxs(appId).aggregate([
  //         { $match: querydata },
  //         { $group: { _id: null, amount: { $sum: '$decoded_body_size' } } },
  //     ]).read('sp')
  //         .exec());
  //     const data = await Promise.all([ pageflow, ajaxflow ]);
  //     const page_flow = data[0].length ? data[0][0].amount : 0;
  //     const ajax_flow = data[1].length ? data[1][0].amount : 0;
  //     return page_flow + ajax_flow;
  // }
}
