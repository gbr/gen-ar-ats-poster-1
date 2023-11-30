var fft, // Allow us to analyze the song
  numBars = 1024, // The number of bars to use; power of 2 from 16 to 1024
  song, // The p5 sound object
  button,
  shockwave,
  react_x,
  react_y,
  radius,
  radius_old,
  deltarad,
  bar_height,
  isSeeking = 0,
  col = {
    r: 255,
    g: 0,
    b: 0,
  },
  col2 = {
    r: 255,
    g: 0,
    b: 0,
  };

react_x = 0;
react_y = 0;
radius = 0;
deltarad = 0;
shockwave = 0;
rot = 0;
intensity = 0;

// Load our song

// var loader = document.querySelector(".loader");
// document.getElementById("audiofile").onchange = function(event) {
//     if(event.target.files[0]) {
//         if(typeof song != "undefined") { // Catch already playing songs
//             song.disconnect();
//             song.stop();
//             clear();
//         }

//         // Load our new song
//         song = loadSound(URL.createObjectURL(event.target.files[0]));
//         loader.classList.add("loading");
//     }
// }

// function mode(action) {
//   console.log(action);
//   if (action == "play") {
//     if (!song.isPlaying()) {
//       song.play();
//     }
//     // document.getElementById("button_play").style.display = "none";
//     // document.getElementById("button_pause").style.display = "block";
//   }
//   if (action == "pause") {
//     song.pause();
//     // document.getElementById("button_play").style.display = "block";
//     // document.getElementById("button_pause").style.display = "none";
//   }
// }

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    if (getAudioContext().state !== "running") {
      getAudioContext().resume(); // Resume the audio context if needed
    }
    song.play();
  }
}

// Modify the event listener for the play button
// var playButton = document.getElementById("button_play");
// playButton.addEventListener("click", function () {
//   mode("play");
// });

var canvas;

function setup() {
  createCanvas(895, 1280, document.getElementById("canvas-ar"));
  pixelDensity(1);
  colorMode(HSB);
  angleMode(DEGREES);

  analyzer = new p5.Amplitude();

  song = loadSound("../data/ligeti-1-cut-1.mp3");

  // Bind play functionality to user interaction
  // var playButton = document.getElementById("button_play");
  // playButton.addEventListener("click", function () {
  //   if (getAudioContext().state !== "running") {
  //     getAudioContext().resume();
  //   }
  //   song.play();
  // });

  fft = new p5.FFT(0.9, 256);
  analyzer.setInput(song);
}

col.r = 125;
col.g = 40;
col.b = 40;

col2.r = 125;
col2.g = 75;
col2.b = 75;

function changeCircle() {
  //circle change

  if (col2.g > 74) {
    col2.g = col2.g + 1;
    col2.b = col2.b + 1;
  }
  if (col2.g > 93) {
    col2.g = 75;
    col2.b = 75;
  }
}

function changeBackground() {
  //background change
  if (col.g > 39) {
    col.g = col.g + 1;
    col.b = col.b + 1;
  }
  if (col.g > 75) {
    col.g = 20;
    col.b = 20;
  }
}

function changeHue() {
  if (col.r >= 0) {
    col.r = col.r + 60;
    col2.r = col2.r + 60;
  }
  if (col.r > 360) {
    col.r = 0;
    col2.r = 0;
  }
}

//when cursor isn't on the page, it will hide the navbar, play and pause button and other stuff.
// (function () {
//   var mouseTimer = null,
//     cursorVisible = true;

//   function disappearCursor() {
//     mouseTimer = null;
//     document.body.style.cursor = "none";
//     document.getElementById("hideBody").style.opacity = 0;
//     cursorVisible = false;
//   }

//   document.onmousemove = function () {
//     if (mouseTimer) {
//       window.clearTimeout(mouseTimer);
//     }
//     if (!cursorVisible) {
//       document.body.style.cursor = "default";
//       document.getElementById("hideBody").style.opacity = 100;
//       cursorVisible = true;
//     }
//     mouseTimer = window.setTimeout(disappearCursor, 3000);
//   };
// })();

