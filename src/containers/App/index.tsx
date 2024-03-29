import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useHistory
} from "react-router-dom";
import useSWR from 'swr';
import { Alert } from "react-bootstrap"
import useLocalStorageState from "use-local-storage-state";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Contract, utils } from "ethers";
import { Helmet, HelmetProvider } from "react-helmet-async";
import fetcher from "../../fetcher";
import ConnectorModal from "../../components/ConnectorModal"
import { CONTRACTS } from '../../constants';
import Navbar from "../../components/Navbar";
import Balances from "../../components/Balances";
import Lend from "../../pages/Investment";
import Loans from "../../pages/Loans";
import Exchange from "../../pages/Exchange";
import Cash from "../../pages/Cash";
import Crypto from "../../pages/Crypto";
import Assets from "../../pages/Collateral";
import Profile from "../../pages/Profile";
import Transactions from "../../pages/Transactions";
import Transfers from "../../pages/Transfers";
import Auctions from "../../pages/Auctions";
import Register from "../../pages/Register";
import Monitor from "../../pages/Monitor";
import Contracts from "../../pages/Contracts";
import { VERSION } from '../../constants';
import ExternalSites from "../../components/ExternalSites";
import EventContext from "../../contexts/TransactionContext"
import AssetContext from "../../contexts/AssetContext"
import Login from "../../pages/Login";
import axios from "axios";
import "./index.css";

