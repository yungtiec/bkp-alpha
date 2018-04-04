const createPoller = (interval, initialDelay) => {
  let timeoutId = null;
  let poller = () => {};
  return fn => {
    window.clearTimeout(timeoutId);
    console.log('huh')
    poller = () => {
      timeoutId = window.setTimeout(poller, interval);
      return fn();
    };
    if (initialDelay) {
      return timeoutId = window.setTimeout(poller, interval);
    }
    return poller();
  };
};

export const createPollingAction = (action, interval, initialDelay) => {
  console.log('hello?')
  const poll = createPoller(interval, initialDelay);
  return (dispatch, getState) => poll(() => action(dispatch, getState));
};
