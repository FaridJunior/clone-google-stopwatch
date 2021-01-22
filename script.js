(function () {
  const screen = document.querySelector(".stopwatch__screen");
  const stopWatchSwitch = document.querySelector("#switch");
  const resetStopWatch = document.querySelector("#reset");
  const daysScreen = document.querySelector(".days__screen");
  const hoursScreen = document.querySelector(".hours__screen");
  const minutesScreen = document.querySelector(".minutes__screen");
  const secondsScreen = document.querySelector(".seconds__screen");
  const millisecondScreen = document.querySelector(".millisecond__screen");

  const stopWatch = (onChange) => {
    let count = 0;
    let timeInterval; // time  between two increase function
    let startTime;
    let interval;

    function increase() {
      const now = Date.now();
      timeInterval = now - startTime;
      count = count + timeInterval;
      onChange();
      startTime = now;
    }
    function decrease() {
      count--;
      onChange();
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
      console.log(count);
      onChange();
    }
    function getCount() {
      return count;
    }
    function getState() {
      interval === null ? false : true;
    }
    return { start, stop, reset, getCount, getState };
  };

  const { start, stop, reset, getCount, getState } = stopWatch(handleChange);

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
    //  it need to be changed to depend on counter state not dataset
    if (stopWatchSwitch.dataset.state === "false") {
      start();
      stopWatchSwitch.dataset.state = "true";
    } else {
      stop();
      stopWatchSwitch.dataset.state = "false";
    }
  });
  resetStopWatch.addEventListener("click", () => {
    stopWatchSwitch.dataset.state = "false";
    reset();
  });
})();
