//------------------------------------------- Redux Clone

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

//------------------------------------------- App Code

const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';

function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo,
  };
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id,
  };
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id,
  };
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal,
  };
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id,
  };
}

function todosReducer(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]);
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id);
    case TOGGLE_TODO:
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

const store = createStore(rootReducer);

const unsubscribe = store.subscribe(() => {
  // console.log('The state is : ', store.getState());
  const { goals, todos } = store.getState();

  document.getElementById('goals').innerHTML = '';
  document.getElementById('todos').innerHTML = '';

  goals.forEach(addGoalToDOM);
  todos.forEach(addTodoToDOM);
});

//------------------------------------------- DOM Code

function createRemoveButton(onClick) {
  const removeBtn = document.createElement('button');
  removeBtn.innerHTML = 'X';
  removeBtn.addEventListener('click', onClick);
  return removeBtn;
}

function addTodoToDOM(todo) {
  const node = document.createElement('li');
  const text = document.createTextNode(todo.name);

  const removeBtn = createRemoveButton(() => {
    store.dispatch(removeTodoAction(todo.id));
  });

  node.appendChild(text);
  node.appendChild(removeBtn);

  node.style.textDecoration = todo.complete ? 'line-through' : 'none';
  node.addEventListener('click', () => {
    store.dispatch(toggleTodoAction(todo.id));
  });

  document.getElementById('todos').appendChild(node);
}

function addGoalToDOM(goal) {
  const node = document.createElement('li');
  const text = document.createTextNode(goal.name);

  const removeBtn = createRemoveButton(() => {
    store.dispatch(removeGoalAction(goal.id));
  });

  node.appendChild(text);
  node.appendChild(removeBtn);

  document.getElementById('goals').appendChild(node);
}

function generateId() {
  return (
    Math.random().toString(36).substring(2) + new Date().getTime().toString(36)
  );
}

function addTodo() {
  const input = document.getElementById('todo');
  const name = input.value;
  input.value = '';
  store.dispatch(
    addTodoAction({
      name,
      id: generateId(),
      complete: false,
    })
  );
}

function addGoal() {
  const input = document.getElementById('goal');
  const name = input.value;
  input.value = '';
  store.dispatch(
    addGoalAction({
      name,
      id: generateId(),
    })
  );
}

document.getElementById('todoBtn').addEventListener('click', addTodo);
document.getElementById('goalBtn').addEventListener('click', addGoal);
