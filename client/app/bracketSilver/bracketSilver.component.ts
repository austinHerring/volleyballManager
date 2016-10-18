'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './bracketSilver.routes';

export class BracketSilverComponent {
  /*@ngInject*/
  constructor() {
  }
}

export default angular.module('volleyballManagerApp.bracketSilver', [uiRouter])
  .config(routes)
  .component('bracketSilver', {
    template: require('./bracketSilver.html'),
    controller: BracketSilverComponent,
    controllerAs: 'bracketSilverCtrl'
  })
  .name;
