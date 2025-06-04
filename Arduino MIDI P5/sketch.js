let serial = new p5.WebSerial();
let portButton;

// Arduino
let pot = 0, btn1 = 0, btn2 = 0, btn3 = 0, btn4 = 0;
let enc1 = 0, enc2 = 0;
let prevBtn2 = 0;
let prevBtn3 = 0;

let playButtonRect = { x: 20, y: 200, w: 120, h: 30 };
let uploadButtonRect = { x: 160, y: 200, w: 120, h: 30 };
let fileChooser; 

// Audio
let player, effectPlayer, gainNode, filter;
let audioReady = false;
let isMuted = false;
let isReversed = false;

// Visuals
let phase = 0;
let zoff = 0;
let colors;
let glowHue = 0;
let analyser;
let energy = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 255, 255, 255);
  noFill();
  textFont("monospace");

  // WebSerial
  if (!navigator.serial) alert("WebSerial not supported in this browser.");
  navigator.serial.addEventListener("connect", portConnect);
  navigator.serial.addEventListener("disconnect", portDisconnect);
  serial.getPorts();
  serial.on("noport", makePortButton);
  serial.on("portavailable", openPort);
  serial.on("requesterror", portError);
  serial.on("data", serialEvent);
  serial.on("close", makePortButton);

player = new Tone.Player({
  url: "vision1.mp3", 
  autostart: false,
  loop: true,
  onload: () => {
    audioReady = true;
    console.log("Main track loaded");
  }
});


  gainNode = new Tone.Gain(1);
  filter = new Tone.Filter(800, "lowpass");

  player.connect(filter);
  filter.connect(gainNode);
  gainNode.toDestination();

  analyser = new Tone.Analyser("fft", 32);
  gainNode.connect(analyser);

  effectPlayer = new Tone.Player({
    url: "beat1.mp3",
    autostart: false,
    onload: () => console.log("Snare loaded")
  }).toDestination();
  fileChooser = createFileInput(handleFile);
  fileChooser.hide(); 

}

function handleFile(file) {
  if (file.type === 'audio') {
    const url = URL.createObjectURL(file.file);
    player.load(url).then(() => {
      console.log("Uploaded audio loaded");
      if (!player.loop) player.loop = true;
      if (player.state !== "started" && audioReady) {
        player.start();
      }
    }).catch(err => console.error("Audio load error:", err));
  } else {
    console.error("Not a valid audio file.");
  }
}



