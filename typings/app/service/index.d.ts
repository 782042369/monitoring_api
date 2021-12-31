// This file is created by egg-ts-helper@1.29.1
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportIndex from '../../../app/service/index';
import ExportProject from '../../../app/service/project';
import ExportUser from '../../../app/service/user';
import ExportWebAnalysis from '../../../app/service/web/analysis';
import ExportWebIp from '../../../app/service/web/ip';
import ExportWebPvuvip from '../../../app/service/web/pvuvip';
import ExportWebPvuvipTask from '../../../app/service/web/pvuvipTask';
import ExportWebReport from '../../../app/service/web/report';
import ExportWebReportTask from '../../../app/service/web/reportTask';

declare module 'egg' {
  interface IService {
    index: AutoInstanceType<typeof ExportIndex>;
    project: AutoInstanceType<typeof ExportProject>;
    user: AutoInstanceType<typeof ExportUser>;
    web: {
      analysis: AutoInstanceType<typeof ExportWebAnalysis>;
      ip: AutoInstanceType<typeof ExportWebIp>;
      pvuvip: AutoInstanceType<typeof ExportWebPvuvip>;
      pvuvipTask: AutoInstanceType<typeof ExportWebPvuvipTask>;
      report: AutoInstanceType<typeof ExportWebReport>;
      reportTask: AutoInstanceType<typeof ExportWebReportTask>;
    }
  }
}
