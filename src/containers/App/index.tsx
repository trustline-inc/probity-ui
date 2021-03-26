import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import useLocalStorageState from "use-local-storage-state";
import { injected } from "../../connectors";
import Navbar from '../../components/Navbar';
import Balances from '../../components/Balances';
import Equity from '../../pages/Equity';
import Loans from '../../pages/Loans';
import Vault from '../../pages/Vault';
import './index.css';

function App() {
  const { active, activate } = useWeb3React<Web3Provider>()
  const [displayInfoAlert, setDisplayInfoAlert] = useLocalStorageState("displayInfoAlert", true);

  const onClick = () => {
    activate(injected)
  }

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="offset-4 col-4">
              {
                displayInfoAlert ? (
                  <div className="alert alert-info alert-dismissible fade show" role="alert">
                    <strong><i className="fas fa-exclamation-circle"></i> Notice</strong> Only Spark (FLR) is currently supported as collateral.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => {
                      setDisplayInfoAlert(false);
                    }}></button>
                  </div>
                ) : (null)
              }
            </div>
          </div>
          <div className="row">
            <div className="offset-4 col-4">
              {
                !active && (
                  <div className="alert alert-primary alert-dismissible fade show" role="alert">
                    <strong><i className="fas fa-plug"></i></strong> You must <a href="#!" className="alert-link" onClick={onClick}>connect your wallet</a> before using this app.
                  </div>
                )
              }
            </div>
          </div>
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
