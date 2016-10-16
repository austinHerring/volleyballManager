export default class Match {
  constructor() {}

  _id: String;
  team1Id: String;
  fetchTeam1: String;
  team2Id: String;
  fetchTeam2: String;
  refId: String;
  fetchRef: String;
  time: Date;
  poolId: String;
  isComplete: Boolean;
  sets: {
    team1Score: Number,
    team2Score: Number
  };
}
