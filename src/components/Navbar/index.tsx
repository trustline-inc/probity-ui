import React, { useState, useContext } from "react";
import { Button } from "react-bootstrap"
import useSWR from "swr";
import numbro from "numbro";
import { NavLink, useHistory } from "react-router-dom";
import { injected } from "../../connectors";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { utils } from "ethers";
import fetcher from "../../fetcher";
import logo from "../../assets/probity.png";
import ExternalSites from "../ExternalSites";
import EventContext from "../../contexts/TransactionContext"
import { getNativeTokenSymbol } from "../../utils";
import { CONTRACTS } from "../../constants"
import AssetContext from "../../contexts/AssetContext"
import "./index.css";

function Balance() {
  const ctx = React.useContext(AssetContext)
  const { account, library, chainId } = useWeb3React<Web3Provider>();
  const nativeTokenSymbol = getNativeTokenSymbol(chainId!)
  const currentAsset = ctx.asset || nativeTokenSymbol

  const args = currentAsset === nativeTokenSymbol ? (
    ["getBalance", account, "latest"]
  ) : (
    [CONTRACTS[chainId!]?.[currentAsset]?.address, 'balanceOf', account]
  )

  const { data: balance, mutate: mutateBalance } = useSWR(args, {
    fetcher: fetcher(library, CONTRACTS[chainId!]?.[currentAsset]?.abi)
  })

  const symbol = currentAsset

  React.useEffect(() => {
    if (library !== undefined) {
      library.on("block", () => {
        mutateBalance(undefined, true); // Update balance
      });

      return () => {
        library.removeAllListeners("block");
      };
    }
  });

  if (!balance) return null;
  return (
    <div className="your-balance my-3 mt-5 shadow-sm p-3 rounded text-truncate">
      <h3>Balance</h3>
      <span className="tokens">
        {numbro(parseFloat(utils.formatEther(balance)).toFixed(4)).format({ thousandSeparated: true, mantissa: 4, optionalMantissa: true })} {symbol}
      </span>
    </div>
  );
}

function Navbar({ setAuth }: any) {
  const { chainId, active, activate, deactivate } = useWeb3React<Web3Provider>();
  const [mobileMenuVisibility, setMobileMenuVisibility] = useState(false);
  const ctx = useContext(EventContext)
  const history = useHistory();
  // const { account } = useWeb3React<Web3Provider>();
  // const [loading, setLoading] = useState(false)

  // Copy state temporarily to flip it. Seems to work better than just 
  // inverting the boolean in the onClick itself
  const toggleMobileMenuVisibility = () => {
    const currentVisibility = mobileMenuVisibility;
    setMobileMenuVisibility(!currentVisibility);
  }

  const logout = () => {
    localStorage.removeItem("probity__auth");
    setAuth()
    history.push("/login")
  }

  // const handleFaucetRequest = async (event: React.MouseEvent) => {
  //   event.preventDefault()
  //   return window.open("https://faucet.towolabs.com/", "_blank")?.focus()
  // }

  // const whitelist = async (event: React.MouseEvent) => {
  //   setLoading(true)
  //   try {
  //     const result = await axios({
  //       url: "https://faucet.trustline.io/whitelist",
  //       params: {
  //         user: account
  //       }
  //     })
  //     if (result?.data?.reason) throw Error(result.data.reason)
  //     alert("Success!")
  //   } catch (error) {
  //     console.error(error)
  //     alert("An error occurred. Please report to the Probity Telegram group.")
  //   }
  //   setLoading(false)
  // }

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
            <NavLink className="nav-link" activeClassName="active" to="/profile">
              <i className="fa-solid fa-house-chimney-user"></i> Profile
            </NavLink>
          </li>
          {/* Hide for now */}
          {/* <li className="nav-item my-1">
            <NavLink className="nav-link" activeClassName="active" to="/cash-management">
              <i className="fa-solid fa-money-bill"></i> Cash
            </NavLink>
          </li> */}
          <li className="nav-item my-1">
            <NavLink className="nav-link" activeClassName="active" to="/crypto-management">
              <i className="fa-solid fa-wallet"></i> Crypto
            </NavLink>
          </li>
          {/* Hide exchange for now */}
          {/* <li className="nav-item my-1">
            <NavLink
              className="nav-link"
              activeClassName="active"
              to="/exchange"
            >
              <i className="fa-solid fa-exchange"></i> Exchange
            </NavLink>
          </li> */}
          <li className="nav-item my-1">
            <NavLink
              className="nav-link"
              activeClassName="active"
              to="/investment"
            >
              <i className="fa-solid fa-circle-dollar-to-slot"></i> Lend
            </NavLink>
          </li>
          <li className="nav-item my-1">
            <NavLink className="nav-link" activeClassName="active" to="/collateral-management">
              <i className="fa-solid fa-vault"></i> Collateral
            </NavLink>
          </li>
          <li className="nav-item my-1">
            <NavLink className="nav-link" activeClassName="active" to="/loans">
              <i className="fas fa-scale-unbalanced"></i> Borrow
            </NavLink>
          </li>
          {
            // Only show Transfers tab if the bridge contract is in the env.
            CONTRACTS[chainId!]?.BRIDGE?.address && (
              <li className="nav-item my-1">
                <NavLink className="nav-link" activeClassName="active" to="/transfers">
                  <i className="fas fa-paper-plane" /> Transfer
                </NavLink>
              </li>
            )
          }
          <li className="nav-item my-1">
            <NavLink className="nav-link" activeClassName="active" to="/monitor">
              <i className="fa-solid fa-heart-pulse"></i> Monitor
            </NavLink>
          </li>
          <li className="nav-item my-1">
            <NavLink className="nav-link" activeClassName="active" to="/auctions">
              <i className="fas fa-gavel" /> Auctions
            </NavLink>
          </li>
          <li className="nav-item my-1">
            <NavLink className="nav-link" activeClassName="active" to="/transactions">
              <i className="fa-solid fa-clock-rotate-left"></i> Transactions {ctx.transactions.length > 0 && <span className="badge bg-light text-dark">{ctx.transactions.length}</span>}
            </NavLink>
          </li>
          <li className="nav-item my-1">
            <NavLink className="nav-link" activeClassName="active" to="/contracts">
              <i className="fas fa-file-contract" /> Contracts
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
              {/* {
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
              } */}
              {/*
                <Button variant="light" onClick={whitelist}>
                  {loading ? (<i className="fa fa-spinner fa-spin" />) : "Whitelist Address"}
                </Button>
                <div className="spacer spacer-1" />
              */}
              <Button variant="light" onClick={deactivate}>Disconnect</Button>
              {process.env.REACT_APP_REQUIRE_AUTH === "true" && <Button variant="primary" onClick={logout}>Logout</Button>}
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
        <ExternalSites />
        <small>{process.env.REACT_APP_VERSION}</small>
      </div>
    </nav>
  );
}

export default Navbar;
