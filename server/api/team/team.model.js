'use strict';

import mongoose from 'mongoose';

var TeamSchema = new mongoose.Schema({
  name: String,
  poolId: String,
  teamIdsWon: [String],
  teamIdsLost: [String],
  pointDiff: Number,
  matchIds: [String]

});

export default mongoose.model('Team', TeamSchema);
