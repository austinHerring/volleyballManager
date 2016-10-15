'use strict';

var app = require('../..');
import request from 'supertest';

var newPool;

describe('Pool API:', function() {
  describe('GET /api/pools', function() {
    var pools;

    beforeEach(function(done) {
      request(app)
        .get('/api/pools')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          pools = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(pools).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/pools', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/pools')
        .send({
          name: 'New Pool',
          info: 'This is the brand new pool!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPool = res.body;
          done();
        });
    });

    it('should respond with the newly created pool', function() {
      expect(newPool.name).to.equal('New Pool');
      expect(newPool.info).to.equal('This is the brand new pool!!!');
    });
  });

  describe('GET /api/pools/:id', function() {
    var pool;

    beforeEach(function(done) {
      request(app)
        .get(`/api/pools/${newPool._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          pool = res.body;
          done();
        });
    });

    afterEach(function() {
      pool = {};
    });

    it('should respond with the requested pool', function() {
      expect(pool.name).to.equal('New Pool');
      expect(pool.info).to.equal('This is the brand new pool!!!');
    });
  });

  describe('PUT /api/pools/:id', function() {
    var updatedPool;

    beforeEach(function(done) {
      request(app)
        .put(`/api/pools/${newPool._id}`)
        .send({
          name: 'Updated Pool',
          info: 'This is the updated pool!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPool = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPool = {};
    });

    it('should respond with the original pool', function() {
      expect(updatedPool.name).to.equal('New Pool');
      expect(updatedPool.info).to.equal('This is the brand new pool!!!');
    });

    it('should respond with the updated pool on a subsequent GET', function(done) {
      request(app)
        .get(`/api/pools/${newPool._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let pool = res.body;

          expect(pool.name).to.equal('Updated Pool');
          expect(pool.info).to.equal('This is the updated pool!!!');

          done();
        });
    });
  });

  describe('PATCH /api/pools/:id', function() {
    var patchedPool;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/pools/${newPool._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Pool' },
          { op: 'replace', path: '/info', value: 'This is the patched pool!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPool = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedPool = {};
    });

    it('should respond with the patched pool', function() {
      expect(patchedPool.name).to.equal('Patched Pool');
      expect(patchedPool.info).to.equal('This is the patched pool!!!');
    });
  });

  describe('DELETE /api/pools/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/pools/${newPool._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when pool does not exist', function(done) {
      request(app)
        .delete(`/api/pools/${newPool._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
