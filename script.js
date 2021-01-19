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
    // count in this timer = 10 ms
    let count = 0;
    let interval;
    function increase() {
      count++;
      onChange();
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
      interval = setInterval(increase, 10);
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
      interval === null ? false : true;
    }
    return { start, stop, reset, getCount, getState };
  };

  const { start, stop, reset, getCount, getState } = stopWatch(handleChange);

  function handleChange() {
    const count = getCount();
    const ms = count * 10;
    //    I think it is not the best way to calculat seconds and minutes and hours
    const second = Math.floor(count / 100) % 60;
    const minute = Math.floor(count / 6000) % 60;
    const hour = Math.floor(count / 3.6e5) % 24;
    const days = Math.floor(count / 8.64e6);
    millisecondScreen.textContent = count % 100;
    secondsScreen.textContent = second;
    minute > 0 ? (minutesScreen.textContent = minute) : {};
    hour > 0 ? (hoursScreen.textContent = hour) : {};
    days > 0 ? (daysScreen.textContent = days) : {};
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
