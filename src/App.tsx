import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import Navbar from './Navbar';
import Balances from './Balances';
import Equity from './Equity';
import Loans from './Loans';
import Vault from './Vault';
import './App.css';

function App() {
  const { active } = useWeb3React<Web3Provider>()

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container-fluid">
          <div className="row">
            <div className="col-4 offset-4">
              <Switch>
                <Route path="/vault">
                  <Vault />
                </Route>
                <Route path="/equity">
                  <Equity />
                </Route>
                <Route path="/loans">
                  <Loans />
                </Route>
              </Switch>
            </div>
            <div className="col-4">
              {active && <Balances />}
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
