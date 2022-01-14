import React, { useState, useContext } from "react";
import { Button, Modal } from "react-bootstrap"
import useSWR from "swr";
import axios from "axios";
import numeral from "numeral";
import { NavLink } from "react-router-dom";
import { injected } from "../../connectors";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";
import fetcher from "../../fetcher";
import logo from "../../assets/probity.png";
import "./index.css";
import SocialLinks from "../Social";
import EventContext from "../../contexts/TransactionContext"
import { getNativeTokenSymbol } from "../../utils";

function Balance() {
  const { account, library, chainId } = useWeb3React<Web3Provider>();
  const { data: balance, mutate } = useSWR(["getBalance", account, "latest"], {
    fetcher: fetcher(library),
  });

  React.useEffect(() => {
    if (library !== undefined) {
      library.on("block", () => {
        mutate(undefined, true); // Update balance
      });

      return () => {
        library.removeAllListeners("block");
      };
    }
  });

  if (!balance) return null;
  return (
    <div className="your-balance my-3 mt-5 shadow-sm p-3 rounded text-truncate">
      <h3>Your balance</h3>
      <span className="tokens">
        {numeral(parseFloat(formatEther(balance)).toFixed(4)).format('0,0.0000')} {getNativeTokenSymbol(chainId!)}
      </span>
    </div>
  );
}

function Navbar() {
  const { chainId, active, activate, deactivate } = useWeb3React<Web3Provider>();
  const [mobileMenuVisibility, setMobileMenuVisibility] = useState(false);
  const ctx = useContext(EventContext)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [address, setAddress] = useState("")

  // Copy state temporarily to flip it. Seems to work better than just 
  // inverting the boolean in the onClick itself
  const toggleMobileMenuVisibility = () => {
    const currentVisibility = mobileMenuVisibility;
    setMobileMenuVisibility(!currentVisibility);
  }

  const handleFaucetRequest = async (event: React.MouseEvent) => {
    event.preventDefault()
    return window.open("https://faucet.towolabs.com/", "_blank")?.focus()
  }

  const whitelist = async (event: React.MouseEvent) => {
    console.log("adding " + address + " to whitelist")
  }

  const onClick = () => {
    activate(injected);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value)
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Whitelist Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Address</label>
              <input type="text" className="form-control" onChange={onChange} />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={whitelist}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
      <nav className="d-flex flex-column align-items-end h-100">
        <div className="container-fluid mb-3">
          <div className="d-flex flex-row justify-content-between">
            <div className="mb-3">
              <a className="navbar-brand" href="#/">
                <img src={logo} alt="Probity" height="50" className="logo" />
              </a>
            </div>
            <div className="navbar navbar-expand-lg navbar-light">
              <button
                className="navbar-toggler"
                type="button"
                onClick={toggleMobileMenuVisibility}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
          </div>

          <Balance />

          <ul className={`navbar-nav my-4 ${mobileMenuVisibility ? 'mobile-visible' : ''}`}>
            <li className="nav-item my-1">
              <NavLink className="nav-link" activeClassName="active" to="/wallet">
                <i className="fas fa-wallet"></i> Wallet
              </NavLink>
            </li>
            <li className="nav-item my-1">
              <NavLink
                className="nav-link"
                activeClassName="active"
                to="/treasury"
              >
                <i className="fa fa-landmark"></i> Treasury
              </NavLink>
            </li>
            <li className="nav-item my-1">
              <NavLink className="nav-link" activeClassName="active" to="/loans">
                <i className="fas fa-hand-holding-usd"></i> Loans
              </NavLink>
            </li>
            <li className="nav-item my-1">
              <NavLink className="nav-link" activeClassName="active" to="/stablecoins">
                <i className="fas fa-coins"></i> Stablecoins
              </NavLink>
            </li>
            {
              // Only show Transfers tab if the bridge contract is in the env.
              process.env.BRIDGE && (
                <li className="nav-item my-1">
                  <NavLink className="nav-link" activeClassName="active" to="/transfers">
                    <i className="fas fa-paper-plane" /> Transfers
                  </NavLink>
                </li>
              )
            }
            <li className="nav-item my-1">
              <NavLink className="nav-link" activeClassName="active" to="/liquidations">
                <i className="fas fa-hand-holding-water" /> Liquidations
              </NavLink>
            </li>
            <li className="nav-item my-1">
              <NavLink className="nav-link" activeClassName="active" to="/auctions">
                <i className="fas fa-gavel" /> Auctions
              </NavLink>
            </li>
            <li className="nav-item my-1">
              <NavLink className="nav-link" activeClassName="active" to="/transactions">
                <i className="fas fa-table" /> Transactions {ctx.transactions.length > 0 && <span className="badge bg-light text-dark">{ctx.transactions.length}</span>}
              </NavLink>
            </li>
            <li className="nav-item my-1">
              <NavLink className="nav-link" activeClassName="active" to="/status">
                <i className="fas fa-signal" /> Status
              </NavLink>
            </li>
          </ul>
          <div className="spacer spacer-1" />
          <form className="row gx-3 gy-2 align-items-center" style={{ display: "block" }}>
            {chainId ? (
              <div className="chain-info">Chain ID: {chainId}</div>
            ) : null}
            {active ? (
              <>
                <div className="mt-2 connected">
                  <i className="inline-block far fa-dot-circle text-success" />
                  &nbsp;Connected
                </div>
                <div className="spacer spacer-1" />
                {
                  chainId === 16 && (
                    <>
                      <Button
                        variant="light"
                        onClick={handleFaucetRequest}
                      >
                        <span><i className="mr-2" /> Use Faucet ({getNativeTokenSymbol(chainId!)})</span>
                      </Button>
                      <div className="spacer spacer-1" />
                    </>
                  )
                }
                <Button variant="light" onClick={handleShow}>Whitelist Address</Button>
                <div className="spacer spacer-1" />
                <Button variant="light" onClick={deactivate}>Disconnect</Button>
              </>
            ): (
              <div className="mt-2">
                <button
                  className="btn btn-light text-success"
                  type="button"
                  onClick={onClick}
                >
                  <i className="fas fa-wallet mr-2" /> Connect to a wallet
                </button>
              </div>
            )}
          </form>
        </div>
        <div className="mt-auto container-fluid text-center">
          <SocialLinks />
          <small>{process.env.REACT_APP_VERSION}</small>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
