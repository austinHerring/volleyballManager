'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');
import routes from './poolDetail.routes';
import Match from "../classes/match";

export class PoolDetailComponent {
  // Aux
  Auth;
  $http;
  $stateParams;

  //data context
  pool;
  matches = [];
  allTeams = [];
  unselectedTeams = [];
  selectedTeams = [];

  // Inputs
  choice1;
  choice2;
  time = '';

  /*@ngInject*/
  constructor($http, Auth, $stateParams) {
    this.$http = $http;
    this.Auth = Auth;
    this.$stateParams = $stateParams;
    this.loadData();

  }

  loadData() {
    this.$http.get('/api/pools/' + this.$stateParams.poolId).then(response => {
      this.pool = response.data;
    });

    this.$http.get('/api/teams').then(response => {
      this.unselectedTeams = response.data;
    });

    this.$http.get('/api/matches').then(response => {
      var allMatches = response.data;
      for (let m of allMatches) {
        if (m.poolId == this.pool._id) {
          for (let t of this.unselectedTeams) {
            if (t._id == m.team1Id) {
              m.fetchTeam1 = t.name;
            }
            if (t._id == m.team2Id) {
              m.fetchTeam2 = t.name;
            }
          }
          this.matches.push(m);
        }
      }
    });
  }

  isLoggedIn() {
    return this.Auth.isLoggedInSync();
  }

  addNewMatch() {
    if (this.choice1 && this.choice2 && this.time) {
      var newMatch = new Match();
      newMatch.time = this.time;
      newMatch.team1Id = this.choice1._id;
      newMatch.fetchTeam1 = this.choice1.name;
      newMatch.team2Id = this.choice2._id;
      newMatch.fetchTeam2 = this.choice2.name;
      newMatch.poolId = this.pool._id;

      this.$http.post('/api/matches', newMatch );
      this.matches.push(newMatch);

      this.time = '';
      this.choice1 = null;
      this.choice2 = null;
    }
  }

  update() {
    //alert(this.choice1);
  }
}

export default angular.module('volleyballManagerApp.poolDetail', [uiRouter])
  .config(routes)
  .component('poolDetail', {
    template: require('./poolDetail.html'),
    controller: PoolDetailComponent,
    controllerAs: 'poolDetailCtrl'
  })
  .name;
