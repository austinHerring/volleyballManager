'use strict';

import mongoose from 'mongoose';

var TeamSchema = new mongoose.Schema({
  name: String,
  rank: Number,
  poolId: String,
  teamIdsWon: [String],
  teamIdsLost: [String],
  matchIds: [String]

});

export default mongoose.model('Team', TeamSchema);
