'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('teamEdit', {
      url: '/teamEdit/:teamId',
      template: '<team-edit></team-edit>',
      authenticate: true
    });
}
