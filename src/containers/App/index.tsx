import React, { useEffect, useState } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import useLocalStorageState from "use-local-storage-state";
import { injected } from "../../connectors";
import Navbar from '../../components/Navbar';
import Balances from '../../components/Balances';
import Info from '../../components/Info';
import Capital from '../../pages/Capital';
import Loans from '../../pages/Loans';
import Vault from '../../pages/Vault';
import './index.css';

function App() {
  const [mobileDevice, setMobileDevice] = useState(false);
  const { active, activate } = useWeb3React<Web3Provider>()
  const [displayInfoAlert, setDisplayInfoAlert] = useLocalStorageState("displayInfoAlert", true);

  const onClick = () => {
    activate(injected)
  }

  useEffect(() => {
    if(/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      setMobileDevice(true)
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-12">
              {
                displayInfoAlert ? (
                  <div className="alert alert-info alert-dismissible fade show" role="alert">
                    <strong><i className="fas fa-exclamation-circle"></i> Notice</strong> Only testnet Spark (CFLR) is currently supported as collateral. This is a pre-release alpha version and is only compatible with the Coston testnet. Do <strong>NOT</strong> try using real money. This app is currently for testing purposes only.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => {
                      setDisplayInfoAlert(false);
                    }}></button>
                  </div>
                ) : (null)
              }
            </div>
          </div>
          <div className="row">
            <div className="offset-md-4 col-md-4 col-sm-12">
              {
                !active && (
                  <div className="alert alert-primary alert-dismissible fade show" role="alert">
                    {
                      mobileDevice ? (
                        <><strong><i className="fas fa-mobile"></i></strong>&nbsp;Mobile device detected. Please use the Metamask app to connect your wallet.</>
                      ) : (
                        <><strong><i className="fas fa-plug"></i></strong> You must <a href="#!" className="alert-link" onClick={onClick}>connect your wallet</a> before using this app.</>
                      )
                    }
                  </div>
                )
              }
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-12">
              {active && <Info />}
            </div>
            <div className="col-md-4 col-sm-12">
              <Switch>
                <Route path="/vault">
                  <Vault />
                </Route>
                <Route path="/capital">
                  <Capital />
                </Route>
                <Route path="/loans">
                  <Loans />
                </Route>
              </Switch>
            </div>
            <div className="col-md-4 col-sm-12">
              {active && <Balances />}
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
