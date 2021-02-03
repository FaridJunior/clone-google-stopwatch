(function () {
  const watchButtons = document.querySelectorAll(".watch__button");
  const stopwatchComponent = document.querySelector(".stopwatch-component");
  const timerComponent = document.querySelector(".timer-component");

  setStopwatch();
  setTimer();
  function toggleBetwenStopWatchAndTimer(e) {
    const element = e.currentTarget;
    if (element.dataset.active === "true") return;
    element.setAttribute("data-active", "true");
    if (element.dataset.type === "timer") {
      // active timer
      watchButtons[1].setAttribute("data-active", "false");
      stopwatchComponent.style.display = "none";
      timerComponent.style.display = "block";
    } else {
      // active stop watch
      watchButtons[0].setAttribute("data-active", "false");
      timerComponent.style.display = "none";
      stopwatchComponent.style.display = "block";
    }
  }
  watchButtons.forEach((btn) =>
    btn.addEventListener("click", toggleBetwenStopWatchAndTimer, false)
  );
})();

function setStopwatch() {
  const stopWatchSwitch = document.querySelector(".stopwatch-component #switch");
  const resetStopWatch = document.querySelector(".stopwatch-component #reset");
  const daysScreen = document.querySelector(".stopwatch-component .days__screen");
  const hoursScreen = document.querySelector(".stopwatch-component .hours__screen");
  const minutesScreen = document.querySelector(".stopwatch-component .minutes__screen");
  const secondsScreen = document.querySelector(".stopwatch-component .seconds__screen");
  const millisecondScreen = document.querySelector(".stopwatch-component .millisecond__screen");
  const { start, stop, reset, getCount, getState } = watch(handleChange);

  function handleChange() {
    const count = getCount();
    //    I think it is not the best way to calculat seconds and minutes and hours
    const second = Math.floor(count / 1000) % 60;
    const minute = Math.floor(count / 60000) % 60;
    const hour = Math.floor(count / 3.6e6) % 24;
    const days = Math.floor(count / 8.64e7);

    millisecondScreen.textContent = Math.floor((count / 10) % 100);
    secondsScreen.textContent = second;
    minutesScreen.textContent = minute ? minute : "";
    hoursScreen.textContent = hour ? hour : "";
    daysScreen.textContent = days ? days : "";
  }

  stopWatchSwitch.addEventListener("click", (e) => {
    if (getState()) {
      stop();
      stopWatchSwitch.dataset.state = "false";
    } else {
      start();
      stopWatchSwitch.dataset.state = "true";
    }
  });

  resetStopWatch.addEventListener("click", () => {
    stopWatchSwitch.dataset.state = "false";
    reset();
  });
}

function setTimer() {
  let time = 300000;
  const screen = document.querySelector(".timer__screen");
  const timerInput = document.querySelector(".timer-input");
  const timerSwitch = document.querySelector(".timer-component #switch");
  const resetTimer = document.querySelector(".timer-component #reset");
  const daysScreen = document.querySelector(".timer-component .days__screen");
  const hoursScreen = document.querySelector(".timer-component .hours__screen");
  const minutesScreen = document.querySelector(".timer-component .minutes__screen");
  const secondsScreen = document.querySelector(".timer-component .seconds__screen");
  const millisecondScreen = document.querySelector(".timer-component .millisecond__screen");
  const { start, stop, reset, getCount, getState } = watch(handleChange);

  timerInput.focus();

  function handleChange() {
    let remain = time - getCount();

    if (remain <= 0) {
      remain = 0;
      timerSwitch.click();
    }
    //    I think it is not the best way to calculat seconds and minutes and hours
    const second = Math.floor(remain / 1000) % 60;
    const minute = Math.floor(remain / 60000) % 60;
    const hour = Math.floor(remain / 3.6e6) % 24;
    const days = Math.floor(remain / 8.64e7);

    millisecondScreen.textContent = Math.floor((remain / 10) % 100);
    secondsScreen.textContent = second;
    minutesScreen.textContent = minute ? minute : "";
    hoursScreen.textContent = hour ? hour : "";
    daysScreen.textContent = days ? days : "";
  }

  timerSwitch.addEventListener("click", (e) => {
    if (getState()) {
      stop();
      timerSwitch.dataset.state = "false";
    } else {
      start();
      timerSwitch.dataset.state = "true";
    }
  });
  resetTimer.addEventListener("click", () => {
    timerSwitch.dataset.state = "false";
    reset();
  });
  screen.addEventListener("click", () => {
    timerInput.style.display = "inline";
    timerInput.focus();
  });

  timerInput.addEventListener("blur", () => {
    timerInput.style.display = "none";
  });
  timerInput.addEventListener("change", (e) => {
    time = parseInt(e.currentTarget.value) * 60000;
    handleChange();
  });
}

function watch(onChange) {
  // watch it is jop to give how many ms have passed you can stop count or rest or what do you want
  let count = 0;
  let timeInterval; // time  between two increase function
  let startTime;
  let interval = null;

  function increase() {
    const now = Date.now();
    timeInterval = now - startTime;
    count = count + timeInterval;
    onChange();
    startTime = now;
  }
  function clearStopWatchInterval() {
    clearInterval(interval);
    interval = null;
  }

  function start() {
    clearStopWatchInterval();
    // setInterval is not trusted https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
    startTime = Date.now();
    interval = setInterval(increase, 50);
    onChange();
  }

  function stop() {
    clearStopWatchInterval();
    onChange();
  }

  function initCount(countArg = 0) {
    count = countArg;
  }

  function reset() {
    stop();
    initCount();
    onChange();
  }

  function getCount() {
    return count;
  }

  function getState() {
    return interval === null ? false : true;
  }
  return { start, stop, reset, getCount, getState };
}
