'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('teamAdd', {
      url: '/teamAdd',
      template: '<team-add></team-add>',
      authenticate: true
    });
}
