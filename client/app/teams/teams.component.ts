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

    $http.get('/api/teams').then(response => {
      this.teams = response.data;
    });
  }

  isLoggedIn() {
    return this.Auth.isLoggedInSync();
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
