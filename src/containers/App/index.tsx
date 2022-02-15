import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useHistory
} from "react-router-dom";
import useSWR from 'swr';
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import useLocalStorageState from "use-local-storage-state";
import { Contract, utils } from "ethers";
import fetcher from "../../fetcher";
import FtsoABI from "@trustline-inc/probity/artifacts/contracts/mocks/MockFtso.sol/MockFtso.json";
import ConnectorModal from "../../components/ConnectorModal"
import { FTSO } from '../../constants';
import Navbar from "../../components/Navbar";
import Balances from "../../components/Balances";
import Treasury from "../../pages/Treasury";
import Loans from "../../pages/Loans";
import Assets from "../../pages/Assets";
import Transactions from "../../pages/Transactions";
import Transfers from "../../pages/Transfers";
import Auctions from "../../pages/Auctions";
import Liquidations from "../../pages/Liquidations";
import Status from "../../pages/Status";
import { VERSION } from '../../constants';
import "./index.css";
import ExternalSites from "../../components/ExternalSites";
import EventContext from "../../contexts/TransactionContext"
import AssetContext from "../../contexts/AssetContext"
import Stablecoins from "../../pages/Stablecoins";
import Reserves from "../../pages/Reserves";
import { getNativeTokenSymbol } from "../../utils";
import Login from "../../pages/Login";
import axios from "axios";

