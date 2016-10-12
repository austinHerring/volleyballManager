'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './teamEdit.routes';

export class TeamEditComponent {
  $http;
  $state;
  $stateParams;
  team;
  //modal;

  /*@ngInject*/
  constructor($http, $state, $stateParams) {
    this.$http = $http;
    this.$state = $state;
    this.$stateParams = $stateParams;
    //this.modal = Modal;
  }

  $onInit() {
    this.$http.get('/api/teams/' + this.$stateParams.teamId).then(response => {
      this.team = response.data;
    });
  }

  deleteTeam() {
    var c = confirm('Delete this?');
    if (c === true) {
      this.$http.delete('/api/teams/' + this.team._id);
      this.$state.go('teams');
    }
  }

  // deleteTeam() {
  //   var deleteConfirmationModal = this.modal.confirm.delete((user) => {
  //     this.$http.delete('/api/teams/' + this.team._id);
  //     this.$state.go('teams');
  //   });
  //
  //   deleteConfirmationModal();
  // }

  saveTeam() {
    if (this.team) {
      this.$http.put('/api/teams/' + this.team._id, this.team);
      this.$state.go('teams');
    }
  }

}

export default angular.module('volleyballManagerApp.teamEdit', [uiRouter])
  .config(routes)
  .component('teamEdit', {
    template: require('./teamEdit.html'),
    controller: TeamEditComponent,
    controllerAs: 'teamEditCtrl'
  })
  .name;
