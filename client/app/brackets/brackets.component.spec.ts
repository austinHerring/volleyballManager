'use strict';

describe('Component: BracketsComponent', function() {
  // load the controller's module
  beforeEach(module('volleyballManagerApp.brackets'));

  var BracketsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    BracketsComponent = $componentController('brackets', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
