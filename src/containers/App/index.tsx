import { useEffect, useState } from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import useSWR from 'swr';
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import useLocalStorageState from "use-local-storage-state";
import { Contract } from "ethers";
import fetcher from "../../fetcher";
import FtsoABI from "@trustline-inc/aurei/artifacts/contracts/Ftso.sol/Ftso.json";
import { FTSO_ADDRESS } from '../../constants';
import { injected } from "../../connectors";
import Navbar from "../../components/Navbar";
import Balances from "../../components/Balances";
import Capital from "../../pages/Capital";
import Loans from "../../pages/Loans";
import Transactions from "../../pages/Transactions";
import Transfers from "../../pages/Transfers";
import Auctions from "../../pages/Auctions";
import "./index.css";
import SocialLinks from "../../components/Social";
import EventContext from "../../contexts/TransactionContext"

function App() {
  const [mobileDevice, setMobileDevice] = useState(false);
  const [collateralPrice, setCollateralPrice] = useState(0.00);
  const { activate, active, library } = useWeb3React<Web3Provider>()
  const [displayInfoAlert, setDisplayInfoAlert] = useLocalStorageState(
    "displayInfoAlert",
    true
  );
  const [transactions, setTransactions]: any = useState(localStorage.getItem("probity-txs") ? JSON.parse(localStorage.getItem("probity-txs")!) : [])
  const updateTransactions = (transaction: any) => {
    const newTxs = [...transactions, transaction]
    localStorage.setItem("probity-txs", JSON.stringify(newTxs))
    setTransactions(newTxs);
  };
  const { data: price, mutate: mutatePrice } = useSWR([FTSO_ADDRESS, 'getPrice'], {
    fetcher: fetcher(library, FtsoABI.abi),
  })

  const onClick = () => {
    activate(injected);
  };

  useEffect(() => {
    const runEffect = async () => {
      if (price !== undefined) {
        setCollateralPrice(price.toNumber() / 100);
      } else {
        if (library) {
          try {
            const ftso = new Contract(FTSO_ADDRESS, FtsoABI.abi, library.getSigner())
            const result = await ftso.getPrice();
            setCollateralPrice(Number(result.toString()) / 100);
          } catch (error) {
            console.error(error)
          }
        }
      }
    }
    runEffect();
  }, [library, price]);

  useEffect(() => {
    if (library) {
      library.on("block", () => {
        mutatePrice(undefined, true);
      });

      return () => {
        library.removeAllListeners("block");
      };
    }
  }, [library, mutatePrice]);

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
          <div className="flex-grow-1 min-vh-100 page-container py-2 px-md-3">
            <div className="container-fluid">
              <div className="row mt-3">
                <div className="col-12">
                  {displayInfoAlert ? (
                    <div
                      className="alert alert-info alert-dismissible fade show"
                      role="alert"
                    >
                      <strong>
                        <i className="fas fa-exclamation-circle"></i> Notice
                      </strong>{" "}
                      Probity is now live on <a href="https://trustline.co" target="blank">Trustline's</a> private Coston testnet until a public network is available.
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
                        <Route path="/stake">
                          <Capital collateralPrice={collateralPrice} />
                        </Route>
                        <Route path="/loans">
                          <Loans collateralPrice={collateralPrice} />
                        </Route>
                        <Route path="/transactions">
                          <Transactions />
                        </Route>
                        <Route path="/transfers">
                          <Transfers />
                        </Route>
                        <Route path="/auctions">
                          <Auctions collateralPrice={collateralPrice} />
                        </Route>
                        <Route path="/">
                          <Capital collateralPrice={collateralPrice} />
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
