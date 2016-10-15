/**
 * Pool model events
 */

'use strict';

import {EventEmitter} from 'events';
import Pool from './pool.model';
var PoolEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PoolEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Pool.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    PoolEvents.emit(event + ':' + doc._id, doc);
    PoolEvents.emit(event, doc);
  };
}

export default PoolEvents;
