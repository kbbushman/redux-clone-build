function List(props) {
  return (
    <ul>
      {props.items.map((item) => {
        return (
          <li
            key={item.id}
            onClick={() => props.toggle && props.toggle(item.id)}
            style={{ textDecoration: item.complete ? 'line-through' : 'none' }}
          >
            <span>{item.name}</span>
            <button onClick={() => props.remove(item)}>X</button>
          </li>
        );
      })}
    </ul>
  );
}

class Todos extends React.Component {
  addItem = (e) => {
    e.preventDefault();
    const name = this.input.value;
    this.input.value = '';

    this.props.store.dispatch(
      addTodoAction({
        id: generateId(),
        name: name,
        completed: false,
      })
    );
  };

  removeItem = (todo) => {
    this.props.store.dispatch(removeTodoAction(todo.id));

    return API.deleteTodo(todo.id).catch((err) => {
      this.props.store.dispatch(addTodoAction(todo));
      alert('An error occurred. Please try again');
    });
  };

  toggleItem = (id) => {
    this.props.store.dispatch(toggleTodoAction(id));
  };

  render() {
    return (
      <div>
        <h1>Todo List</h1>
        <input
          type="text"
          placeholder="Add Todo"
          ref={(input) => (this.input = input)}
        />
        <button onClick={this.addItem}>Add Todo</button>
        <List
          items={this.props.todos}
          remove={this.removeItem}
          toggle={this.toggleItem}
        />
      </div>
    );
  }
}

class Goals extends React.Component {
  addItem = (e) => {
    e.preventDefault();
    const name = this.input.value;
    this.input.value = '';

    this.props.store.dispatch(
      addGoalAction({
        id: generateId(),
        name: name,
      })
    );
  };

  removeItem = (goal) => {
    this.props.store.dispatch(removeGoalAction(goal.id));

    return API.deleteGoal().catch((err) => {
      this.props.store.dispatch(addGoalAction(goal));
      alert('An error occurred. Please try again');
    });
  };

  render() {
    return (
      <div>
        <h1>Goals</h1>
        <input
          type="text"
          placeholder="Add Goal"
          ref={(input) => (this.input = input)}
        />
        <button onClick={this.addItem}>Add Goal</button>
        <List items={this.props.goals} remove={this.removeItem} />
      </div>
    );
  }
}

class App extends React.Component {
  componentDidMount() {
    const { store } = this.props;

    Promise.all([API.fetchTodos(), API.fetchGoals()]).then(([todos, goals]) => {
      store.dispatch(receiveDataAction(todos, goals));
    });

    store.subscribe(() => this.forceUpdate());
  }

  render() {
    const { store } = this.props;
    const { goals, todos, loading } = store.getState();

    if (loading) {
      return <h3>Loading...</h3>;
    }

    return (
      <div>
        <Todos todos={todos} store={this.props.store} />
        <Goals goals={goals} store={this.props.store} />
      </div>
    );
  }
}

ReactDOM.render(<App store={store} />, document.getElementById('root'));
