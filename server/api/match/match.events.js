/**
 * Match model events
 */

'use strict';

import {EventEmitter} from 'events';
import Match from './match.model';
var MatchEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
MatchEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Match.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    MatchEvents.emit(event + ':' + doc._id, doc);
    MatchEvents.emit(event, doc);
  };
}

export default MatchEvents;
