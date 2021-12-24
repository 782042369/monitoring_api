// This file is created by egg-ts-helper@1.25.9
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBaseBase from '../../../app/controller/base/base';
import ExportBaseUserbase from '../../../app/controller/base/userbase';
import ExportProjectIndex from '../../../app/controller/project/index';
import ExportUserIndex from '../../../app/controller/user/index';
import ExportUserLogin from '../../../app/controller/user/login';
import ExportWebPvuvip from '../../../app/controller/web/pvuvip';
import ExportWebReport from '../../../app/controller/web/report';

declare module 'egg' {
  interface IController {
    base: {
      base: ExportBaseBase;
      userbase: ExportBaseUserbase;
    }
    project: {
      index: ExportProjectIndex;
    }
    user: {
      index: ExportUserIndex;
      login: ExportUserLogin;
    }
    web: {
      pvuvip: ExportWebPvuvip;
      report: ExportWebReport;
    }
  }
}
