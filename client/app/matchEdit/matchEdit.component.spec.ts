'use strict';

describe('Component: MatchEditComponent', function() {
  // load the controller's module
  beforeEach(module('volleyballManagerApp.matchEdit'));

  var MatchEditComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    MatchEditComponent = $componentController('matchEdit', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
