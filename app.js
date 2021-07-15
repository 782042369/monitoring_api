/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * @Author: 杨宏旋
 * @Date: 2020-07-22 11:45:04
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2020-11-18 17:51:09
 * @Description:
 */
const path = require('path')

class AppBootHook {
  constructor(app) {
    this.app = app
    process.env.UV_THREADPOOL_SIZE = 256
  }

  // async didLoad() {}

  async willReady() {
    const directory = path.join(this.app.config.baseDir, 'app/validate')
    this.app.loader.loadToApp(directory, 'validate')
  }

  // async didReady() {}

  // async serverDidReady() {}
}

module.exports = AppBootHook
