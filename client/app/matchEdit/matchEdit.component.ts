'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './matchEdit.routes';

export class MatchEditComponent {
  // Aux
  $http;
  $state;
  $stateParams;

  //data context
  match;
  choice1;
  choice2;
  choiceRef;
  allTeams= [];
  points = new Array(10);

  /*@ngInject*/
  constructor($http, $state, $stateParams) {
    this.$http = $http;
    this.$stateParams = $stateParams;
    this.$state = $state;
    this.loadData();
  }

  loadData() {
    this.$http.get('/api/matches/' + this.$stateParams.matchId).then(response => {
      this.match = response.data;
      var ind = 0;
      for (let s of this.match.sets) {
        if (s != null) {
          this.points[ind] = s.team1Score;
          ind++;
          this.points[ind] = s.team2Score;
          ind++;
        }
      }
    });

    this.$http.get('/api/teams').then(response => {
      this.allTeams = response.data;
      for (let t of this.allTeams) {
        if(t._id == this.match.team1Id) {
          this.choice1 = t;
        }
        if(t._id == this.match.team2Id) {
          this.choice2 = t;
        }
        if(t._id == this.match.refId) {
          this.choiceRef = t;
        }
      }
    });
  }

  deleteMatch() {
    var c = confirm('Delete this?');
    if (c === true) {
      var id = this.match.poolId;
      this.$http.delete('/api/matches/' + this.match._id).then(response => {
          this.$state.go('poolDetail', {poolId: id});
        });
    }
  }

  saveMatch() {
    if (this.match) {
      this.updateSets();
      this.updateTeams();
      this.$http.put('/api/matches/' + this.match._id, this.match).then(response => {
          this.$state.go('poolDetail', {poolId: this.match.poolId});
      });
    }
  }

  updateSets() {
    var sets = [];
    for (let i = 0; i < this.points.length; i += 2) {
      if (this.points[i] != null && this.points[i+1] != null) {
        sets.push({team1Score: this.points[i], team2Score: this.points[i + 1]});
      }
    }
    this.match.sets = sets;
  }

  updateTeams() {
    this.match.team1Id = this.choice1._id;
    this.match.fetchTeam1 = this.choice1.name;
    this.match.team2Id = this.choice2._id;
    this.match.fetchTeam2 = this.choice2.name;
    this.match.refId = this.choiceRef._id;
    this.match.fetchRef = this.choiceRef.name;

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
