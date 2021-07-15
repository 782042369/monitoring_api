// This file is created by egg-ts-helper@1.25.9
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBaseBase from '../../../app/controller/base/base';
import ExportBaseUserbase from '../../../app/controller/base/userbase';
import ExportUserIndex from '../../../app/controller/user/index';
import ExportUserLogin from '../../../app/controller/user/login';

declare module 'egg' {
  interface IController {
    base: {
      base: ExportBaseBase;
      userbase: ExportBaseUserbase;
    }
    user: {
      index: ExportUserIndex;
      login: ExportUserLogin;
    }
  }
}