function App() {
  const [showConnectorModal, setShowConnectorModal] = useState(false);
  const [auth, setAuth] = useState(() => {
    // Local storage variables are prefixed with probity__ and are snake case
    const value = localStorage.getItem("probity__auth");
    const initialValue = JSON.parse(value!);
    return initialValue || "";
  });
  const handleClose = () => setShowConnectorModal(false);
  const handleShow = () => setShowConnectorModal(true);
  const [mobileDevice, setMobileDevice] = useState(false);
  const [assetPrice, setCollateralPrice] = useState(0.00);
  const { active, chainId, library, error } = useWeb3React<Web3Provider>()
  const [displayInfoAlert, setDisplayInfoAlert] = useLocalStorageState(
    "displayInfoAlert",
    true
  );
  const [transactions, setTransactions]: any = useState(localStorage.getItem("probity-txs") ? JSON.parse(localStorage.getItem("probity-txs")!) : [])
  const [asset, setAsset] = useState<string>(getNativeTokenSymbol(chainId!))
  const updateTransactions = (transaction: any) => {
    const newTxs = [...transactions, transaction]
    localStorage.setItem("probity-txs", JSON.stringify(newTxs))
    setTransactions(newTxs);
  };
  const updateAsset = (asset: string) => {
    setAsset(asset)
  }
  const { data, mutate } = useSWR([FTSO, 'getCurrentPrice'], {
    fetcher: fetcher(library, FtsoABI.abi),
  })

  /**
   * Save auth token to local storage
   */
  useEffect(() => {
    (async () => {
      const response = await axios({
        method: "GET",
        url: "https://api.global.id/v1/identities/me",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth?.token}`
        }
      })
      if (response.status === 200) {
        localStorage.setItem("probity__auth", JSON.stringify(auth));
      }
    })()
  }, [auth]);

  /**
   * Update asset price
   */
  useEffect(() => {
    ;(async () => {
      try {
        if (data !== undefined) {
          setCollateralPrice((Number(utils.formatUnits(String(data._price), 5).toString())));
        } else {
          if (library) {
            try {
              const ftso = new Contract(FTSO, FtsoABI.abi, library.getSigner())
              const result = await ftso.getCurrentPrice();
              setCollateralPrice((Number(utils.formatUnits(String(result._price), 5).toString())));
            } catch (error) {
              console.error(error)
            }
          }
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [library, data]);

  /**
   * Set block listener
   */
  useEffect(() => {
    if (library) {
      library.on("block", () => {
        mutate(undefined, true);
      });

      return () => {
        library.removeAllListeners("block");
      };
    }
  }, [library, mutate]);

  /**
   * Detect mobile device
   */
  useEffect(() => {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      setMobileDevice(true);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <ConnectorModal show={showConnectorModal} handleClose={handleClose} />
        {
          (auth && auth?.expiresAt > new Date()) ? (
            <>
              <div className="d-flex main-container min-vh-100">
                <div className="min-vh-100 left-nav">
                  <EventContext.Provider value={{ transactions, updateTransactions }}>
                    <AssetContext.Provider value={{ asset, updateAsset }}>
                      <Navbar />
                    </AssetContext.Provider>
                  </EventContext.Provider>
                </div>
                <div className="flex-grow-1 min-vh-100 page-container py-2 px-md-3">
                  <div className="container-fluid h-100">
                    <div className="row">
                      <div className="col-12">
                        {displayInfoAlert ? (
                          <div
                            className="alert alert-info alert-dismissible fade show"
                            role="alert"
                          >
                            <strong>
                              <i className="fas fa-exclamation-circle"></i> Notice
                            </strong>{" "}
                            Probity is currently running on a test network only. The Songbird release is scheduled to be available for limited testing in Q1 2022.
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

                    {!active && (
                      <div className="row h-100">
                        <div className="offset-md-3 offset-lg-3 col-lg-6 col-md-6  col-sm-12">
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
                              <div className="shadow-sm border p-5 mt-5 bg-white rounded text-center">
                              <h3>Connect a wallet to enter</h3>
                              {
                                (() => {
                                  switch (error?.name) {
                                    case "UnsupportedChainIdError":
                                      return <span className="text-danger">{error.message}</span>
                                    case "TransportError":
                                      return <span className="text-danger">{error.message}</span>
                                    case "NoEthereumProviderError":
                                      return <span className="text-danger">{error.message}</span>
                                    case undefined:
                                      return <span className="text-danger">{error?.message}</span>
                                    default:
                                      if (error?.message)
                                        return <span className="text-danger">{error?.message}</span>
                                      return JSON.stringify(error)
                                  }
                                })()
                              }
                              <br />
                              <br />
                              <button
                                className="btn btn-outline-success"
                                type="button"
                                onClick={handleShow}
                              >
                                <i className="fas fa-wallet mr-2" /> Connect wallet
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {active ? (
                      <div className="row h-100 pt-3">
                        <EventContext.Provider value={{ transactions, updateTransactions }}>
                          <AssetContext.Provider value={{ asset, updateAsset }}>
                            <Switch>
                              <Route path="/wallet">
                                <div className="offset-xl-1 col-xl-6 col-lg-6 col-md-12">
                                  <Assets />
                                </div>
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                  {active && (
                                    <AssetContext.Provider value={{ asset, updateAsset }}>
                                      <Balances />
                                    </AssetContext.Provider>
                                  )}
                                </div>
                              </Route>
                              <Route path="/treasury">
                                <div className="offset-xl-1 col-xl-6 col-lg-8 col-md-12">
                                  <Treasury assetPrice={assetPrice} />
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-12">
                                  {active && (
                                    <AssetContext.Provider value={{ asset, updateAsset }}>
                                      <Balances />
                                    </AssetContext.Provider>
                                  )}
                                </div>
                              </Route>
                              <Route path="/loans">
                                <div className="offset-xl-1 col-xl-6 col-lg-6 col-md-12">
                                  <Loans assetPrice={assetPrice} />
                                </div>
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                  {active && (
                                    <AssetContext.Provider value={{ asset, updateAsset }}>
                                      <Balances />
                                    </AssetContext.Provider>
                                  )}
                                </div>
                              </Route>
                              {/* Stablecoins */}
                              <Route path="/stablecoins">
                                <div className="offset-xl-1 col-xl-6 col-lg-6 col-md-12">
                                  <Stablecoins />
                                </div>
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                  {active && (
                                    <AssetContext.Provider value={{ asset, updateAsset }}>
                                      <Balances />
                                    </AssetContext.Provider>
                                  )}
                                </div>
                              </Route>
                              {/* Reserves */}
                              <Route path="/reserves">
                                <div className="col-xl-8 col-lg-8 col-md-12">
                                  <Reserves />
                                </div>
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                  {active && (
                                    <AssetContext.Provider value={{ asset, updateAsset }}>
                                      <Balances />
                                    </AssetContext.Provider>
                                  )}
                                </div>
                              </Route>
                              {/* Transfers */}
                              <Route path="/transfers">
                                <div className="offset-xl-1 col-xl-6 col-lg-6 col-md-12">
                                  <Transfers />
                                </div>
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                  {active && (
                                    <AssetContext.Provider value={{ asset, updateAsset }}>
                                      <Balances />
                                    </AssetContext.Provider>
                                  )}
                                </div>
                              </Route>
                              {/* Liquidations */}
                              <Route path="/liquidations">
                                <div className="offset-xl-1 col-xl-6 col-lg-8 col-md-12">
                                  <Liquidations assetPrice={assetPrice} />
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-12">
                                  {active && (
                                    <AssetContext.Provider value={{ asset, updateAsset }}>
                                      <Balances />
                                    </AssetContext.Provider>
                                  )}
                                </div>
                              </Route>
                              {/* Auctions */}
                              <Route path="/auctions">
                                <div className="col-xl-9 col-lg-12 col-md-12">
                                  <Auctions assetPrice={assetPrice} />
                                </div>
                                <div className="col-xl-3 col-lg-6 col-md-12">
                                  {active && (
                                    <AssetContext.Provider value={{ asset, updateAsset }}>
                                      <Balances />
                                    </AssetContext.Provider>
                                  )}
                                </div>
                              </Route>
                              {/* Transactions */}
                              <Route path="/transactions">
                                <div className="col-xl-8 col-lg-12 col-md-12">
                                  <Transactions />
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-12">
                                  {active && (
                                    <AssetContext.Provider value={{ asset, updateAsset }}>
                                      <Balances />
                                    </AssetContext.Provider>
                                  )}
                                </div>
                              </Route>
                              {/* Status */}
                              <Route path="/status">
                                <div className="offset-xl-1 col-xl-6 col-lg-8 col-md-12">
                                  <Status />
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-12">
                                  {active && (
                                    <AssetContext.Provider value={{ asset, updateAsset }}>
                                      <Balances />
                                    </AssetContext.Provider>
                                  )}
                                </div>
                              </Route>
                            </Switch>
                          </AssetContext.Provider>
                        </EventContext.Provider>
                      </div>
                    ) : (
                      <div className="row d-lg-none">
                        <div className="col-md-12 mt-5">
                          <div className="text-center">
                            <ExternalSites />
                            <div className="spacer spacer-1" />
                            <small className="container-fluid text-muted" id="version">
                              v{VERSION}
                            </small>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="main-container min-vh-100">
              <div className="row min-vh-100">
                <Switch>
                  <Route path="/login/callback">
                    <LoginCallback setAuth={setAuth} />
                  </Route>
                  <Route path="*">
                    <div className="offset-xl-3 col-xl-6 offset-lg-2 col-lg-8 col-md-12">
                      <Login />
                    </div>
                  </Route>
                </Switch>
              </div>
            </div>
          )
        }
      </div>
    </Router>
  );
}

const LoginCallback = ({ setAuth }: any) => {
  const location = useLocation()
  const history = useHistory()

  /**
   * Detect auth code for login
   */
  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams(location.hash.replace("#", "?"));
        const token = params.get("token")
        const expiresIn = params.get("expires_in")
        const expiresAt = new Date()
        expiresAt.setSeconds(expiresAt.getSeconds() + Number(expiresIn))

        if (token) {
          let response = await axios({
            method: "GET",
            url: "https://api.global.id/v1/identities/me",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`
            }
          })
          if (response.status === 200) {
            setAuth({ token, expiresAt })
            // TODO: address whitelisting
            history.push("/assets")
          }
        } else {
          // TODO: display error alert on login callback error
          history.push("/login")
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [location, history, setAuth])

  return (
    <div className="d-flex justify-content-center align-items-center">
      <span className="fa fa-spin fa-spinner fa-3x" />
    </div>
  )
}

export default App;
