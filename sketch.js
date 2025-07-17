// Declare variable to store audio player
let audioPlayer;
let delayInput;
let loopCheckboxes = [];
let sections = [
  { name: 'Beginning', start: 0, end: 60 },
  { name: 'Main Part', start: 180, end: 215 },
  { name: 'Main Part 2', start: 208, end: 225 },
  { name: 'Main Part 3', start: 222, end: 240 },
  { name: 'End', start: 278, end: 339 },
];

let loopDelayMs = 4000; // delay before looping
let loopTimeoutId = null;
let currentSpeed = 100;

function setup() {
  noCanvas();

  const main = select('main');

  // Speed controls container
  let controlsWrapper = createDiv().addClass('controls');
  controlsWrapper.parent(main);

  createButton('-5').mousePressed(() => changeSpeed(-5)).parent(controlsWrapper);
  createButton('-1').mousePressed(() => changeSpeed(-1)).parent(controlsWrapper);

  // Speed input field (free typing, clamp on blur or enter)
  let speedInput = createInput(currentSpeed.toString(), 'number');
  speedInput.size(50, 20);
  speedInput.style('text-align', 'center');
  speedInput.parent(controlsWrapper);

  speedInput.input(() => {
    // Update currentSpeed only if input is a valid number (no constraint here)
    let val = parseInt(speedInput.value());
    if (!isNaN(val)) {
      currentSpeed = val; // don't clamp here, allow typing intermediate values
      setSpeedFromInput();
    }
  });

  speedInput.elt.addEventListener('blur', () => {
    // Clamp and update input field on blur
    currentSpeed = constrain(currentSpeed, 50, 120);
    speedInput.value(currentSpeed);
    setSpeedFromInput();
  });

  speedInput.elt.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      speedInput.elt.blur(); // trigger blur to clamp value
    }
  });

  createButton('+1').mousePressed(() => changeSpeed(1)).parent(controlsWrapper);
  createButton('+5').mousePressed(() => changeSpeed(5)).parent(controlsWrapper);

  // Delay input
  let delayWrapper = createDiv().addClass('controls');
  delayWrapper.parent(main);
  let delayLabel = createDiv('Loop Delay (seconds):');
  delayLabel.style('display', 'block');
  delayLabel.parent(delayWrapper);
  delayInput = createInput((loopDelayMs / 1000).toString(), 'number');
  delayInput.size(60, 20);
  delayInput.parent(delayWrapper);
  delayInput.input(() => updateLoopDelay());

  // Jump buttons
  let jumpButtons = createDiv().addClass('controls');
  jumpButtons.parent(main);

  // Loop toggles
  let loopSection = createDiv().addClass('controls');
  loopSection.parent(main);

  sections.forEach((section, index) => {
    createButton(`${section.name}`).mousePressed(() => jumpTo(section.start)).parent(jumpButtons);
    loopCheckboxes[index] = createCheckbox(`Loop ${section.name}`);
    loopCheckboxes[index].parent(loopSection);
  });

  // Audio
  audioPlayer = createAudio("song2.mp3");
  audioPlayer.parent(main);
  audioPlayer.showControls();
  setSpeedFromInput();
}

function draw() {
  let activeLoops = sections
    .map((s, i) => ({ ...s, checked: loopCheckboxes[i].checked() }))
    .filter(s => s.checked);

  if (activeLoops.length > 0) {
    let latestEnd = Math.max(...activeLoops.map(s => s.end));
    let earliestStart = Math.min(...activeLoops.map(s => s.start));

    if (audioPlayer.time() > latestEnd) {
      if (!loopTimeoutId) {
        audioPlayer.pause();
        loopTimeoutId = setTimeout(() => {
          audioPlayer.play();
          jumpTo(earliestStart);
          setSpeedFromInput();
          loopTimeoutId = null;
        }, loopDelayMs);
      }
    }
  } else {
    if (loopTimeoutId) {
      clearTimeout(loopTimeoutId);
      loopTimeoutId = null;
      if (audioPlayer.paused) {
        audioPlayer.play();
        setSpeedFromInput();
      }
    }
  }
}

function changeSpeed(delta) {
  currentSpeed = constrain(currentSpeed + delta, 50, 120);
  setSpeedFromInput();

  // Update input field as well
  let speedInput = select('input[type=number]');
  if (speedInput) speedInput.value(currentSpeed);
}

function setSpeedFromInput() {
  audioPlayer.speed(currentSpeed / 100);
}

function updateLoopDelay() {
  loopDelayMs = int(delayInput.value()) * 1000;
}

function jumpTo(time) {
  audioPlayer.time(time);
}

if ('mediaSession' in navigator) {
  navigator.mediaSession.setActionHandler('play', () => audioPlayer.play());
  navigator.mediaSession.setActionHandler('pause', () => audioPlayer.pause());
  navigator.mediaSession.setActionHandler('seekbackward', () => changeSpeed(-5));
  navigator.mediaSession.setActionHandler('seekforward', () => changeSpeed(5));
}
