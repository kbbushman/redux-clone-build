function todosReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.todo]);
    case 'REMOVE_TODO':
      return state.filter((todo) => todo.id !== action.id);
    case 'TOGGLE_TODO':
      return state.map((todo) =>
        todo.id !== action.id
          ? todo
          : Object.assign({}, todo, { complete: !todo.complete })
      );
    default:
      return state;
  }
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
store.dispatch({
  type: 'REMOVE_TODO',
  id: 1,
});
store.dispatch({
  type: 'TOGGLE_TODO',
  id: 0,
});
