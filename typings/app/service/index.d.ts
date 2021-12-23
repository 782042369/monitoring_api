// This file is created by egg-ts-helper@1.25.9
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportProject from '../../../app/service/project';
import ExportUser from '../../../app/service/user';
import ExportWebReport from '../../../app/service/web/report';

declare module 'egg' {
  interface IService {
    project: AutoInstanceType<typeof ExportProject>;
    user: AutoInstanceType<typeof ExportUser>;
    web: {
      report: AutoInstanceType<typeof ExportWebReport>;
    }
  }
}
