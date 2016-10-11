'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('pools', {
      url: '/pools',
      template: '<pools></pools>'
    });
}
