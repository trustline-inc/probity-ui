import React from "react";
import useSWR from "swr";
import { NavLink } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";
import { injected } from "../../connectors";
import fetcher from "../../fetcher";
import logo from "../../assets/logo.png";
import "./index.css";

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
    <div className="your-balance my-3 mt-5 shadow-sm p-3 bg-white rounded">
      <h3>Your balance</h3>
      <span className="tokens">{parseFloat(formatEther(balance)).toFixed(4)} CFLR</span>
    </div>
  );
}

function Navbar() {
  const { chainId, activate, active } = useWeb3React<Web3Provider>();

  const onClick = () => {
    activate(injected);
  };

  return (
    <nav>
      <div className="container-fluid">
        <a className="navbar-brand" href="#/">
          <img src={logo} alt="Probity" height="30" className="logo" />
          &nbsp;Probity
        </a>
        {/* <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button> */}

        <Balance />

        <ul className="navbar-nav my-4">
          <li className="nav-item my-1">
            <NavLink className="nav-link" activeClassName="active" to="/vault">
              <i className="fas fa-lock" /> Vault
            </NavLink>
          </li>
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
        </ul>
        <br />
        <br />
        <form className="row gx-3 gy-2 align-items-center">
          {chainId ? (
            <div className="col-auto">
              <div className="w-100">Chain ID: {chainId}</div>
            </div>
          ) : null}
          <br />
          <div className="col-auto">
            {active ? (
              <div className="w-100">
                <i className="inline-block far fa-dot-circle text-success" />
                &nbsp;Connected
              </div>
            ) : (
              <button
                className="btn btn-outline-success"
                type="button"
                onClick={onClick}
              >
                <i className="fas fa-wallet mr-2" /> Connect your wallet
              </button>
            )}
          </div>
        </form>
      </div>
    </nav>
  );
}

export default Navbar;
