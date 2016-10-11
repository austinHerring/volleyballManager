'use strict';

describe('Component: PoolsComponent', function() {
  // load the controller's module
  beforeEach(module('volleyballManagerApp.pools'));

  var PoolsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    PoolsComponent = $componentController('pools', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
