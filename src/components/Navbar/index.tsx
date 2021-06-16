import React, { useState, useContext } from "react";
import useSWR from "swr";
import { NavLink } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";
import { injected } from "../../connectors";
import fetcher from "../../fetcher";
import logo from "../../assets/logo.png";
import "./index.css";
import SocialLinks from "../Social";
import EventContext from "../../contexts/TransactionContext"

function Balance() {
  const { account, library } = useWeb3React<Web3Provider>();
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
        {parseFloat(formatEther(balance)).toFixed(4)} FLR
      </span>
    </div>
  );
}

function Navbar() {
  const { chainId, activate, active } = useWeb3React<Web3Provider>();
  const [mobileMenuVisibility, setMobileMenuVisibility] = useState(false);
  const ctx = useContext(EventContext)

  const onClick = () => {
    activate(injected);
  };

  // Copy state temporarily to flip it. Seems to work better than just 
  // inverting the boolean in the onClick itself
  const toggleMobileMenuVisibility = () => {
    const currentVisibility = mobileMenuVisibility;
    setMobileMenuVisibility(!currentVisibility);
  }


  return (
    <nav className="d-flex flex-column align-items-end left-nav-flex h-100">
      <div className="container-fluid mb-3">
        <div className="d-flex flex-row justify-content-between">
          <div>
            <a className="navbar-brand" href="#/">
              <img src={logo} alt="Probity" height="30" className="logo" />
              &nbsp;Probity
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
            <NavLink
              className="nav-link"
              activeClassName="active"
              to="/capital"
            >
              <i className="fas fa-coins" /> Capital
            </NavLink>
          </li>
          <li className="nav-item my-1">
            <NavLink className="nav-link" activeClassName="active" to="/loans">
              <i className="fas fa-money-bill-wave-alt" /> Loans
            </NavLink>
          </li>
          <li className="nav-item my-1">
            <NavLink className="nav-link" activeClassName="active" to="/transfers">
              <i className="fas fa-paper-plane" /> Transfers
            </NavLink>
          </li>
          <li className="nav-item my-1">
            <NavLink className="nav-link" activeClassName="active" to="/transactions">
              <i className="fas fa-table" /> Transactions {ctx.transactions.length > 0 && <span className="badge bg-light text-dark">{ctx.transactions.length}</span>}
            </NavLink>
          </li>
          <li className="nav-item my-1">
            <NavLink className="nav-link" activeClassName="active" to="/liquidations">
              <i className="fas fa-tint" /> Liquidations
            </NavLink>
          </li>
        </ul>
        <div className="spacer spacer-1" />
        <form className="row gx-3 gy-2 align-items-center">
          {chainId ? (
            <div className="chain-info">Chain ID: {chainId}</div>
          ) : null}
          {active ? (
            <div className="mt-2 connected">
              <i className="inline-block far fa-dot-circle text-success" />
              &nbsp;Connected
            </div>
          ) : (
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
      <SocialLinks />
    </nav>
  );
}

export default Navbar;
