import {
  bootstrapApplication,
  type BootstrapContext,
} from '@angular/platform-browser';

import { App } from './app/app';
import { configServer } from './config.server';

export default (context: BootstrapContext) =>
  bootstrapApplication(App, configServer, context);
