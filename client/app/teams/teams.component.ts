'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './teams.routes';

export class TeamsComponent {
  Auth;
  $http;
  teams = [];
  newTeam = '';

  /*@ngInject*/
  constructor($http, Auth) {
    this.$http = $http;
    this.Auth = Auth;

  }

  isLoggedIn() {
    return this.Auth.isLoggedInSync();
  }

  $onInit() {
    this.$http.get('/api/teams').then(response => {
      this.teams = response.data;
    });
  }

  addNewTeam() {
    if (this.newTeam) {
      this.$http.post('/api/teams', this.newTeam );
      this.teams.push(this.newTeam);
      this.newTeam = '';
    }
  }

  deleteTeam(index) {
    var c = confirm("Delete this?");
    if (c == true)
    {
      this.$http.delete('/api/teams/' + this.teams[index]._id);
      this.teams.splice(index, 1);
    }
  }

  saveTeam(index) {
    this.$http.put('/api/teams/' + this.teams[index]._id, this.teams[index])
      .success(function(){
        this.teams[index].edit = false;
      })
      .error(function(err){
        alert('Error! Something went wrong');
      });
  }

  toggleEdit(index){
    this.teams[index].edit = !this.teams[index].edit;
  }

}

export default angular.module('volleyballManagerApp.teams', [uiRouter])
  .config(routes)
  .component('teams', {
    template: require('./teams.html'),
    controller: TeamsComponent,
    controllerAs: 'teamsCtrl'
  })
  .name;
