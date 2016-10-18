'use strict';

import mongoose from 'mongoose';

var MatchSchema = new mongoose.Schema({
  team1Id: String,
  fetchTeam1: String,
  team2Id: String,
  fetchTeam2: String,
  refId: String,
  fetchRef: String,
  time: Date,
  poolId: String,
  isComplete: Boolean,
  court: String,
  sets: {
    team1Score: Number,
    team2Score: Number
  }
});

export default mongoose.model('Match', MatchSchema);
