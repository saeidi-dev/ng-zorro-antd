import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import sdk from '@stackblitz/sdk';
import { getParameters } from 'codesandbox/lib/api/define';
import { VERSION } from 'ng-zorro-antd/version';

import angularJSON from './files/angular.json';
import appModuleTS from './files/app.module';
import dotAngularCliJSON from './files/dot_angular-cli.json';
import environmentTS from './files/environment';
import mainTS from './files/main';
import nzModuleTS from './files/ng-zorro-antd.module';
import polyfillTS from './files/polyfill';

@Injectable({
  providedIn: 'root'
})
export class OnlineIdeService {
  document: Document;
  template = 'angular-cli';
  dependencies = {
    '@angular/animations': '^13.0.1',
    '@angular/cdk': '^13.0.1',
    '@angular/common': '^13.0.1',
    '@angular/compiler': '^13.0.1',
    '@angular/core': '^13.0.1',
    '@angular/forms': '^13.0.1',
    '@angular/platform-browser': '^13.0.1',
    '@angular/platform-browser-dynamic': '^13.0.1',
    '@angular/router': '^13.0.1',
    '@ant-design/icons-angular': '^13.0.1',
    rxjs: '~6.6.3',
    'core-js': '~3.6.5',
    'date-fns': '^2.0.0',
    tslib: '^2.0.0',
    'zone.js': '~0.11.1',
    'ng-zorro-antd': `^${VERSION.full}`
  };

  // tslint:disable-next-line:no-any
  constructor(@Inject(DOCUMENT) document: any) {
    this.document = document;
  }

  openOnStackBlitz(componentName: string, appComponentCode: string, selector: string): void {
    sdk.openProject({
      title: 'NG-ZORRO',
      description: 'Ant Design of Angular',
      tags: ['NG-ZORRO', 'ng-zorro-antd', 'Ant Design', 'Angular', 'ng'],
      template: this.template,
      dependencies: this.dependencies,
      files: {
        'angular.json': `${JSON.stringify(angularJSON, null, 2)}`,
        'src/index.html': `<${selector}>loading</${selector}>`,
        'src/main.ts': mainTS,
        'src/app/app.component.ts': appComponentCode,
        'src/polyfills.ts': polyfillTS,
        'src/app/app.module.ts': appModuleTS(componentName),
        'src/app/ng-zorro-antd.module.ts': nzModuleTS,
        'environments/environment.ts': environmentTS,
        'src/styles.css': `/* Add application styles & imports to this file! */;`
      }
    });
  }

  openOnCodeSandbox(componentName: string, appComponentCode: string, selector: string): void {
    const parameters = getParameters({
      files: {
        'package.json': {
          content: JSON.stringify(
            {
              dependencies: this.dependencies
            },
            null,
            2
          ),
          isBinary: false
        },
        '.angular-cli.json': {
          content: dotAngularCliJSON,
          isBinary: false
        },
        'src/index.html': {
          content: `
<!DOCTYPE html>
<html>
  <body>
    <${selector}>loading</${selector}>
   </body>
</html>`,
          isBinary: false
        },
        'src/app/app.module.ts': {
          content: appModuleTS(componentName),
          isBinary: false
        },
        'src/main.ts': {
          content: mainTS,
          isBinary: false
        },
        'src/polyfills.ts': {
          content: polyfillTS,
          isBinary: false
        },
        'src/app/app.component.ts': {
          content: appComponentCode,
          isBinary: false
        },
        'src/app/ng-zorro-antd.module.ts': {
          content: nzModuleTS,
          isBinary: false
        },
        'src/styles.css': {
          content: '/* Add application styles & imports to this file! */;',
          isBinary: false
        },
        'environments/environment.ts': {
          content: environmentTS,
          isBinary: false
        }
      }
    });

    const form = this.document.createElement('form');
    const parametersInput = this.document.createElement('input');
    form.method = 'POST';
    form.action = 'https://codesandbox.io/api/v1/sandboxes/define?module=/src/app/app.component.ts';
    form.target = '_blank';
    parametersInput.name = 'parameters';
    parametersInput.value = parameters;
    form.appendChild(parametersInput);
    this.document.body.append(form);
    form.submit();
    this.document.body.removeChild(form);
  }
}
