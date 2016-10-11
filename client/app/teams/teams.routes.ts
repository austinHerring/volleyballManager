'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('teams', {
      url: '/teams',
      template: '<teams></teams>'
    });
}