function App() {
  const [showConnectorModal, setShowConnectorModal] = useState(false);
  const [auth, setAuth] = useState(() => {
    // Local storage variables are prefixed with probity__ and are snake case
    const value = localStorage.getItem("probity__auth");
    const initialValue = JSON.parse(value!);
    return initialValue || "";
  });
  const [user, setUser] = useState()
  const handleClose = () => setShowConnectorModal(false);
  const handleShow = () => setShowConnectorModal(true);
  const [mobileDevice, setMobileDevice] = useState(false);
  const [assetPrice, setAssetPrice] = useState(0.00);
  const { active, chainId, library, error } = useWeb3React<Web3Provider>()
  const [displayInfoAlert, setDisplayInfoAlert] = useLocalStorageState(
    "displayInfoAlert",
    true
  );
  const [transactions, setTransactions]: any = useState(localStorage.getItem("probity-txs") ? JSON.parse(localStorage.getItem("probity-txs")!) : [])
  const [asset, setAsset] = useState<string>("USD")
  const address = CONTRACTS[chainId!]?.USD.address
  const updateTransactions = (transaction: any) => {
    const newTxs = [...transactions, transaction]
    localStorage.setItem("probity-txs", JSON.stringify(newTxs))
    setTransactions(newTxs);
  };
  const updateAsset = (asset: string) => {
    setAsset(asset)
  }
  const { data: price, mutate } = useSWR([CONTRACTS[chainId!]?.PRICE_FEED?.address, 'getPrice', utils.id(asset)], {
    fetcher: fetcher(library, CONTRACTS[chainId!]?.PRICE_FEED?.abi),
  })

  /**
   * Save auth token to local storage
   */
  useEffect(() => {
    (async () => {
      if (auth) {
        try {
          setUser(auth.user)
          localStorage.setItem("probity__auth", JSON.stringify(auth));
        } catch (error) {
          console.error(error)
        }
      }
    })()
  }, [auth]);

  /**
   * Update asset price
   */
  useEffect(() => {
    ;(async () => {
      try {
        if (price !== undefined) {
          setAssetPrice((Number(utils.formatUnits(String(price), 27).toString())));
        } else {
          if (library) {
            try {
              const priceFeed = new Contract(CONTRACTS[chainId!].PRICE_FEED.address, CONTRACTS[chainId!].PRICE_FEED.abi, library.getSigner())
              const result = await priceFeed.callStatic.getPrice(utils.id(asset));
              setAssetPrice((Number(utils.formatUnits(String(result), 27).toString())));
            } catch (error) {
              console.error(error)
            }
          }
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [library, price, asset, chainId]);

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
    <HelmetProvider>
      <Router>
        <div className="App">
          <Helmet>
            <title>Probity</title>
          </Helmet>
          <ConnectorModal show={showConnectorModal} handleClose={handleClose} />
          {
            // (process.env.REACT_APP_REQUIRE_AUTH === "true" ? (auth && new Date(auth?.expiresAt) > new Date()) : true) ? (
            (process.env.REACT_APP_REQUIRE_AUTH === "true" ? (auth && user) : true) ? (
              <>
                <div className="d-flex main-container min-vh-100">
                  <div className="min-vh-100 left-nav">
                    <EventContext.Provider value={{ transactions, updateTransactions }}>
                      <AssetContext.Provider value={{ asset, address, updateAsset }}>
                        <Navbar setAuth={setAuth} />
                      </AssetContext.Provider>
                    </EventContext.Provider>
                  </div>
                  <div className="flex-grow-1 min-vh-100 page-container py-2 px-md-3">
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-12">
                          {displayInfoAlert ? (
                            <Alert variant="info" className="d-flex justify-content-between">
                              <div>
                                <strong>
                                  <i className="fas fa-exclamation-circle"></i> Notice
                                </strong>{" "}
                                This app is for demo purposes only.
                              </div>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="alert"
                                aria-label="Close"
                                onClick={() => {
                                  setDisplayInfoAlert(false);
                                }}
                              ></button>
                            </Alert>
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
                        <div className="row pt-3">
                          <EventContext.Provider value={{ transactions, updateTransactions }}>
                            <AssetContext.Provider value={{ asset, address, updateAsset }}>
                              <Switch>
                                {/* Profile Management */}
                                <Route path="/profile">
                                  <div className="offset-xl-1 col-xl-6 col-lg-6 col-md-12">
                                    <Profile user={user} auth={auth} />
                                  </div>
                                  <div className="col-xl-4 col-lg-6 col-md-12">
                                    {active && (
                                      <AssetContext.Provider value={{ asset, address, updateAsset }}>
                                        <Balances newActiveKey="" />
                                      </AssetContext.Provider>
                                    )}
                                  </div>
                                </Route>
                                {/* Cash Management */}
                                <Route path="/cash-management">
                                  <div className="offset-xl-1 col-xl-6 col-lg-6 col-md-12">
                                    <Cash user={user} auth={auth} />
                                  </div>
                                  <div className="col-xl-4 col-lg-6 col-md-12">
                                    {active && (
                                      <AssetContext.Provider value={{ asset, address, updateAsset }}>
                                        <Balances newActiveKey="" />
                                      </AssetContext.Provider>
                                    )}
                                  </div>
                                </Route>
                                {/* Crypto Management */}
                                <Route path="/crypto-management">
                                  <div className="offset-xl-1 col-xl-6 col-lg-6 col-md-12">
                                    <Crypto user={user} auth={auth} />
                                  </div>
                                  <div className="col-xl-4 col-lg-6 col-md-12">
                                    {active && (
                                      <AssetContext.Provider value={{ asset, address, updateAsset }}>
                                        <Balances newActiveKey="" />
                                      </AssetContext.Provider>
                                    )}
                                  </div>
                                </Route>
                                {/* Exchange */}
                                <Route path="/exchange">
                                  <div className="offset-xl-1 col-xl-6 col-lg-8 col-md-12">
                                    <Exchange />
                                  </div>
                                  <div className="col-xl-4 col-lg-4 col-md-12">
                                    {active && (
                                      <AssetContext.Provider value={{ asset, address, updateAsset }}>
                                        <Balances newActiveKey="" />
                                      </AssetContext.Provider>
                                    )}
                                  </div>
                                </Route>
                                {/* Investment Management */}
                                <Route path="/investment">
                                  <div className="offset-xl-1 col-xl-6 col-lg-8 col-md-12">
                                    <Lend assetPrice={assetPrice} />
                                  </div>
                                  <div className="col-xl-4 col-lg-4 col-md-12">
                                    {active && (
                                      <AssetContext.Provider value={{ asset, address, updateAsset }}>
                                        <Balances newActiveKey="equity" />
                                      </AssetContext.Provider>
                                    )}
                                  </div>
                                </Route>
                                {/* Collateral Management */}
                                <Route path="/collateral-management">
                                  <div className="offset-xl-1 col-xl-6 col-lg-6 col-md-12">
                                    <Assets />
                                  </div>
                                  <div className="col-xl-4 col-lg-6 col-md-12">
                                    {active && (
                                      <AssetContext.Provider value={{ asset, address, updateAsset }}>
                                        <Balances newActiveKey="assets" />
                                      </AssetContext.Provider>
                                    )}
                                  </div>
                                </Route>
                                {/* Loan Management */}
                                <Route path="/loans">
                                  <div className="offset-xl-1 col-xl-6 col-lg-6 col-md-12">
                                    <Loans assetPrice={assetPrice} />
                                  </div>
                                  <div className="col-xl-4 col-lg-6 col-md-12">
                                    {active && (
                                      <AssetContext.Provider value={{ asset, address, updateAsset }}>
                                        <Balances newActiveKey="debt" />
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
                                      <AssetContext.Provider value={{ asset, address, updateAsset }}>
                                        <Balances newActiveKey="currencies" />
                                      </AssetContext.Provider>
                                    )}
                                  </div>
                                </Route>
                                {/* Health Monitor */}
                                <Route path="/monitor">
                                  <div className="offset-xl-1 col-xl-6 col-lg-8 col-md-12">
                                    <Monitor assetPrice={assetPrice} />
                                  </div>
                                  <div className="col-xl-4 col-lg-4 col-md-12">
                                    {active && (
                                      <AssetContext.Provider value={{ asset, address, updateAsset }}>
                                        <Balances newActiveKey="currencies" />
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
                                      <AssetContext.Provider value={{ asset, address, updateAsset }}>
                                        <Balances newActiveKey="currencies" />
                                      </AssetContext.Provider>
                                    )}
                                  </div>
                                </Route>
                                <Route path="/transactions">
                                  <div className="col-xl-8 col-lg-12 col-md-12">
                                    <Transactions />
                                  </div>
                                  <div className="col-xl-4 col-lg-4 col-md-12">
                                    {active && (
                                      <AssetContext.Provider value={{ asset, address, updateAsset }}>
                                        <Balances newActiveKey="" />
                                      </AssetContext.Provider>
                                    )}
                                  </div>
                                </Route>
                                <Route path="/contracts">
                                  <div className="offset-xl-1 col-xl-6 col-lg-8 col-md-12">
                                    <Contracts />
                                  </div>
                                  <div className="col-xl-4 col-lg-4 col-md-12">
                                    {active && (
                                      <AssetContext.Provider value={{ asset, address, updateAsset }}>
                                        <Balances newActiveKey="" />
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
              <div className="main-container vh-100">
                <div className="vh-100 d-flex align-items-center">
                  <Switch>
                    <Route path="/login/callback">
                      <LoginCallback setAuth={setAuth} />
                    </Route>
                    <Route path="/register">
                      <div className="offset-xl-3 col-xl-6 offset-lg-2 col-lg-8 col-md-12">
                        <Register error={null} setAuth={setAuth} />
                      </div>
                    </Route>
                    <Route path="*">
                      <div className="offset-xl-3 col-xl-6 offset-lg-2 col-lg-8 col-md-12">
                        <Login error={null} setAuth={setAuth} />
                      </div>
                    </Route>
                  </Switch>
                </div>
              </div>
            )
          }
        </div>
      </Router>
    </HelmetProvider>
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
        const params = new URLSearchParams(location.search);
        const code = params.get("code")

        // Get auth token
        let url;
        if (process.env.NODE_ENV === "production")
          url = `https://api.trustline.co/v1/auth/token`
        else
          url = `http://localhost:8080/v1/auth/token`
        let response = await axios({
          method: "GET",
          url,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          params: { code }
        })

        const { access_token: accessToken, id_token: idToken, expires_in: expiresIn } = response.data
        const expiresAt = new Date()
        expiresAt.setSeconds(expiresAt.getSeconds() + Number(expiresIn))

        if (accessToken) {
          response = await axios({
            method: "GET",
            url: "https://api.global.id/v1/identities/me",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${accessToken}`
            }
          })

          if (response.status === 200) {
            setAuth({ accessToken, idToken, expiresAt })
            history.push("/profile")
          } else {
            console.error(response)
          }
        } else {
          history.push("/login", { error: "There was an error." })
        }
      } catch (error: any) {
        console.log("Failed to fetch identity.")
        console.error(error)

        if (error?.response?.status === 401) {
          history.push("/login", { error: "Unauthorized." })
        } else {
          history.push("/login", { error: error.toString() })
        }
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