let lastPressedBtn = -1;
function draw() {
  enc1 = constrain(enc1, 0, 100);
enc2 = constrain(enc2, 0, 100);

  background(0, 0, 0, 80);

  // Arduino control
  if (audioReady && player.state === "started") {
    let volume = 1;
    let rate = map(enc1, 0, 100, 0.5, 1.5);
    let cutoff = map(enc2, 0, 100, 200, 10000); 
    filter.frequency.rampTo(cutoff, 0.1); 

    gainNode.gain.rampTo(isMuted ? 0 : volume, 0.1);
    player.playbackRate = rate;

    if (btn1) {
      btn1 = 0;
      lastPressedBtn = 1;
      if (filter.frequency.value > 500) {
        filter.frequency.rampTo(200, 0.3);
        gainNode.gain.rampTo(1.2, 0.3);
      } else {
        filter.frequency.rampTo(10000, 0.3);
        gainNode.gain.rampTo(1.0, 0.3);
      }
    }

    if (btn2 === 1 && prevBtn2 === 0) {
      lastPressedBtn = 2;
      const vocalGain = new Tone.Gain(0.5).toDestination(); 
      const vocal = new Tone.Player({
        url: "effect.mp3",
        autostart: true
      }).connect(vocalGain);
    }
    prevBtn2 = btn2;
    if (btn3 === 1 && prevBtn3 === 0) {
      lastPressedBtn = 3;
      const vocalGain = new Tone.Gain(1.5).toDestination(); 
      const vocal = new Tone.Player({
        url: "scratch.mp3",
        autostart: true
      });
      vocal.playbackRate = 1.3; 
      vocal.connect(vocalGain);
    }
    prevBtn3 = btn3;

    if (btn4) {
      btn4 = 0;
      lastPressedBtn = 4;
      player.playbackRate = player.playbackRate === 1 ? 0.5 : 1;
    }
  }

  if (analyser) {
    let fft = analyser.getValue();
    let bass = fft.slice(0, fft.length / 4);
    energy = bass.reduce((sum, val) => sum + Math.abs(val), 0) / bass.length;
  }

  translate(width / 2, height / 2);
push()
push();
blendMode(ADD);
for (let i = 0; i < 10; i++) {
  let radius = 10 + i * 15 - energy * 10; 
  let hue = (frameCount + i * 30) % 360;
  let alpha = map(i, 0, 9, 40, 100);

  stroke(hue, 255, 255, alpha);
  strokeWeight(map(i, 0, 9, 6, 1));
  noFill();
  ellipse(0, 0, radius, radius);
}
pop();
push();
blendMode(ADD);
for (let i = 0; i < 10; i++) {
  let radius = 1 + i * 10 - energy * 1;
  let hue = (frameCount + i * 30) % 360;
  let alpha = map(i, 0, 9, 40, 100);

  stroke(hue, 255, 255, alpha);
  strokeWeight(map(i, 0, 9, 6, 1));
  noFill();
  ellipse(0, 0, radius, radius);
}
pop();

  blendMode(ADD);
colors = [];
for (let i = 0; i < 7; i++) {
  let hue = (glowHue + i * 50 + frameCount * 0.3) % 360;
  colors.push(color(hue, 255 - energy, 255, 100 + i * 10));
}

  for (let i = 0; i < colors.length; i++) {
    stroke(colors[i]);
    strokeWeight(1.5);
    drawShape(5 + i * 0.5 + (energy * 0.05));
  }
  blendMode(BLEND);
  phase += 0.008;
  zoff += 0.005;
pop()
  // GUI
  resetMatrix();
  push();
  blendMode(BLEND);
  noStroke();
  fill(0, 200);
  rect(10, 40, 330, 150, 10);

  fill(255);
  textAlign(LEFT);
  textSize(12);
  let guiX = 20;
  let guiY = 60;

  text("ENC1:", guiX, guiY);
  drawProgressBar(guiX + 50, guiY - 10, enc1, 200);
  text(nf(enc1, 3), guiX + 260, guiY);

  guiY += 30;
  text("ENC2:", guiX, guiY);
  drawProgressBar(guiX + 50, guiY - 10, enc2, 200);
  text(nf(enc2, 3), guiX + 260, guiY);

  guiY += 40;
  let buttonStates = [btn1, btn2, btn3, btn4];
  for (let i = 0; i < 4; i++) {
    let isPressed = buttonStates[i];
    let isSelected = (lastPressedBtn === i + 1);

    fill(isSelected ? color(60, 255, 255) : (isPressed ? color(120, 255, 255) : color(80)));
    stroke(isSelected ? color(0, 255, 255) : 255);
    strokeWeight(isSelected ? 3 : 1);
    rect(guiX + i * 60, guiY, 40, 20, 5);

    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    text("B" + (i + 1), guiX + i * 60 + 20, guiY + 10);
  }
  pop();
fill(80);
stroke(255);
strokeWeight(1);
rect(playButtonRect.x, playButtonRect.y, playButtonRect.w, playButtonRect.h, 5);
rect(uploadButtonRect.x, uploadButtonRect.y, uploadButtonRect.w, uploadButtonRect.h, 5);

fill(0);
noStroke();
textAlign(CENTER, CENTER);
text("▶ Play", playButtonRect.x + playButtonRect.w / 2, playButtonRect.y + playButtonRect.h / 2);
text("🎵 Choose File", uploadButtonRect.x + uploadButtonRect.w / 2, uploadButtonRect.y + uploadButtonRect.h / 2);

  glowHue = (glowHue + 1) % 360;

}

