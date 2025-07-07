// Declare variable to store audio player
let audioPlayer;
let input;
let shine_loop;
let main_loop;
const beginning_start = 0;
const beginning_end = 60; 
const main_start = 180;
const main_end = 210;
const shine_start = 210;
const shine_end = 250;

function setup() {
  // Remove canvas
  noCanvas();

  // Create audio player using path to audio file
  // This can also be a URL for a public file
  // On the p5 Editor, a file may be uploaded to Sketch Files
  // by clicking the > button on the upper left, followed by the + button
  audioPlayer = createAudio("song2.mp3");
  
  text("Speed control", 0, 60);
  let faster = createButton('+5');
  faster.position(100, 70);
  faster.mousePressed(increaseSpeed);
  input = createInput("100");
  input.position(40, 70);
  input.size(40, 16);
  input.mouseOut(setSpeed);
  let slower = createButton('-5');
  slower.mousePressed(decreaseSpeed);
  slower.position(0, 70);
  
  shine_loop = createCheckbox('loop main part 2');
  shine_loop.position(0, 230);
  
  main_loop = createCheckbox('loop main part');
  main_loop.position(0, 210);
  
  beginning_loop = createCheckbox('loop beginning');
  beginning_loop.position(0, 190);
  
  let start_main = createButton('jump to main part');
  start_main.position(0, 130);
  start_main.mousePressed(jump_to_main);
  let start_shine = createButton('jump to main part 2');
  start_shine.position(0, 160);
  start_shine.mousePressed(jump_to_shine);
  let start_beginning = createButton('jump to beginning');
  start_beginning.position(0, 100);
  start_beginning.mousePressed(jump_to_beginning);
  // Display player controls
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