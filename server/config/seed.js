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
      rank: 1
    }, {
      name: 'UGA',
      rank: 2
    }, {
      name: 'TENN',
      rank: 3
    });
  });

Pool.find({}).remove()
  .then(() => {
    Pool.create({
      name: 'Red - Court 1'
    }, {
      name: 'Black - Court 2'
    }, {
      name: 'White - Court 3'
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
