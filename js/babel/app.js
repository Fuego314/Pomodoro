'use strict';

document.addEventListener("DOMContentLoaded", function () {

  var countDown = {
    start: document.getElementsByClassName('countdown-start')[0],
    stop: document.getElementsByClassName('countdown-stop')[0],
    counter: document.getElementsByClassName('countdown-number')[0],
    innerCirc: document.getElementsByClassName('inner-time-circ')[0],
    studyTimeDisp: document.getElementById('study-time'),
    breakTimeDisp: document.getElementById('break-time'),
    circSVG: document.getElementById('circ-svg'),
    timerSVG: document.getElementById('timer-svg')
  },
      timeBtn = {
    studyUp: document.getElementById('study-up'),
    breakUp: document.getElementById('break-up'),
    studyDown: document.getElementById('study-down'),
    breakDown: document.getElementById('break-down')
  };

  var timer = {
    studyTime: 25,
    breakTime: 5,
    studySecs: 0,
    breakSecs: 0,
    studyRun: false,
    breakRun: false,
    running: false
  },
      overlay = document.getElementsByClassName('overlay')[0],
      header = document.getElementById('header'),
      countInt = void 0,
      startingTime = void 0,
      setTimes = [[timer.studyTime, timer.breakTime], [timeBtn.studyUp, timeBtn.breakUp], [timeBtn.studyDown, timeBtn.breakDown], [countDown.studyTimeDisp, countDown.breakTimeDisp]];

  function startStop() {
    if (timer.running === false) {
      startTimer();
      // Hide "Start" - Show "Stop" - change innerCirc z-index to prevent multi clicks
      countDown.start.style.opacity = 0;
      countDown.innerCirc.style.zIndex = 1;
      setTimeout(function () {
        countDown.stop.style.opacity = 1;
      }, 350);
      setTimeout(function () {
        countDown.innerCirc.style.zIndex = "";
      }, 650);
      timer.running = true;
    } else {
      stopTimer();
      // Hide "Stop" - Show "Start" - change innerCirc z-index to prevent multi clicks
      countDown.stop.style.opacity = 0;
      countDown.innerCirc.style.zIndex = 1;
      setTimeout(function () {
        countDown.start.style.opacity = 1;
      }, 350);
      setTimeout(function () {
        countDown.innerCirc.style.zIndex = "";
      }, 650);
    }
  }

  function startTimer() {
    // Get user selected time and turn to seconds
    timer.studySecs = setTimes[0][0] * 60;
    timer.breakSecs = setTimes[0][1] * 60;
    timer.studyRun = true;
    // Start the countdown
    countDownDisplay(timer.studySecs);
  }

  function breakCountFn() {
    timer.breakRun = true;
    // Start the countdown
    countDownDisplay(timer.breakSecs);
  }

  function stopTimer() {
    clearInterval(countInt);

    var circPos = getComputedStyle(countDown.circSVG).getPropertyValue('stroke-dashoffset'),
        circColor = getComputedStyle(countDown.circSVG).getPropertyValue('stroke');

    countDown.circSVG.style.strokeDashoffset = circPos;
    countDown.circSVG.style.stroke = circColor;

    setTimeout(function () {
      countDown.circSVG.style.strokeDashoffset = '0px';
      countDown.circSVG.style.stroke = '#0a0ad6';
    }, 100);

    timer.running = false;
    // Reset timer animation
    countDown.circSVG.style.animation = '';
    // Return counter to show starting study time
    countDown.counter.textContent = startingTime + ':00';
  }

  function countDownDisplay(time) {
    // Set circle timer animation to user picked study time
    countDown.circSVG.style.animation = 'a ' + (time + .55) + 's linear forwards';
    var minutes, seconds;

    if (timer.breakRun === false) {
      startingTime = parseInt(time / 60, 10);
      startingTime = startingTime < 10 ? '0' + startingTime : startingTime;
    }
    countInt = setInterval(function () {
      // Turn seconds in to mintues and seconds
      minutes = parseInt(time / 60, 10);
      seconds = parseInt(time % 60, 10);
      time--;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      // Update timer display
      countDown.counter.textContent = minutes + ':' + seconds;

      if (time < 0) {
        var audio = new Audio('https://notificationsounds.com/soundfiles/352fe25daf686bdb4edca223c921acea/file-sounds-805-happy-jump.wav');
        clearInterval(countInt);
        audio.play();
        // Reset timer animation
        countDown.circSVG.style.animation = 'b .4s linear forwards';
        // If study time finished run break time
        if (timer.studyRun === true) {
          timer.studyRun = false;
          setTimeout(function () {
            breakCountFn();
          }, 420);
        } else if (timer.breakRun === true) {
          // Return counter to show starting study time
          countDown.counter.textContent = startingTime + ':00';
          // Once break timer finished change stop to start
          countDown.stop.style.opacity = 0;
          countDown.innerCirc.style.zIndex = 1;
          setTimeout(function () {
            countDown.start.style.opacity = 1;
          }, 350);
          setTimeout(function () {
            countDown.innerCirc.style.zIndex = "";
          }, 650);
          timer.breakRun = false;
          timer.running = false;
        }
      }
    }, 1000);
  }

  // Add event listeners for the time setters and display latest number
  function timeSetters(i, arr) {
    // Times up buttons and display
    arr[1][i].addEventListener('click', function () {
      if (arr[0][i] < 60 && timer.running === false) {
        arr[0][i]++;
        arr[3][i].textContent = arr[0][i];
        arr[0][0] = arr[0][0] < 10 ? '0' + arr[0][0] : arr[0][0];
        if (this.id === 'study-up') {
          countDown.counter.textContent = arr[0][0] + ':00';
        };
      }
    });
    // Times down buttons and display
    arr[2][i].addEventListener('click', function () {
      if (arr[0][i] > 1 && timer.running === false) {
        arr[0][i]--;
        arr[3][i].textContent = arr[0][i];
        arr[0][0] = arr[0][0] < 10 ? '0' + arr[0][0] : arr[0][0];
        if (this.id === 'study-down') {
          countDown.counter.textContent = arr[0][0] + ':00';
        };
      }
    });
  }

  setTimeout(function () {
    header.classList.remove('header-ani');
    overlay.classList.remove('overlay-ani');
  }, 3000);

  for (var i = 0; i < 2; i++) {
    timeSetters(i, setTimes);
  }

  countDown.timerSVG.addEventListener('click', function () {
    startStop();
  });

  // Display starting time
  countDown.counter.textContent = timer.studyTime + ':00';
});