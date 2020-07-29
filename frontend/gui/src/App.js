import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Profile from './Profile/Profile';
import {
  BrowserRouter,
  Route,
  Switch
} from "react-router-dom"

class App extends Component {

  state = {
    persons: [
      { name: "Ilya", age: 28 },
      { name: "Frodo", age: 34 },
      { name: "Chloe", age: 30 }
    ]
  }

  componentDidMount() {
    fetch("http://localhost:8000/profile/admin")
      .then(response => {
        if (response.status > 400) {
          return this.setState(() => {
            return { persons: [{name: "ajsd", age: 223}] };
          });
        }
        return response;
      })
      .then(data => {
        this.setState(() => {
          console.log(data);
          return {
            data,
            loaded: true
          };
        });
      });
  }

  render() {

    const { history } = this.props

    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route history={history} path='/' component={Profile} />
          </Switch>
        </BrowserRouter>

        <h1>Hello</h1>
        <Profile 
          name={this.state.persons[0].name} 
          age={this.state.persons[0].age} />
        <Profile 
          name={this.state.persons[1].name} 
          age={this.state.persons[1].age} > SOme text </Profile>
        <Profile 
          name={this.state.persons[2].name} 
          age={this.state.persons[2].age} />
      </div>
    );
  //return React.createElement('div', null, React.createElement('h1', {className: 'App'}, 'Hello, Hui!') )
  }
}

export default App;
