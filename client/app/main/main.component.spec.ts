'use strict';

import main from './main.component';
import {MainController} from './main.component';

describe('Component: MainComponent', function() {

  beforeEach(angular.mock.module(main));
  beforeEach(angular.mock.module('stateMock'));

  var scope;
  var mainComponent;
  var state;
  var $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function(
    _$httpBackend_,
    $http,
    $componentController,
    $rootScope,
    $state) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('/api/teams')
        .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

      scope = $rootScope.$new();
      state = $state;
      mainComponent = $componentController('main', {
        $http: $http,
        $scope: scope
      });
  }));

  it('should attach a list of teams to the controller', function() {
    mainComponent.$onInit();
    $httpBackend.flush();
    expect(mainComponent.awesomeThings.length).to.equal(4);
  });
});
