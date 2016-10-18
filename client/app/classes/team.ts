export default class Team {
  constructor() {}

  _id: String;
  name: String;
  poolId: String;
  teamIdsWon: [String];
  teamIdsLost: [String];
  pointDiff: Number;
  matchIds: [String]
}
