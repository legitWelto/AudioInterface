// Declare variable to store audio player
let audioPlayer;
let input;
let loopCheckboxes = [];
let sections = [
  { name: 'Beginning', start: 0, end: 60 },
  { name: 'Main Part', start: 180, end: 210 },
  { name: 'Main Part 2', start: 210, end: 250 }
];

function setup() {
  noCanvas();

  const main = select('main');
  let controlsWrapper = createDiv().addClass('controls');
  controlsWrapper.parent(main);

  // Speed controls
  createButton('-5').mousePressed(() => changeSpeed(-5)).parent(controlsWrapper);
  createButton('-1').mousePressed(() => changeSpeed(-1)).parent(controlsWrapper);
  input = createInput("100");
  input.size(40, 20);
  input.mouseOut(() => setSpeedFromInput()).parent(controlsWrapper);
  createButton('+1').mousePressed(() => changeSpeed(1)).parent(controlsWrapper);
  createButton('+5').mousePressed(() => changeSpeed(5)).parent(controlsWrapper);

  // Jump buttons
  let jumpButtons = createDiv().addClass('controls');
  jumpButtons.parent(main);

  // Loop toggles
  let loopSection = createDiv().addClass('controls');
  loopSection.parent(main);

  sections.forEach((section, index) => {
    createButton(`Jump to ${section.name}`).mousePressed(() => jumpTo(section.start)).parent(jumpButtons);
    loopCheckboxes[index] = createCheckbox(`Loop ${section.name}`);
    loopCheckboxes[index].parent(loopSection);
  });

  // Audio
  audioPlayer = createAudio("song2.mp3");
  audioPlayer.parent(main);
  audioPlayer.showControls();
}

function draw() {
  let currentTime = audioPlayer.time();

  // Collect active loop sections
  let activeLoops = sections
    .map((s, i) => ({ ...s, checked: loopCheckboxes[i].checked() }))
    .filter(s => s.checked);

  if (activeLoops.length > 0) {
    let latestEnd = Math.max(...activeLoops.map(s => s.end));
    let earliestStart = Math.min(...activeLoops.map(s => s.start));

    if (currentTime > latestEnd) {
      audioPlayer.time(earliestStart);
    }
  }
}

function changeSpeed(delta) {
  input.value(int(input.value()) + delta);
  audioPlayer.speed(int(input.value()) / 100);
}

function setSpeedFromInput() {
  audioPlayer.speed(int(input.value()) / 100);
}

function jumpTo(time) {
  audioPlayer.time(time);
}
