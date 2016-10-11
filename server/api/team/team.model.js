'use strict';

import mongoose from 'mongoose';

var TeamSchema = new mongoose.Schema({
  name: String,
  rank: String
});

export default mongoose.model('Team', TeamSchema);
