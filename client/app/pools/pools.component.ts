'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './pools.routes';

export class PoolsComponent {
  /*@ngInject*/
  constructor() {
  }
}

export default angular.module('volleyballManagerApp.pools', [uiRouter])
  .config(routes)
  .component('pools', {
    template: require('./pools.html'),
    controller: PoolsComponent,
    controllerAs: 'poolsCtrl'
  })
  .name;
