'use strict';

describe('Component: TeamAddComponent', function() {
  // load the controller's module
  beforeEach(module('volleyballManagerApp.teamAdd'));

  var TeamAddComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    TeamAddComponent = $componentController('teamAdd', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
