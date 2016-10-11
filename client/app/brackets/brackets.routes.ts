'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('brackets', {
      url: '/brackets',
      template: '<brackets></brackets>'
    });
}
