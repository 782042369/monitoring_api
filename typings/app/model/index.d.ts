// This file is created by egg-ts-helper@1.25.9
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportProject from '../../../app/model/Project';
import ExportUser from '../../../app/model/User';
import ExportWebAjax from '../../../app/model/WebAjax';
import ExportWebEnvironment from '../../../app/model/WebEnvironment';
import ExportWebErrors from '../../../app/model/WebErrors';
import ExportWebPages from '../../../app/model/WebPages';
import ExportWebPvuvip from '../../../app/model/WebPvuvip';
import ExportWebReport from '../../../app/model/WebReport';
import ExportWebResource from '../../../app/model/WebResource';
import ExportWebStatis from '../../../app/model/WebStatis';

declare module 'egg' {
  interface IModel {
    Project: ReturnType<typeof ExportProject>;
    User: ReturnType<typeof ExportUser>;
    WebAjax: ReturnType<typeof ExportWebAjax>;
    WebEnvironment: ReturnType<typeof ExportWebEnvironment>;
    WebErrors: ReturnType<typeof ExportWebErrors>;
    WebPages: ReturnType<typeof ExportWebPages>;
    WebPvuvip: ReturnType<typeof ExportWebPvuvip>;
    WebReport: ReturnType<typeof ExportWebReport>;
    WebResource: ReturnType<typeof ExportWebResource>;
    WebStatis: ReturnType<typeof ExportWebStatis>;
  }
}
