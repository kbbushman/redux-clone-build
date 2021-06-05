function createStore() {
  let state;
  const listeners = [];

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.push(listener);

    // Unsubscribe
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  const dispatch = (action) => {
    state = todos(state, action);
    listeners.forEach((listener) => listener());
  };

  return {
    getState,
    subscribe,
    dispatch,
  };
}
