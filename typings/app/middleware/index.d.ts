// This file is created by egg-ts-helper@1.25.9
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCompress from '../../../app/middleware/compress';
import ExportError from '../../../app/middleware/error';

declare module 'egg' {
  interface IMiddleware {
    compress: typeof ExportCompress;
    error: typeof ExportError;
  }
}
