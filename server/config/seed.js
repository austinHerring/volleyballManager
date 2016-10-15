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
      name: 'Pool 1'
    }, {
      name: 'Pool 2'
    });
  });

Match.find({}).remove()
  .then(() => {
    Match.create({
      team1Id: 'team1Id',
      team2Id: 'team2Id',
      time: '3:00',
      poolId: 'poolId',
      sets: [{team1Score: 25, team2Score: 21, order: 1}, {team1Score: 19, team2Score: 25, order: 2}, {
        team1Score: 25,
        team2Score: 23,
        order: 3
      }]
    }, {
      team1Id: 'blah',
      team2Id: 'blrh',
      time: '4:00',
      poolId: 'am',
      sets: [{team1Score: 25, team2Score: 21, order: 1}, {team1Score: 19, team2Score: 25, order: 2}, {
        team1Score: 25,
        team2Score: 23,
        order: 3
      }]
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
