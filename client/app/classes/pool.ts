export default class Pool {

  constructor(id: String, name:String) {
    this._id = id;
    this.name = name;
  }

  _id: String;
  name: String;
  matchIds: [String];
  teamIds: [String]
}
