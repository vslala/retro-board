import React from 'react';
import {HashRouter as Router, Route} from 'react-router-dom'
import './App.css';
import HomePage from "./containers/HomePage";
import RetroBoard from "./containers/RetroBoard";

class App extends React.Component {
  
  render() {
    return (
      <Router>
        <Route exact path={"/"} component={HomePage} />
        <Route exact path={"/retro-board"} component={RetroBoard} />
      </Router>
    )
  }
}

export default App;
