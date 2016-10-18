'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var publicDisplayCtrlStub = {
  index: 'publicDisplayCtrl.index',
  show: 'publicDisplayCtrl.show',
  create: 'publicDisplayCtrl.create',
  upsert: 'publicDisplayCtrl.upsert',
  patch: 'publicDisplayCtrl.patch',
  destroy: 'publicDisplayCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var publicDisplayIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './publicDisplay.controller': publicDisplayCtrlStub
});

describe('PublicDisplay API Router:', function() {
  it('should return an express router instance', function() {
    expect(publicDisplayIndex).to.equal(routerStub);
  });

  describe('GET /api/publicDisplays', function() {
    it('should route to publicDisplay.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'publicDisplayCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/publicDisplays/:id', function() {
    it('should route to publicDisplay.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'publicDisplayCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/publicDisplays', function() {
    it('should route to publicDisplay.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'publicDisplayCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/publicDisplays/:id', function() {
    it('should route to publicDisplay.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'publicDisplayCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/publicDisplays/:id', function() {
    it('should route to publicDisplay.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'publicDisplayCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/publicDisplays/:id', function() {
    it('should route to publicDisplay.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'publicDisplayCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
