'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './brackets.routes';

export class BracketsComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('volleyballManagerApp.brackets', [uiRouter])
  .config(routes)
  .component('brackets', {
    template: require('./brackets.html'),
    controller: BracketsComponent,
    controllerAs: 'bracketsCtrl'
  })
  .name;
