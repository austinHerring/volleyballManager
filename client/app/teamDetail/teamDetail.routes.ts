'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('teamDetail', {
      url: '/teams/detail/:teamId',
      template: '<team-detail></team-detail>'
    });
}
