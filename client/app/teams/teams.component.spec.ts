'use strict';

describe('Component: TeamsComponent', function() {
  // load the controller's module
  beforeEach(module('volleyballManagerApp.teams'));

  var TeamsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    TeamsComponent = $componentController('teams', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
