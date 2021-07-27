// This file is created by egg-ts-helper@1.25.9
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportProject from '../../../app/model/Project';
import ExportUser from '../../../app/model/User';
import ExportWebReport from '../../../app/model/WebReport';

declare module 'egg' {
  interface IModel {
    Project: ReturnType<typeof ExportProject>;
    User: ReturnType<typeof ExportUser>;
    WebReport: ReturnType<typeof ExportWebReport>;
  }
}
