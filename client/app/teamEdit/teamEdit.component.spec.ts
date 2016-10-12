'use strict';

describe('Component: TeamEditComponent', function() {
  // load the controller's module
  beforeEach(module('volleyballManagerApp.teamEdit'));

  var TeamEditComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    TeamEditComponent = $componentController('teamEdit', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
