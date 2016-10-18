'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('bracketGold', {
      url: '/bracketGold',
      template: '<bracket-gold></bracket-gold>'
    });
}
