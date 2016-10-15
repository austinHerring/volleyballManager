'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var poolCtrlStub = {
  index: 'poolCtrl.index',
  show: 'poolCtrl.show',
  create: 'poolCtrl.create',
  upsert: 'poolCtrl.upsert',
  patch: 'poolCtrl.patch',
  destroy: 'poolCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var poolIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './pool.controller': poolCtrlStub
});

describe('Pool API Router:', function() {
  it('should return an express router instance', function() {
    expect(poolIndex).to.equal(routerStub);
  });

  describe('GET /api/pools', function() {
    it('should route to pool.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'poolCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/pools/:id', function() {
    it('should route to pool.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'poolCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/pools', function() {
    it('should route to pool.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'poolCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/pools/:id', function() {
    it('should route to pool.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'poolCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/pools/:id', function() {
    it('should route to pool.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'poolCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/pools/:id', function() {
    it('should route to pool.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'poolCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
