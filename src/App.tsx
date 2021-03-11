import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Navbar from './Navbar';
import Vault from './Vault';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Switch>
            <Route path="/vault">
              <Vault />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