function mousePressed() {
  if (
    mouseX >= playButtonRect.x &&
    mouseX <= playButtonRect.x + playButtonRect.w &&
    mouseY >= playButtonRect.y &&
    mouseY <= playButtonRect.y + playButtonRect.h
  ) {
    Tone.start().then(() => {
      if (audioReady) player.start();
    });
  }
  if (
    mouseX >= uploadButtonRect.x &&
    mouseX <= uploadButtonRect.x + uploadButtonRect.w &&
    mouseY >= uploadButtonRect.y &&
    mouseY <= uploadButtonRect.y + uploadButtonRect.h
  ) {
    fileChooser.elt.click(); 
  }
}


function drawProgressBar(x, y, value, maxW) {
  push()
  fill(50);
  rect(x, y, maxW, 10, 5);
  fill(180, 255, 255);
  rect(x, y, map(value, 0, 100, 0, maxW), 10, 5);
  pop()
}



function drawShape(noiseMax) {
    beginShape();
  for (let a = 0; a < TWO_PI; a += radians(2)) {
    let xoff = map(cos(a + phase), -1, 1, 0, noiseMax);
    let yoff = map(sin(a + phase), -1, 1, 0, noiseMax);
    let r = map(noise(xoff, yoff, zoff), 0, 1, 0 - (energy * 3 ), 200 - (energy * 3));
    vertex(r * cos(a), r * sin(a));
  }
  endShape(CLOSE);
  
  beginShape();
  for (let a = 0; a < TWO_PI; a += radians(2)) {
    let xoff = map(cos(a + phase), -1, 1, 0, noiseMax);
    let yoff = map(sin(a + phase), -1, 1, 0, noiseMax);
    let r = map(noise(xoff, yoff, zoff), 0, 1, 400 - (energy * (3+(energy/50)) ), 300 - (energy * 3));
    vertex(r * cos(a), r * sin(a));
  }
  endShape(CLOSE);
  beginShape();
  for (let a = 0; a < TWO_PI; a += radians(2)) {
    let xoff = map(cos(a + phase + energy/50), -1, 1, 0, noiseMax);
    let yoff = map(sin(a + phase - energy/50), -1, 1, 0, noiseMax);
    let r = map(noise(xoff, yoff, zoff), 0, 1, 400 - (energy * 3 ), 600 - (energy * 3));
    vertex(r * cos(a), r * sin(a));
  }
  endShape(CLOSE);
  
    beginShape();
  for (let a = 0; a < TWO_PI; a += radians(2)) {
    let xoff = map(cos(a + phase + energy/50), -1, 1, 0, noiseMax);
    let yoff = map(sin(a + phase - energy/50), -1, 1, 0, noiseMax);
    let r = map(noise(xoff, yoff, zoff), 0, 1, 650 - (energy * 3 ), 700 - (energy * 3));
    vertex(r * cos(a), r * sin(a));
  }
  endShape(CLOSE);
}

function serialEvent() {
  let inData = serial.readLine();
  console.log(inData);
  if (inData) {
    let parts = inData.trim().split(",");
    parts.forEach(part => {
      let [label, value] = part.split(":");
      if (value !== undefined) {
        value = int(value);
        if (label === "P1") pot = value;
        if (label === "B1") btn1 = value;
        if (label === "B2") btn2 = value;
        if (label === "B3") btn3 = value;
        if (label === "B4") btn4 = value;
        if (label === "E1") enc1 = value;
        if (label === "E2") enc2 = value;
      }
    });
  }
}

function makePortButton() {
  portButton = createButton("Choose Port");
  portButton.position(10, 50);
  portButton.mousePressed(() => serial.requestPort());
}

function openPort() {
  serial.open().then(() => console.log("Port open"));
  if (portButton) portButton.hide();
}

function portError(err) {
  console.error("Serial port error:", err);
}

function portConnect() {
  console.log("Port connected");
  serial.getPorts();
}

function portDisconnect() {
  serial.close();
  console.log("Port disconnected");
}