function touchStarted() {
  getAudioContext().resume();
}

function draw() {
  // background(51);
  // background("#18a21a");
  background(255);
  stroke(0);

  rot = rot + intensity * 0.0000001;
  react_x = 0;
  react_y = 0;
  intensity = 0;

  if (typeof song != "undefined" && song.isLoaded() && !song.isPlaying()) {
    // Do once
    // loader.classList.remove("loading");

    song.setVolume(0.5);

    fft = new p5.FFT(0.9, 128);
    fft.waveform(numBars);
    fft.smooth(0.85);
  }

  if (typeof fft != "undefined") {
    // background(col.r,col.g,col.b);
    var spectrum = fft.analyze();

    colorMode(HSL);
    translate(width / 2, height / 2);

    //beginShape();
    const rms = max(25, 25 + analyzer.getLevel() * 50);
    const base_radius = 150;
    let offset = 440 * sin(frameCount / 400);
    var noise = 0;
    for (var i = 0; i < spectrum.length; i++) {
      rads = (PI * 2) / spectrum.length;

      bar_height = min(99999, max(spectrum[i] * 2.5, 0));

      const noise = max(0.1, 0.5);

      const dist = map(spectrum[i] * 1.4, 1, 256, 1, 80);
      var angle = map(
        (i + offset) % spectrum.length,
        0,
        spectrum.length,
        0,
        360
      );
      const dist2 = map(spectrum[i] * 1.4, 1, 256, 1, 80);
      var angle2 = map(
        (i + offset) % spectrum.length,
        0,
        spectrum.length,
        0,
        360
      );

      //for lines
      var amp = spectrum[i];
      var r = map(amp, 0, 256, 20, 100);
      var x2 = (noise + base_radius + rms + bar_height) * cos(angle);
      var y2 = (noise + base_radius + rms + bar_height) * sin(angle);

      //the  circle shape for lines
      var x = (noise + base_radius + rms + dist) * cos(angle);
      var y = (noise + base_radius + rms + dist) * sin(angle);

      // inner circle
      var x3 = r * cos(angle2);
      var y3 = r * sin(angle2);

      // stroke(col2.r, col2.g, col2.b);
      line(x2, y2, x, y);

      //circle
      // stroke(col2.r, col2.g, col2.b);
      line(0, 0, x3, y3);

      react_x += Math.cos(rads * i + rot) * (radius + bar_height);
      react_y += Math.sin(rads * i + rot) * (radius + bar_height);

      intensity += bar_height;
      //vertex(x, y);
      //var y = map(amp, 0, 256, height, 0);
      //rect(i * w, y, w - 2, height - y);
      center_x = windowWidth / 2 - react_x * 0.007;
      center_y = windowHeight / 2 - react_y * 0.007;

      radius_old = radius;
      radius = 25 + intensity * 0.002;
      deltarad = radius - radius_old;

      // stroke(col2.r, col2.g, col2.b);
      circle(0, 0, radius + 2, 0, Math.PI * 2, false);

      if (deltarad > 15) {
        shockwave = 0;
        strokeWeight(1);
        stroke(col2.r, col2.g, col2.b);
        rect(0, 0, 0, 0);

        rot = rot + 0.4;
      }
    }
  }
}
setInterval(changeCircle, 1000);
setInterval(changeBackground, 5000);
setInterval(changeHue, 10000);

// Add a touchStarted or mousePressed event to handle mobile and other devices
function touchStarted() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }
}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();

    // Save the canvas as a PNG file
    // The first argument is the filename, the second one is the file extension
    saveCanvas("myCanvas", "png");
  } else {
    if (getAudioContext().state !== "running") {
      getAudioContext().resume(); // Resume the audio context if needed
    }
    song.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
