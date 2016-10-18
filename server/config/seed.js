/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Team from '../api/team/team.model';
import User from '../api/user/user.model';
import Pool from '../api/pool/pool.model';
import Match from '../api/match/match.model';

Team.find({}).remove()
  .then(() => {
    Team.create({
      name: 'GT',
      pointDiff: 0
    }, {
      name: 'UGA',
      pointDiff: 0
    }, {
      name: 'TENN',
      pointDiff: 0,
    }, {
      name: 'BYU',
      pointDiff: 0,
    }, {
      name: 'USC',
      pointDiff: 0,
    }, {
      name: 'MICH',
      pointDiff: 0,
    }, {
      name: 'GCSU',
      pointDiff: 0,
    }, {
      name: 'Purdue',
      pointDiff: 0,
    });
  });

Pool.find({}).remove()
  .then(() => {
    Pool.create({
      name: 'Pool A'
    }, {
      name: 'Pool B'
    }, {
      name: 'Pool C'
    }, {
      name: 'Pool D'
    });
  });

Match.find({}).remove()
  .then(() => {
    Match.create({
      poolId: ''
    });
  });

User.find({}).remove()
  .then(() => {
    User.create({
      provider: 'local',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin'
    })
    .then(() => {
      console.log('finished populating users');
    });
  });
