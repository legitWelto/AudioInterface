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
  // Remove canvas
  noCanvas();

  const main = select('main');

  // Title
  let controlsWrapper = createDiv().addClass('controls');
  controlsWrapper.parent(main);

  // Speed control UI
  let slower = createButton('-5');
  slower.mousePressed(decreaseSpeed);
  slower.parent(controlsWrapper);

  input = createInput("100");
  input.size(40, 20);
  input.mouseOut(setSpeed);
  input.parent(controlsWrapper);

  let faster = createButton('+5');
  faster.mousePressed(increaseSpeed);
  faster.parent(controlsWrapper);

  // Section jump buttons
  let jumpButtons = createDiv().addClass('controls');
  jumpButtons.parent(main);

  let start_beginning = createButton('Jump to Beginning');
  start_beginning.mousePressed(jump_to_beginning);
  start_beginning.parent(jumpButtons);

  let start_main = createButton('Jump to Main Part');
  start_main.mousePressed(jump_to_main);
  start_main.parent(jumpButtons);

  let start_shine = createButton('Jump to Main Part 2');
  start_shine.mousePressed(jump_to_shine);
  start_shine.parent(jumpButtons);

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
    if (audioPlayer.time() > beginning_end) {
      audioPlayer.time(beginning_start);
    }
  } else if (shine_loop.checked()) {
    if (audioPlayer.time() > shine_end) {
        if (main_loop.checked()) {
          audioPlayer.time(main_start);
        } else {
          audioPlayer.time(shine_start);
        }
    }
  } else if (main_loop.checked()) {
    if (audioPlayer.time() > main_end) {
      audioPlayer.time(main_start);
    }
  }
}

function decreaseSpeed(){
  input.value(int(input.value()) - 5);
  audioPlayer.speed(input.value()/100);
}

function increaseSpeed(){
  try {
    input.value(int(input.value()) + 5);
    audioPlayer.speed(input.value()/100);
  } catch {
    console.log('couldnt update speed');
  } 
}

function setSpeed(){
  audioPlayer.speed(input.value()/100);
}

function jump_to_main() {
  audioPlayer.time(main_start);
}

function jump_to_shine() {
  audioPlayer.time(shine_start);
}

function jump_to_beginning() {
  audioPlayer.time(beginning_start);
}
