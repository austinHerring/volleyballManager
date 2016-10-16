'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './teamDetail.routes';
import Appointment from "../classes/appointment";

export class TeamDetailComponent {
  $http;
  $state;
  $stateParams;
  Auth;
  team;
  allMatches = [];
  appointments = [];
  poolInvolvedId = '';
  poolInvolved = '';

  /*@ngInject*/
  constructor($http, $state, $stateParams, Auth) {
    this.$http = $http;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.Auth = Auth;

    this.$http.get('/api/teams/' + this.$stateParams.teamId).then(response => {
      this.team = response.data;

      this.$http.get('/api/matches/').then(response => {
        this.allMatches = response.data;
        var newAppointment;

        for (let m of this.allMatches) {
          if (m.team1Id == this.team._id || m.team2Id == this.team._id || m.refId == this.team._id) {
            newAppointment = new Appointment();
            if (m.team1Id == this.team._id) {
              newAppointment.fetchOpponent = m.fetchTeam2;
              newAppointment.action = 'Play against';
              newAppointment.sets = this.mapSets(m.sets, false);
            } else if (m.team2Id == this.team._id) {
              newAppointment.fetchOpponent = m.fetchTeam1;
              newAppointment.action = 'Play against';
              newAppointment.sets = this.mapSets(m.sets, true);
            } else {
              newAppointment.action = 'Referee';
            }

            newAppointment.time = m.time;
            this.poolInvolvedId = m.poolId;
            this.appointments.push(newAppointment);
            this.$http.get('/api/pools/' + this.poolInvolvedId).then(response => {
              this.poolInvolved = response.data.name;
            });
          }
        }
      });
    });
  }


  mapSets(sets, reverse) {
    if (sets != null) {
      var setsRet = [];
      for (let s of sets) {
        if (reverse) {
          setsRet.push({ownScore: s.team2Score, opponentScore: s.team1Score});
        } else {
          setsRet.push({ownScore: s.team1Score, opponentScore: s.team2Score});
        }
      }
      return setsRet;
    } else {
      return null;
    }
  }

  deleteTeam() {
    var c = confirm('Delete this?');
    if (c === true) {
      this.$http.delete('/api/teams/' + this.team._id).then(response => {
        this.$state.go('teams');
      });
    }
  }

  saveTeam() {
    if (this.team) {
      this.$http.put('/api/teams/' + this.team._id, this.team).then(response => {
        this.$state.go('teams');
      });
    }
  }

  isLoggedIn() {
    return this.Auth.isLoggedInSync();
  }
}

export default angular.module('volleyballManagerApp.teamDetail', [uiRouter])
  .config(routes)
  .component('teamDetail', {
    template: require('./teamDetail.html'),
    controller: TeamDetailComponent,
    controllerAs: 'teamDetailCtrl'
  })
  .name;
