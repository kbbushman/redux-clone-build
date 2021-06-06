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

    this.props.dispatch(
      handleAddTodo(this.input.value, () => {
        this.input.value = '';
      })
    );
  };

  removeItem = (todo) => {
    this.props.dispatch(handleDeleteTodo(todo));
  };

  toggleItem = (id) => {
    this.props.dispatch(handleToggleTodo(id));
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

class ConnectedTodos extends React.Component {
  render() {
    return (
      <Context.Consumer>
        {(store) => {
          const { todos } = store.getState();
          return <Todos todos={todos} dispatch={store.dispatch} />;
        }}
      </Context.Consumer>
    );
  }
}

class Goals extends React.Component {
  addItem = (e) => {
    e.preventDefault();

    this.props.dispatch(
      handleAddGoal(this.input.value, () => {
        this.input.value = '';
      })
    );
  };

  removeItem = (goal) => {
    this.props.dispatch(handleDeleteGoal(goal));
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

class ConnectedGoals extends React.Component {
  render() {
    return (
      <Context.Consumer>
        {(store) => {
          const { goals } = store.getState();
          return <Goals goals={goals} dispatch={store.dispatch} />;
        }}
      </Context.Consumer>
    );
  }
}

class App extends React.Component {
  componentDidMount() {
    const { store } = this.props;

    store.dispatch(handleInitialData());

    store.subscribe(() => this.forceUpdate());
  }

  render() {
    const { loading } = this.props.store.getState();

    if (loading) {
      return <h3>Loading...</h3>;
    }

    return (
      <div>
        <ConnectedTodos />
        <ConnectedGoals />
      </div>
    );
  }
}

class ConnectedApp extends React.Component {
  render() {
    return (
      <Context.Consumer>{(store) => <App store={store} />}</Context.Consumer>
    );
  }
}

const Context = React.createContext();

class Provider extends React.Component {
  render() {
    return (
      <Context.Provider value={this.props.store}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('root')
);
