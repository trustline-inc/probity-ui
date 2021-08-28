import React, { useState, useContext } from "react";
import useSWR from "swr";
import axios from "axios";
import numeral from "numeral";
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
import { request } from "node:http";

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
        {numeral(parseFloat(formatEther(balance)).toFixed(4)).format('0,0.0000')} FLR
      </span>
    </div>
  );
}

function Navbar() {
  const { chainId, activate, active } = useWeb3React<Web3Provider>();
  const [mobileMenuVisibility, setMobileMenuVisibility] = useState(false);
  const ctx = useContext(EventContext)
  const { account } = useWeb3React<Web3Provider>();
  const [requestingTestCoins, setRequestingTestCoins] = useState(false)

  const onClick = () => {
    activate(injected);
  };

  // Copy state temporarily to flip it. Seems to work better than just 
  // inverting the boolean in the onClick itself
  const toggleMobileMenuVisibility = () => {
    const currentVisibility = mobileMenuVisibility;
    setMobileMenuVisibility(!currentVisibility);
  }

  const handleFaucetRequest = async (event: React.MouseEvent) => {
    event.preventDefault()

    const cooldownPeriodEnd = window.localStorage.getItem("probity-testnet-faucet")!
    if (cooldownPeriodEnd && new Date(Number(cooldownPeriodEnd)) > new Date()) {
      const expiresAt = new Date(Number(cooldownPeriodEnd)).toLocaleString()
      return alert(`Testnet funds have already been requested in the past day. The cooldown period expires at ${expiresAt}.`)
    }

    setRequestingTestCoins(true)
    var url;
    switch (process.env.NODE_ENV) {
      case "development":
        url = "http://localhost:3000/coston"
        break
      default:
        url = "https://faucet.trustline.io/coston"
    }
    const response = await axios({
      url,
      params: {
        user: account
      }
    })
    setRequestingTestCoins(false)

    if (response.data.hash) {
      const now = new Date()
      const cooldown = now.setDate(now.getDate() + 1);
      window.localStorage.setItem("probity-testnet-faucet", String(cooldown));
      alert(
        `Sent 1,000 CFLR to ${account}. Testnet fund requests are limited to once per day.`
      )
    }
  }


  return (
    <nav className="d-flex flex-column align-items-end left-nav-flex h-100">
      <div className="container-fluid mb-3">
        <div className="d-flex flex-row justify-content-between">
          <div>
            <a className="navbar-brand" href="#/">
              <img src={logo} alt="ProbityDAO" height="30" className="logo" />
              &nbsp;ProbityDAO
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
            <NavLink className="nav-link" activeClassName="active" to="/auctions">
              <i className="fas fa-gavel" /> Auctions
            </NavLink>
          </li>
          <li className="nav-item my-1">
            <NavLink className="nav-link" activeClassName="active" to="/transactions">
              <i className="fas fa-table" /> Transactions {ctx.transactions.length > 0 && <span className="badge bg-light text-dark">{ctx.transactions.length}</span>}
            </NavLink>
          </li>
        </ul>
        <div className="spacer spacer-1" />
        <form className="row gx-3 gy-2 align-items-center">
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
              <div>
                <button
                  className="btn btn-light"
                  type="button"
                  style={{ width: 140 }}
                  onClick={handleFaucetRequest}
                  disabled={requestingTestCoins}
                >
                  {
                    requestingTestCoins ? (
                      <i className="fas fa-circle-notch fa-spin"></i>
                    ) : (
                      <span><i className="mr-2" /> Request CFLR</span>
                    )
                  }
                </button>
              </div>
            </>
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
