'use strict';

import mongoose from 'mongoose';

var PoolSchema = new mongoose.Schema({
  name: String,
  matchIds: [String],
  teamIds: [String]
});

export default mongoose.model('Pool', PoolSchema);
