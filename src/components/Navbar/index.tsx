import React, { useState, useContext } from "react";
import { Button } from "react-bootstrap"
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
  const { account } = useWeb3React<Web3Provider>();
  const [requestingTestCoins, setRequestingTestCoins] = useState(false)

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
    try {
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
          `Sent 1,000 ${getNativeTokenSymbol(chainId!)} to ${account}. Testnet fund requests are limited to once per day.`
        )
      }
    } catch (error) {
      setRequestingTestCoins(false)
      alert("An error occurred. Please report to the Probity Telegram group.")
    }
  }

  const onClick = () => {
    activate(injected);
  };


  return (
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
            <NavLink className="nav-link" activeClassName="active" to="/assets">
              <i className="fas fa-wallet"></i> Assets
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
            <NavLink className="nav-link" activeClassName="active" to="/transfers">
              <i className="fas fa-paper-plane" /> Transfers
            </NavLink>
          </li>
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
                      disabled={requestingTestCoins}
                    >
                      {
                        requestingTestCoins ? (
                          <i className="fas fa-circle-notch fa-spin"></i>
                        ) : (
                          <span><i className="mr-2" /> Request {getNativeTokenSymbol(chainId!)}</span>
                        )
                      }
                    </Button>
                    <div className="spacer spacer-1" />
                  </>
                )
              }
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
  );
}

export default Navbar;
