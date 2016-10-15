'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('matchEdit', {
      url: '/matchEdit/:matchId',
      template: '<match-edit></match-edit>',
      authenticate:true
    });
}
