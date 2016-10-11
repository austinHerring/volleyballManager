/**
 * Team model events
 */

'use strict';

import {EventEmitter} from 'events';
import Team from './team.model';
var TeamEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TeamEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Team.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    TeamEvents.emit(event + ':' + doc._id, doc);
    TeamEvents.emit(event, doc);
  };
}

export default TeamEvents;
