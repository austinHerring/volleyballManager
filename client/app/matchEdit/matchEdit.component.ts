'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './matchEdit.routes';

export class MatchEditComponent {
  // Aux
  $http;
  $stateParams;

  //data context
  match;
  allTeams= [];

  /*@ngInject*/
  constructor($http, $stateParams) {
    this.$http = $http;
    this.$stateParams = $stateParams;
    this.loadData();
  }

  loadData() {
    this.$http.get('/api/matches/' + this.$stateParams.matchId).then(response => {
      this.match = response.data;
    });

    this.$http.get('/api/teams').then(response => {
      this.allTeams = response.data;
    });
  }
}

export default angular.module('volleyballManagerApp.matchEdit', [uiRouter])
  .config(routes)
  .component('matchEdit', {
    template: require('./matchEdit.html'),
    controller: MatchEditComponent,
    controllerAs: 'matchEditCtrl'
  })
  .name;
