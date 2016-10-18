'use strict';

var app = require('../..');
import request from 'supertest';

var newPublicDisplay;

describe('PublicDisplay API:', function() {
  describe('GET /api/publicDisplays', function() {
    var publicDisplays;

    beforeEach(function(done) {
      request(app)
        .get('/api/publicDisplays')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          publicDisplays = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(publicDisplays).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/publicDisplays', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/publicDisplays')
        .send({
          name: 'New PublicDisplay',
          info: 'This is the brand new publicDisplay!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPublicDisplay = res.body;
          done();
        });
    });

    it('should respond with the newly created publicDisplay', function() {
      expect(newPublicDisplay.name).to.equal('New PublicDisplay');
      expect(newPublicDisplay.info).to.equal('This is the brand new publicDisplay!!!');
    });
  });

  describe('GET /api/publicDisplays/:id', function() {
    var publicDisplay;

    beforeEach(function(done) {
      request(app)
        .get(`/api/publicDisplays/${newPublicDisplay._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          publicDisplay = res.body;
          done();
        });
    });

    afterEach(function() {
      publicDisplay = {};
    });

    it('should respond with the requested publicDisplay', function() {
      expect(publicDisplay.name).to.equal('New PublicDisplay');
      expect(publicDisplay.info).to.equal('This is the brand new publicDisplay!!!');
    });
  });

  describe('PUT /api/publicDisplays/:id', function() {
    var updatedPublicDisplay;

    beforeEach(function(done) {
      request(app)
        .put(`/api/publicDisplays/${newPublicDisplay._id}`)
        .send({
          name: 'Updated PublicDisplay',
          info: 'This is the updated publicDisplay!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPublicDisplay = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPublicDisplay = {};
    });

    it('should respond with the original publicDisplay', function() {
      expect(updatedPublicDisplay.name).to.equal('New PublicDisplay');
      expect(updatedPublicDisplay.info).to.equal('This is the brand new publicDisplay!!!');
    });

    it('should respond with the updated publicDisplay on a subsequent GET', function(done) {
      request(app)
        .get(`/api/publicDisplays/${newPublicDisplay._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let publicDisplay = res.body;

          expect(publicDisplay.name).to.equal('Updated PublicDisplay');
          expect(publicDisplay.info).to.equal('This is the updated publicDisplay!!!');

          done();
        });
    });
  });

  describe('PATCH /api/publicDisplays/:id', function() {
    var patchedPublicDisplay;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/publicDisplays/${newPublicDisplay._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched PublicDisplay' },
          { op: 'replace', path: '/info', value: 'This is the patched publicDisplay!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPublicDisplay = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedPublicDisplay = {};
    });

    it('should respond with the patched publicDisplay', function() {
      expect(patchedPublicDisplay.name).to.equal('Patched PublicDisplay');
      expect(patchedPublicDisplay.info).to.equal('This is the patched publicDisplay!!!');
    });
  });

  describe('DELETE /api/publicDisplays/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/publicDisplays/${newPublicDisplay._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when publicDisplay does not exist', function(done) {
      request(app)
        .delete(`/api/publicDisplays/${newPublicDisplay._id}`)
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
