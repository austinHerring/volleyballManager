'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './teamAdd.routes';

export class TeamAddComponent {
  $http;
  $state;
  newTeam;

  /*@ngInject*/
  constructor($http, $state) {
    this.$http = $http;
    this.$state = $state;
  }

  addNewTeam() {
    if (this.newTeam) {
      this.newTeam.pointDiff = 0;
      this.newTeam.teamIdsWon = [];
      this.newTeam.teamIdsLost = []
      this.$http.post('/api/teams', this.newTeam ).then(response => {
          this.$state.go('teams');
      });
    }
  }
}

export default angular.module('volleyballManagerApp.teamAdd', [uiRouter])
  .config(routes)
  .component('teamAdd', {
    template: require('./teamAdd.html'),
    controller: TeamAddComponent,
    controllerAs: 'teamAddCtrl'
  })
  .name;
