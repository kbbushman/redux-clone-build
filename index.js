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

function goalsReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_GOAL':
      return state.concat([action.goal]);
    case 'REMOVE_GOAL':
      return state.filter((goal) => goal.id !== action.id);
    default:
      return state;
  }
}

function rootReducer(state = {}, action) {
  return {
    todos: todosReducer(state.todos, action),
    goals: goalsReducer(state.goals, action),
  };
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

const store = createStore(rootReducer);
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
store.dispatch({
  type: 'ADD_GOAL',
  goal: {
    id: 0,
    name: 'Build React-Redux',
  },
});
store.dispatch({
  type: 'ADD_GOAL',
  goal: {
    id: 1,
    name: 'Build React',
  },
});
store.dispatch({
  type: 'REMOVE_GOAL',
  id: 0,
});
