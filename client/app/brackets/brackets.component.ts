'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './brackets.routes';

export class BracketsComponent {
  $http;
  Auth;
  isReady = false;
  display;
  goldTeamsAllowedFromPool = 3;
  silverTeamsAllowedFromPool = 1;
  API_PREFIX = 'https://username:sOxs6QS2KwDkqD1p0ldu8crVHaPnxw3BcBYSGgec@api.challonge.com/v1/';
  API_KEY = 'sOxs6QS2KwDkqD1p0ldu8crVHaPnxw3BcBYSGgec';
  rankedGoldTeams = [];
  rankedSilverTeams = [];
  pools = [];
  poolsForSorting = [];


  test;

  /*@ngInject*/
  constructor($http, Auth) {
    this.$http = $http;
    this.Auth = Auth;
    this.loadData();
  }

  loadData() {
    this.$http.get('/api/pools').then(response => {
      this.pools = response.data;
      this.$http.get('/api/teams').then(response => {
        var allTeams = response.data;
        for (let p of this.pools) {
          var matchingTeams = allTeams.filter((team) => team.poolId == p._id);
          matchingTeams = matchingTeams.sort((a, b) => { return this.safeCompareTeams(a, b); });
          this.poolsForSorting.push(matchingTeams);
        }

        var currentRank = 0;
        while (currentRank < this.goldTeamsAllowedFromPool) {
          this.addRankedTeamsForTier(currentRank, true);
          currentRank++;
        }

        currentRank = 0;
        while (currentRank < this.silverTeamsAllowedFromPool) {
          this.addRankedTeamsForTier(currentRank + this.goldTeamsAllowedFromPool, false);
          currentRank++;
        }
      });
    });

    this.$http.get('/api/publicDisplays').then(response => {
      var display = response.data[0];
      if (display != null) {
        this.isReady = display.isReady;
        this.display = display;
      }
    });
  }

  addRankedTeamsForTier(rank, isgold) {
    var currentTierTeams = [];
    var totalPools = this.poolsForSorting.length;

    for (let i = 0; i < totalPools; i++) {
      if (this.poolsForSorting[i][rank]) {
        currentTierTeams.push(this.poolsForSorting[i][rank]);
      }
    }

    currentTierTeams = currentTierTeams.sort((a, b) => { return this.safeCompareTeams(a, b); });

    for (let t of currentTierTeams) {
      if (isgold) {
        this.rankedGoldTeams.push(t);
      } else {
        this.rankedSilverTeams.push(t);
      }
    }
  }

  safeCompareTeams(team1, team2) {
    var aWins = (team1.teamIdsWon) ? team1.teamIdsWon.length : 0;
    var bWins = (team2.teamIdsWon) ? team2.teamIdsWon.length : 0;
    var aDiff = (team1.pointDiff) ? team1.pointDiff : 0;
    var bDiff = (team2.pointDiff) ? team2.pointDiff : 0;
    return this.compareTeams(aWins, bWins) || this.compareTeams(aDiff, bDiff);
  }

  compareTeams(a, b) {
    if (a > b) { return -1; }
    if (a < b) { return 1; }
    return 0;
  }

  toggleDisplay() {
    if (this.display) {
      this.display.isReady = !this.display.isReady;
      this.$http.put('/api/publicDisplays/' + this.display._id, this.display);
    } else {
      this.$http.post('/api/publicDisplays/', {isReady: false});
    }
  }

  isLoggedIn() {
    return this.Auth.isLoggedInSync();
  }

  isDisplayReady() {
    return this.Auth.isLoggedInSync() || this.isReady;
  }
}

export default angular.module('volleyballManagerApp.brackets', [uiRouter])
  .config(routes)
  .component('brackets', {
    template: require('./brackets.html'),
    controller: BracketsComponent,
    controllerAs: 'bracketsCtrl'
  })
  .name;
