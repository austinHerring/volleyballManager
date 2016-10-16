export default class Appointment {
  constructor() {}
  time: Date;
  action: String;
  fetchOpponent: String;
  sets: {
    ownScore: Number,
    opponentScore: Number
  };
}
