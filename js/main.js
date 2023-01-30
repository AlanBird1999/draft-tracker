console.log('initalizing');

// drawNameInputs()

d3.select('#participant-count').on('change', (event) => drawNameInputs(event));

function drawSeating() {
  d3.select('#seating').selectAll('g').remove();
  this.currentParticipant = -1;
  this.participants = this.participants.sort(() => Math.random() - 0.5);
  let podGroups = d3
    .select('#seating')
    .selectAll('g')
    .data(this.pods)
    .join('g')
    .append('svg')
    .attr('width', 500)
    .attr('height', 500);
  podGroups
    .append('circle')
    .attr('cx', 250)
    .attr('cy', 250)
    .attr('r', 100)
    .attr('fill', 'white');

  let pGroups = podGroups
    .selectAll('g')
    .data((d) => Array(d).fill(d))
    .join('g');
  pGroups
    .append('circle')
    .attr('cx', (d, i) => 250 + 140 * Math.cos((2 * Math.PI * i) / d))
    .attr('cy', (d, i) => 250 + 140 * Math.sin((2 * Math.PI * i) / d))
    .attr('r', 40)
    .attr('fill', 'white');
  pGroups
    .append('text')
    .text((d, i) => {
      this.currentParticipant++;
      return this.participants[this.currentParticipant].name;
    })
    .attr('x', (d, i) => 210 + 140 * Math.cos((2 * Math.PI * i) / d))
    .attr('y', (d, i) => 250 + 140 * Math.sin((2 * Math.PI * i) / d));
}

function drawNameInputs(event) {
  const nameCount = event.srcElement.value;
  this.participants = [];

  for (let i = 0; i < nameCount; i++) {
    let participant = new Participant(i + 1, 'Participant ' + (i + 1));
    this.participants.push(participant);
  }
  d3.selectAll('g').remove();

  let groups = d3
    .select('#name-input')
    .selectAll('g')
    .data(participants)
    .join('g')
    .classed('d-flex', true);
  groups.append('div').text('Name: ');
  groups
    .append('input')
    .attr('type', 'string')
    .attr('placeholder', (d) => d.name)
    .attr('id', (d) => d.id)
    .on('change', (value) => {
      this.participants[value.srcElement.id - 1].name = value.srcElement.value;
    });
  groups.append('br');
}

function calculateSeating() {
  console.log('calculating seating');
  console.log('participants', this.participants);

  let podCount = Math.floor(this.participants.length / 8);
  let extra = this.participants.length % 8;
  let lastPod;
  let nextLastPod = podCount > 1 || extra >= 6 ? 8 : null;

  if (extra > 3) {
    podCount++;
    lastPod = extra;
    if (extra < 6) {
      nextLastPod = 6;
      lastPod += 2;
    }
  } else {
    lastPod = 8 + extra;
  }
  this.pods = [];
  for (let i = 0; i < podCount - 2; i++) {
    this.pods.push(8);
  }
  if (nextLastPod) {
    this.pods.push(nextLastPod);
  }
  this.pods.push(lastPod);
  drawSeating();
}

function startTimer() {
  this.stopTimer();
  let input = d3.select('#minute-input');

  var totalSeconds = input.property('value') * 60; //d3.select('#minute-input').value;
  // Update the count down every 1 second
  this.currentTimer = setInterval(function () {
    // Time calculations for days, hours, minutes and seconds
    var mins = Math.floor(Math.abs(totalSeconds) / 60);
    var seconds = Math.abs(totalSeconds % 60);

    // Output the result in an element with id="demo"
    const timer = d3.select('#timer');
    timer.text(
      (totalSeconds < 0 ? '- ' : '') +
        mins +
        ':' +
        seconds.toString().padStart(2, '0')
    );

    // If the count down is over, write some text
    if (totalSeconds > 60 * 5) {
      timer.classed('green', true);
      timer.classed('red', false);
    } else if (totalSeconds > 0) {
      timer.classed('green', false);
      timer.classed('yellow', true);
    } else {
      timer.classed('yellow', false);
      timer.classed('red', true);
    }
    totalSeconds--;
  }, 1000);
}

function stopTimer() {
  if (this.currentTimer) {
    clearInterval(this.currentTimer);
  }
}

function createPairings(randomize = true) {
  this.currentMatch = 'stan';
  d3.select('#pairs-container').selectAll('div').remove();
  if (randomize) {
    this.currentPairings = this.participants
      .slice()
      .sort(() => Math.random() - 0.5)
      .sort((a, b) => b.matchPoints - a.matchPoints);
  }
  //TODO this does not account for pods or if a player has allready played a player this round

  for (let i = 0; i < this.participants.length; i += 2) {
    let pairDiv = d3
      .select('#pairs-container')
      .append('div')
      .classed('pairings', true);
    pairDiv
      .append('p')
      .text(
        `${this.currentPairings[i].name} vs ${this.currentPairings[i + 1].name}`
      );

    // Append an input for each participant's wins
    pairDiv
      .append('label')
      .text(`${this.currentPairings[i].name} wins:`)
      .append('input')
      .attr('type', 'number')
      .attr('id', this.currentPairings[i].id + '-wins')
      .classed('win-input', true);

    pairDiv
      .append('label')
      .text(`${this.currentPairings[i + 1].name} wins:`)
      .append('input')
      .attr('type', 'number')
      .attr('id', this.currentPairings[i + 1].id + '-wins')
      .classed('win-input', true);
  }
}

