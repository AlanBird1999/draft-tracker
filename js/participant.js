class Participant {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.wins = 0;
    this.losses = 0;
    this.draws = 0;
    this.matchPoints = 0;
    this.previousOpponents = [];
  }
}
