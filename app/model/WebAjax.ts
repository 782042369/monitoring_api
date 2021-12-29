/*
 * @Author: yanghongxuan
 * @Date: 2021-12-24 10:02:09
 * @LastEditors: yanghongxuan
 * @LastEditTime: 2021-12-27 18:01:12
 * @Description:
 */
module.exports = (app: {
  mongoose: any
  mongooseDB: { get: (arg0: string) => any }
  models: { WebAjaxs: (appId: string) => any }
}) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const conn = app.mongooseDB.get('Report')

  const WebAjaxsSchema = new Schema(
    {
      app_id: { type: String }, // 所属系统ID
      url: { type: String }, // 访问的ajaxUrl
      speed_type: { type: Number }, // 访问速度类型 1：正常  2：慢
      method: { type: String }, // 资源请求方式
      duration: { type: Number, default: 0 }, // AJAX响应时间 单位：ms
      decoded_body_size: { type: Number, default: 0 }, // 返回字段大小  单位：B
      call_url: { type: String }, // 调用页面的URL
      mark_uv: { type: String }, // 统一uv标识
      selector: { type: String, default: '' }, // 选择器层级
      status: { type: Number }, // 请求状态
      device: {
        net: { type: String }, // 网络版本
        fingerprint: { type: String }, // 浏览器指纹
        browser: {
          name: { type: String, default: '' },
          version: { type: String, default: '' },
          major: { type: String, default: '' }
        },
        os: {
          name: { type: String, default: '' },
          version: { type: String, default: '' }
        }
      },
      created_time: { type: Date }
    },
    {
      versionKey: false,
      timestamps: { createdAt: false, updatedAt: false }
    }
  )

  WebAjaxsSchema.index({ speed_type: 1, url: 1, created_time: -1 })
  WebAjaxsSchema.index({ speed_type: 1, call_url: 1, created_time: -1 })

  app.models.WebAjaxs = (appId: string) => {
    return conn.model(`web_ajaxs_${appId}`, WebAjaxsSchema)
  }
}
