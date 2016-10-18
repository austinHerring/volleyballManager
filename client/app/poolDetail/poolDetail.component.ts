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
  $state;
  defaultDateTime = 1477137600000;

  //data context
  pool;
  matches = [];
  allTeams = [];
  unselectedTeams = [];

  // Inputs
  choice1;
  choice2;
  choiceRef;
  court = '';
  time = new Date(this.defaultDateTime);

  /*@ngInject*/
  constructor($http, Auth, $state, $stateParams) {
    this.$http = $http;
    this.Auth = Auth;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.loadData();

  }

  loadData() {
    this.$http.get('/api/pools/' + this.$stateParams.poolId).then(response => {
      this.pool = response.data;
      this.$http.get('/api/teams').then(response => {
        this.unselectedTeams = response.data;

        this.$http.get('/api/matches').then(response => {
          var allMatches = response.data;
          var associatedMatches = [];
          for (let m of allMatches) {
            if (m.poolId == this.pool._id) {
              for (let t of this.unselectedTeams) {
                if (t._id == m.team1Id) {
                  m.fetchTeam1 = t.name;
                }
                if (t._id == m.team2Id) {
                  m.fetchTeam2 = t.name;
                }
                if (t._id == m.refId) {
                  m.fetchRef = t.name;
                }
              }
              associatedMatches.push(m);
            }
          }
          this.matches = associatedMatches;
        });
      });
    });
  }

  isLoggedIn() {
    return this.Auth.isLoggedInSync();
  }

  addNewMatch() {
    if (this.choice1 && this.choice2 && this.choiceRef) {
      var newMatch = new Match();
      newMatch.time = this.time;
      newMatch.team1Id = this.choice1._id;
      newMatch.fetchTeam1 = this.choice1.name;
      newMatch.team2Id = this.choice2._id;
      newMatch.fetchTeam2 = this.choice2.name;
      newMatch.refId = this.choiceRef._id;
      newMatch.fetchRef = this.choiceRef.name;
      newMatch.poolId = this.pool._id;
      newMatch.court = this.court;

      this.$http.post('/api/matches', newMatch ).then(response => {
        this.matches.push(newMatch);
        this.time = new Date(this.defaultDateTime);
        this.choice1 = null;
        this.choice2 = null;
        this.choiceRef = null;
        this.loadData();
      });

    }
  }

  savePoolName() {
    if (this.pool.name) {
      this.$http.put('/api/pools/' + this.pool._id, this.pool);
    }
  }

  deletePool() {
    var c = confirm('Delete this?');
    if (c === true) {
      for (let m of this.matches) {
        this.$http.delete('/api/matches/' + m._id);
      }
      this.$http.delete('/api/pools/' + this.pool._id).then(response => {
        this.$state.go('pools');
      });


    }
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
