'use strict';

describe('Component: PoolDetailComponent', function() {
  // load the controller's module
  beforeEach(module('volleyballManagerApp.poolDetail'));

  var PoolDetailComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    PoolDetailComponent = $componentController('poolDetail', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
