'use strict';

var app = require('../..');
import request from 'supertest';

var newMatch;

describe('Match API:', function() {
  describe('GET /api/matches', function() {
    var matchs;

    beforeEach(function(done) {
      request(app)
        .get('/api/matches')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          matchs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(matchs).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/matches', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/matches')
        .send({
          name: 'New Match',
          info: 'This is the brand new match!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newMatch = res.body;
          done();
        });
    });

    it('should respond with the newly created match', function() {
      expect(newMatch.name).to.equal('New Match');
      expect(newMatch.info).to.equal('This is the brand new match!!!');
    });
  });

  describe('GET /api/matches/:id', function() {
    var match;

    beforeEach(function(done) {
      request(app)
        .get(`/api/matches/${newMatch._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          match = res.body;
          done();
        });
    });

    afterEach(function() {
      match = {};
    });

    it('should respond with the requested match', function() {
      expect(match.name).to.equal('New Match');
      expect(match.info).to.equal('This is the brand new match!!!');
    });
  });

  describe('PUT /api/matches/:id', function() {
    var updatedMatch;

    beforeEach(function(done) {
      request(app)
        .put(`/api/matches/${newMatch._id}`)
        .send({
          name: 'Updated Match',
          info: 'This is the updated match!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedMatch = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedMatch = {};
    });

    it('should respond with the original match', function() {
      expect(updatedMatch.name).to.equal('New Match');
      expect(updatedMatch.info).to.equal('This is the brand new match!!!');
    });

    it('should respond with the updated match on a subsequent GET', function(done) {
      request(app)
        .get(`/api/matches/${newMatch._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let match = res.body;

          expect(match.name).to.equal('Updated Match');
          expect(match.info).to.equal('This is the updated match!!!');

          done();
        });
    });
  });

  describe('PATCH /api/matches/:id', function() {
    var patchedMatch;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/matches/${newMatch._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Match' },
          { op: 'replace', path: '/info', value: 'This is the patched match!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedMatch = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedMatch = {};
    });

    it('should respond with the patched match', function() {
      expect(patchedMatch.name).to.equal('Patched Match');
      expect(patchedMatch.info).to.equal('This is the patched match!!!');
    });
  });

  describe('DELETE /api/matches/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/matches/${newMatch._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when match does not exist', function(done) {
      request(app)
        .delete(`/api/matches/${newMatch._id}`)
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
