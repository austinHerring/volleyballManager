export default class Appointment {
  constructor() {}
  time: Date;
  action: String;
  fetchOpponent: String;
  court:String;
  sets: {
    ownScore: Number,
    opponentScore: Number
  };
}
