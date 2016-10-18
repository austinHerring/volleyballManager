'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './bracketGold.routes';

export class BracketGoldComponent {
  /*@ngInject*/
  constructor() {
  }
}

export default angular.module('volleyballManagerApp.bracketGold', [uiRouter])
  .config(routes)
  .component('bracketGold', {
    template: require('./bracketGold.html'),
    controller: BracketGoldComponent,
    controllerAs: 'bracketGoldCtrl'
  })
  .name;
