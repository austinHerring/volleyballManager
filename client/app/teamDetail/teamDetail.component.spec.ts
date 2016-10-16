'use strict';

describe('Component: TeamDetailComponent', function() {
  // load the controller's module
  beforeEach(module('volleyballManagerApp.teamDetail'));

  var TeamDetailComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    TeamDetailComponent = $componentController('teamDetail', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
