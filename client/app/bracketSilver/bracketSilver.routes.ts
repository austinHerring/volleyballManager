'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('bracketSilver', {
      url: '/bracketSilver',
      template: '<bracket-silver></bracket-silver>'
    });
}
