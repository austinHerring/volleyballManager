const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routing from './main.routes';

export class MainController {
  $http;
  totalPoints = 0;
  completedMatches = 0;
  bestDiffTeam = '';

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;

  }

  $onInit() {
    this.$http.get('/api/matches').then(response => {
      var completedMatches = 0;
      var totalPoints = 0;
      for (let m of response.data) {
        if (m.isComplete) {
          completedMatches++;
        }
        if (m.sets) {
          for (let s of m.sets) {
            totalPoints += s.team1Score;
            totalPoints += s.team2Score;
          }
        }
      }

      this.completedMatches = completedMatches;
      this.totalPoints = totalPoints;
    });

    this.$http.get('/api/teams').then(response => {
      var bestDiff = 0;
      var bestDiffTeam = '';
      for (let t of response.data) {
        if (t.pointDiff > bestDiff) {
          bestDiff = t.pointDiff;
          bestDiffTeam = t.name;
        }
      }

      for (let t of response.data) {
        if (t.pointDiff == bestDiff && bestDiff != 0) {
          this.bestDiffTeam += (this.bestDiffTeam) ? ', ' + t.name : t.name;
        }
      }
    });
  }

}

export default angular.module('volleyballManagerApp.main', [
  uiRouter])
    .config(routing)
    .component('main', {
      template: require('./main.html'),
      controller: MainController,
      controllerAs: 'MainCtrl'
    })
    .name;