function createCustomPairings() {
  d3.select('#pairs-container').selectAll('div').remove();
  // TODO get these inputs from an input, in the meantime just manually change this
  this.currentPairings = [
    this.participants[0],
    this.participants[1],
    this.participants[2],
    this.participants[3],
    this.participants[4],
    this.participants[5],
    this.participants[6],
    this.participants[7],
  ];
  this.createPairings(false);
}

function createCommanderPairings(randomize = true) {
  this.currentMatch = 'com';
  d3.select('#pairs-container').selectAll('div').remove();
  if (randomize) {
    this.currentPairings = this.participants
      .slice()
      .sort(() => Math.random() - 0.5)
      .sort((a, b) => b.matchPoints - a.matchPoints);
  }
  console.log('current pairings', this.currentPairings);
  for (let i = 0; i < this.participants.length; i += 4) {
    let pairDiv = d3
      .select('#pairs-container')
      .append('div')
      .classed('pairings', true);
    pairDiv
      .append('p')
      .text(
        `${this.currentPairings[i].name} vs ${
          this.currentPairings[i + 1].name
        } vs ${this.currentPairings[i + 2].name} vs ${
          this.currentPairings[i + 3].name
        }`
      );

    // Append an input for each participant's wins
    pairDiv
      .append('label')
      .text(`${this.currentPairings[i].name} wins:`)
      .append('input')
      .attr('type', 'number')
      .attr('id', this.currentPairings[i].id + '-wins')
      .attr('value', 0)
      .classed('win-input', true);

    pairDiv
      .append('label')
      .text(`${this.currentPairings[i + 1].name} wins:`)
      .append('input')
      .attr('type', 'number')
      .attr('id', this.currentPairings[i + 1].id + '-wins')
      .attr('value', 0)
      .classed('win-input', true);

    pairDiv
      .append('label')
      .text(`${this.currentPairings[i + 2].name} wins:`)
      .append('input')
      .attr('type', 'number')
      .attr('id', this.currentPairings[i + 2].id + '-wins')
      .attr('value', 0)
      .classed('win-input', true);

    pairDiv
      .append('label')
      .text(`${this.currentPairings[i + 3].name} wins:`)
      .append('input')
      .attr('type', 'number')
      .attr('id', this.currentPairings[i + 3].id + '-wins')
      .attr('value', 0)
      .classed('win-input', true);
  }
}

function submitRecords() {
  if (this.currentMatch == 'com') {
    this.addPointsCommander();
  } else if (this.currentMatch == 'stan') {
    this.addPointsStandard();
  }
  d3.select('#pairs-container').selectAll('div').remove();
}

function addPointsStandard() {
  for (let i = 0; i < this.currentPairings.length; i += 2) {
    let input1 = document.getElementById(`${this.currentPairings[i].id}-wins`);
    let input2 = document.getElementById(
      `${this.currentPairings[i + 1].id}-wins`
    );
    let point1 = input1.value;
    let point2 = input2.value;

    if (point1 > point2) {
      this.currentPairings[i].wins++;
      this.currentPairings[i].matchPoints += 3;
      this.currentPairings[i + 1].losses++;
    }
    if (point1 < point2) {
      this.currentPairings[i + 1].wins++;
      this.currentPairings[i + 1].matchPoints += 3;
      this.currentPairings[i].losses++;
    }
    if (point1 == point2) {
      this.currentPairings[i].draws++;
      this.currentPairings[i].matchPoints++;
      this.currentPairings[i + 1].draws++;
      this.currentPairings[i + 1].matchPoints++;
    }
  }
}

function addPointsCommander() {
  for (let i = 0; i < this.currentPairings.length; i += 4) {
    let input1 = document.getElementById(`${this.currentPairings[i].id}-wins`);
    let input2 = document.getElementById(
      `${this.currentPairings[i + 1].id}-wins`
    );
    let input3 = document.getElementById(
      `${this.currentPairings[i + 2].id}-wins`
    );
    let input4 = document.getElementById(
      `${this.currentPairings[i + 3].id}-wins`
    );
    let allPoints = [];
    allPoints.push({ id: this.currentPairings[i].id, points: input1.value });
    allPoints.push({
      id: this.currentPairings[i + 1].id,
      points: input2.value,
    });
    allPoints.push({
      id: this.currentPairings[i + 2].id,
      points: input3.value,
    });
    allPoints.push({
      id: this.currentPairings[i + 3].id,
      points: input4.value,
    });

    allPoints.sort((a, b) => b.points - a.points);

    let first = this.participants.find((p) => p.id == allPoints[0].id);
    let second = this.participants.find((p) => p.id == allPoints[1].id);
    first.wins++;
    first.matchPoints += 3;
    second.draws++;
    second.matchPoints++;
  }
}
