function todosReducer(state = [], action) {
  if (action.type === 'ADD_TODO') {
    return state.concat([action.todo]);
  }

  return state;
}

function createStore(reducer) {
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
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };

  return {
    getState,
    subscribe,
    dispatch,
  };
}

const store = createStore(todosReducer);
console.log(store);
store.getState();
const unsubscribe = store.subscribe(() => {
  console.log('The state is : ', store.getState());
});
store.dispatch({
  type: 'ADD_TODO',
  todo: {
    id: 0,
    name: 'Build Redux',
    complete: false,
  },
});
store.dispatch({
  type: 'ADD_TODO',
  todo: {
    id: 1,
    name: 'Keep Build Redux',
    complete: true,
  },
});
