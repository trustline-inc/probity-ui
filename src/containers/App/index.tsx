import { useEffect, useState } from "react";
import {
  HashRouter as Router,
  Switch,
  Route
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
import { getNativeTokenSymbol } from "../../utils";

function App() {
  const [showConnectorModal, setShowConnectorModal] = useState(false);
  const handleClose = () => setShowConnectorModal(false);
  const handleShow = () => setShowConnectorModal(true);
  const [mobileDevice, setMobileDevice] = useState(false);
  const [collateralPrice, setCollateralPrice] = useState(0.00);
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

  useEffect(() => {
    ;(async () => {
      try {
        if (data !== undefined) {
          setCollateralPrice((Number(utils.formatEther(data._price.toString()).toString()) / 1e9));
        } else {
          if (library) {
            try {
              const ftso = new Contract(FTSO, FtsoABI.abi, library.getSigner())
              const result = await ftso.getCurrentPrice();
              setCollateralPrice((Number(utils.formatEther(result._price.toString()).toString()) / 1e9));
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
        {/* Navbar */}
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
              <div className="row">
                <div className="offset-md-3 offset-lg-3 col-lg-6 col-md-6  col-sm-12">
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
                    </>
                  )}
                </div>
              </div>
              <div className="row">
                {active ? (
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
                            <Treasury collateralPrice={collateralPrice} />
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
                            <Loans collateralPrice={collateralPrice} />
                          </div>
                          <div className="col-xl-4 col-lg-6 col-md-12">
                            {active && (
                              <AssetContext.Provider value={{ asset, updateAsset }}>
                                <Balances />
                              </AssetContext.Provider>
                            )}
                          </div>
                        </Route>
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
                            <Liquidations collateralPrice={collateralPrice} />
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
                            <Auctions collateralPrice={collateralPrice} />
                          </div>
                          <div className="col-xl-3 col-lg-6 col-md-12">
                            {active && (
                              <AssetContext.Provider value={{ asset, updateAsset }}>
                                <Balances />
                              </AssetContext.Provider>
                            )}
                          </div>
                        </Route>
                        <Route path="/transactions">
                          <div className="col-xl-9 col-lg-12 col-md-12">
                            <Transactions />
                          </div>
                          <div className="col-xl-3 col-lg-4 col-md-12">
                            {active && (
                              <AssetContext.Provider value={{ asset, updateAsset }}>
                                <Balances />
                              </AssetContext.Provider>
                            )}
                          </div>
                        </Route>
                        <Route path="/status">
                          <div className="offset-xl-2 col-xl-5 col-lg-8 col-md-12">
                            <Status />
                          </div>
                          <div className="col-xl-3 col-lg-4 col-md-12">
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
                ) : null}
              </div>
              <div className="row">
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
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
