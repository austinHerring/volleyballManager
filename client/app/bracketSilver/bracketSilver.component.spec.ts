'use strict';

describe('Component: BracketSilverComponent', function() {
  // load the controller's module
  beforeEach(module('volleyballManagerApp.bracketSilver'));

  var BracketSilverComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    BracketSilverComponent = $componentController('bracketSilver', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
