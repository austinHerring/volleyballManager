'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './pools.routes';

export class PoolsComponent {
  Auth;
  $http;
  pools = [];
  newPool = '';

  /*@ngInject*/
  constructor($http, Auth) {
    this.$http = $http;
    this.Auth = Auth;
    this.loadData();
  }

  loadData() {
    this.$http.get('/api/pools').then(response => {
      this.pools = response.data;
      this.$http.get('/api/matches').then(response => {
        var allMatches = response.data;
        var currentList = '';
        for (let p of this.pools) {
          for (let m of allMatches) {
            if (m.poolId == p._id) {
              if (!currentList.includes(m.fetchTeam1)) {
                currentList += (currentList == '') ? m.fetchTeam1 : ', ' + m.fetchTeam1;
              }
              if (!currentList.includes(m.fetchTeam2)) {
                currentList += (currentList == '') ? m.fetchTeam2 : ', ' + m.fetchTeam2;
              }
              if (!currentList.includes(m.fetchRef)) {
                currentList += (currentList == '') ? m.fetchRef : ', ' + m.fetchRef;
              }
            }
          }
          p.teamsList = currentList;
          currentList = '';
        }
      });
      for (let p of this.pools) {
        p.teamsList = "UGA, TENN"
      }
    });
  }

  isLoggedIn() {
    return this.Auth.isLoggedInSync();
  }

  addNewPool() {
    if (this.newPool) {
      this.$http.post('/api/pools', this.newPool );
      this.loadData();
      this.newPool = '';
    }
  }
}

export default angular.module('volleyballManagerApp.pools', [uiRouter])
  .config(routes)
  .component('pools', {
    template: require('./pools.html'),
    controller: PoolsComponent,
    controllerAs: 'poolsCtrl'
  })
  .name;
