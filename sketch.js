// Declare variable to store audio player
let audioPlayer;
let input;
let shine_loop;
let main_loop;
let beginning_loop;
const beginning_start = 0;
const beginning_end = 60; 
const main_start = 180;
const main_end = 210;
const shine_start = 210;
const shine_end = 250;

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

  // Section jump buttons
  let jumpButtons = createDiv().addClass('controls');
  jumpButtons.parent(main);
  createButton('Jump to Beginning').mousePressed(() => jumpTo(beginning_start)).parent(jumpButtons);
  createButton('Jump to Main Part').mousePressed(() => jumpTo(main_start)).parent(jumpButtons);
  createButton('Jump to Main Part 2').mousePressed(() => jumpTo(shine_start)).parent(jumpButtons);

  // Loop toggles
  let loopSection = createDiv().addClass('controls');
  loopSection.parent(main);
  beginning_loop = createCheckbox('Loop Beginning');
  beginning_loop.parent(loopSection);
  main_loop = createCheckbox('Loop Main Part');
  main_loop.parent(loopSection);
  shine_loop = createCheckbox('Loop Main Part 2');
  shine_loop.parent(loopSection);

  // Audio
  audioPlayer = createAudio("song2.mp3");
  audioPlayer.parent(main);
  audioPlayer.showControls();
}

function draw() {
  if (beginning_loop.checked()) {
    if (audioPlayer.time() > beginning_end) audioPlayer.time(beginning_start);
  } else if (shine_loop.checked()) {
    if (audioPlayer.time() > shine_end) {
      audioPlayer.time(main_loop.checked() ? main_start : shine_start);
    }
  } else if (main_loop.checked()) {
    if (audioPlayer.time() > main_end) audioPlayer.time(main_start);
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
