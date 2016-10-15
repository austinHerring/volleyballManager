'use strict';

import mongoose from 'mongoose';

var MatchSchema = new mongoose.Schema({
  team1Id: String,
  fetchTeam1: String,
  team2Id: String,
  fetchTeam2: String,
  time: String,
  poolId: String,
  sets: {
    order: Number,
    team1Score: Number,
    team2Score: Number
  }
});

export default mongoose.model('Match', MatchSchema);
