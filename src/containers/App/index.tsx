import { useEffect, useState } from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import useLocalStorageState from "use-local-storage-state";
import { injected } from "../../connectors";
import Navbar from "../../components/Navbar";
import Balances from "../../components/Balances";
import Capital from "../../pages/Capital";
import Loans from "../../pages/Loans";
import Transactions from "../../pages/Transactions";
import Vault from "../../pages/Vault";
import "./index.css";
import SocialLinks from "../../components/Social";
import EventContext from "../../contexts/TransactionContext"

function App() {
  const [mobileDevice, setMobileDevice] = useState(false);
  const { active, activate } = useWeb3React<Web3Provider>();
  const [displayInfoAlert, setDisplayInfoAlert] = useLocalStorageState(
    "displayInfoAlert",
    true
  );
  const [transactions, setTransactions]: any = useState([])
  const updateTransactions = (transaction: any) => {
    setTransactions([...transactions, transaction]);
  };

  const onClick = () => {
    activate(injected);
  };

  useEffect(() => {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      setMobileDevice(true);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <div className="d-flex main-container min-vh-100">
          <div className="min-vh-100 left-nav">
            <EventContext.Provider value={{ transactions, updateTransactions }}>
              <Navbar />
            </EventContext.Provider>
          </div>
          <div className="flex-grow-1 min-vh-100 page-container">
            <div className="container-fluid">
              <div className="row mt-3">
                <div className="col-12">
                  {displayInfoAlert ? (
                    <div
                      className="alert alert-danger alert-dismissible fade show"
                      role="alert"
                    >
                      <strong>
                        <i className="fas fa-exclamation-circle"></i> Notice
                      </strong>{" "}
                      Only testnet Spark (FLR) is currently supported as
                      collateral. This is a pre-release alpha version and is
                      only compatible with the Coston testnet. Do{" "}
                      <strong>NOT</strong> try using real money. This app is
                      currently for testing purposes only.
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                        onClick={() => {
                          setDisplayInfoAlert(false);
                        }}
                      ></button>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="row">
                <div className="offset-md-3 offset-lg-4 col-lg-4 col-md-6  col-sm-12">
                  {!active && (
                    <>
                      {mobileDevice ? (
                        <div
                          className="alert alert-primary alert-dismissible fade show"
                          role="alert"
                        >
                          {" "}
                          <strong>
                            <i className="fas fa-mobile"></i>
                          </strong>
                          &nbsp;Mobile device detected. Please use the Metamask
                          app to connect your wallet.
                        </div>
                      ) : (
                          <div className="shadow-sm border p-5 mt-5 bg-white rounded">
                          <h3>Please select a wallet to connect to this dapp:</h3>
                          <br />
                          <br />
                          <button
                            className="btn btn-outline-success"
                            type="button"
                            onClick={onClick}
                          >
                            <i className="fas fa-wallet mr-2" /> Connect wallet
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="row">
                {active ? (
                  <div className="col-md-8 col-sm-12">
                    <EventContext.Provider value={{ transactions, updateTransactions }}>
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
                        <Route path="/transactions">
                          <Transactions />
                        </Route>
                        <Route path="/">
                          <Vault />
                        </Route>
                      </Switch>
                    </EventContext.Provider>
                  </div>
                ) : null}
                <div
                  className={
                    active ? "col-md-4 col-sm-12" : `col-md-4 col-sm-12`
                  }
                >
                  {active && <Balances />}
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 mt-5">
                  <SocialLinks />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
