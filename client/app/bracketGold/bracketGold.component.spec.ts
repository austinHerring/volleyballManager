'use strict';

describe('Component: BracketGoldComponent', function() {
  // load the controller's module
  beforeEach(module('volleyballManagerApp.bracketGold'));

  var BracketGoldComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    BracketGoldComponent = $componentController('bracketGold', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
