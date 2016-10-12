'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './teams.routes';

export class TeamsComponent {
  Auth;
  $http;
  teams = [];
  newTeam = '';

  /*@ngInject*/
  constructor($http, Auth) {
    this.$http = $http;
    this.Auth = Auth;

  }

  isLoggedIn() {
    return this.Auth.isLoggedInSync();
  }

  $onInit() {
    this.$http.get('/api/teams').then(response => {
      this.teams = response.data;
    });
  }
}

export default angular.module('volleyballManagerApp.teams', [uiRouter])
  .config(routes)
  .component('teams', {
    template: require('./teams.html'),
    controller: TeamsComponent,
    controllerAs: 'teamsCtrl'
  })
  .name;
