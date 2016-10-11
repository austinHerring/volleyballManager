/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Team from '../api/team/team.model';
import User from '../api/user/user.model';

Team.find({}).remove()
  .then(() => {
    Team.create({
      name: 'UGA',
      rank: '1'
    }, {
      name: 'GT',
      info: '2'
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
