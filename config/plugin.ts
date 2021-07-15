/*
 * @Author: 杨宏旋
 * @Date: 2020-07-20 17:11:50
 * @LastEditors: 杨宏旋
 * @LastEditTime: 2021-07-15 10:55:29
 * @Description:
 */
import { EggPlugin } from 'egg'

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  helper: {
    enable: true,
    package: 'egg-helper',
  },
  aop: {
    enable: true,
    package: 'egg-aop',
  },
  controller: {
    enable: true,
    package: 'egg-controller',
  },
  // alinode: {
  //   enable: true,
  //   package: 'egg-alinode',
  // },
  logrotator: {
    enable: true,
    package: 'egg-logrotator',
  },
}

export default plugin
