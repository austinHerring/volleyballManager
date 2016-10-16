'use strict';
const angular = require('angular');
// import ngAnimate from 'angular-animate';
const ngCookies = require('angular-cookies');
const ngResource = require('angular-resource');
const ngSanitize = require('angular-sanitize');


const uiRouter = require('angular-ui-router');
const uiBootstrap = require('angular-ui-bootstrap');
// const ngMessages = require('angular-messages');
// import ngValidationMatch from 'angular-validation-match';


import {routeConfig} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import teams from './teams/teams.component';
import teamAdd from './teamAdd/teamAdd.component';
import teamDetail from './teamDetail/teamDetail.component';
import pools from './pools/pools.component';
import poolDetail from './poolDetail/poolDetail.component';
import matchEdit from './matchEdit/matchEdit.component'
import brackets from './brackets/brackets.component';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';



import './app.css';

angular.module('volleyballManagerApp', [
  ngCookies,
  ngResource,
  ngSanitize,


  uiRouter,
  uiBootstrap,

  _Auth,
  account,
  admin,
  navbar,
  footer,
  main,

  pools,
  poolDetail,
  matchEdit,

  teams,
  teamAdd,
  teamDetail,

  brackets,

  constants,

  util
])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

angular
  .element(document)
  .ready(() => {
    angular.bootstrap(document, ['volleyballManagerApp'], {
      strictDi: true
    });
  });
