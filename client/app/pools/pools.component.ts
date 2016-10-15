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
