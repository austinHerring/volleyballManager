'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('poolDetail', {
      url: '/pools/detail/:poolId',
      template: '<pool-detail></pool-detail>'
    });
}
