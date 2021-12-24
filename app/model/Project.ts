/*
 * @Author: 杨宏旋
 * @Date: 2021-07-22 14:45:20
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-24 14:44:22
 * @Description:
 */
import { MongooseTypes } from './types'

module.exports = (app: MongooseTypes) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const conn = app.mongooseDB.get('Report')
  const ProjectSchema = new Schema(
    {
      domain: { type: String }, // 系统 域名
      name: { type: String }, // 系统名称
      app_id: { type: String }, // 系统appId标识
      type: { type: String, default: 'web' }, // 浏览器：web 微信小程序 ：wx
      create_user_id: { type: Array }, // 应用创建用户ID
      is_use: { type: Number, default: 0 }, // 是否需要统计 0：是 1：否
      slow_page_time: { type: Number, default: 5 }, // 页面加载页面阀值 单位：s
      slow_js_time: { type: Number, default: 2 }, // js慢资源阀值 单位：s
      slow_css_time: { type: Number, default: 2 }, // 慢加载css资源阀值 单位：S
      slow_img_time: { type: Number, default: 2 }, // 慢图片加载资源阀值 单位:S
      slow_ajax_time: { type: Number, default: 2 }, // AJAX加载阀值
      is_statisi_pages: { type: Number, default: 0 }, // 是否统计页面性能信息 0：是 1：否
      is_statisi_ajax: { type: Number, default: 0 }, // 是否统计页面Ajax性能资源 0：是 1：否
      is_statisi_resource: { type: Number, default: 0 }, // 是否统计页面加载资源性能信息 0：是 1：否
      is_statisi_system: { type: Number, default: 0 }, // 是否存储用户系统信息资源信息 0：是 1：否
      is_statisi: { type: Number, default: 0 }, // 是否上报页面错误信息 0：是 1：否
      is_daily_use: { type: Number, default: 0 }, // 是否发送日报 0：是 1：否
      daliy_list: { type: Array, default: [] }, // 日报列表
      is_highest_use: { type: Number, default: 0 }, // 是否发送pv邮件 0：是 1：否
      highest_list: { type: Array, default: [] }, // 突破历史pv峰值时发送邮件列表
      status: { type: Number, default: 1 } // 1 启用 2 停用 3 删除
    },
    {
      versionKey: false,
      timestamps: { createdAt: true, updatedAt: true }
    }
  )

  ProjectSchema.index({
    app_id: 1,
    type: 1
  })

  return conn.model('Project', ProjectSchema, 'project')
}
