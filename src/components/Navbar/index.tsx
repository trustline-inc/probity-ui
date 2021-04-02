import React from 'react';
import useSWR from 'swr';
import { NavLink } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { formatEther } from '@ethersproject/units';
import { injected } from "../../connectors";
import fetcher from "../../fetcher";

function Balance() {
  const { account, library } = useWeb3React<Web3Provider>()
  const { data: balance, mutate } = useSWR(['getBalance', account, 'latest'], {
    fetcher: fetcher(library),
  })

  React.useEffect(() => {
    if (library !== undefined) {
      library.on('block', () => {
        mutate(undefined, true)  // Update balance
      })

      return () => {
        library.removeAllListeners('block')
      }
    }
  })

  if (!balance) return null
  return <div className="border rounded py-1 px-2">{parseFloat(formatEther(balance)).toFixed(4)} FLR</div>
}

function Navbar() {
  const { chainId, activate, active } = useWeb3React<Web3Provider>()

  const onClick = () => {
    activate(injected)
  }

  return (
    <div className="Navbar">
      <nav className="navbar navbar-expand navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#/">Probity</a>
          <div className="collapse navbar-collapse mx-4" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to="/vault">Vault</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to="/capital">Capital</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to="/loans">Loans</NavLink>
              </li>
            </ul>
            <form className="row gx-3 gy-2 align-items-center">
              {
                chainId ? (
                  <div className="col-auto">
                    <div className="w-100">Chain ID: {chainId}</div>
                  </div>
                ) : (null)
              }
              <div className="col-auto">
                {
                  active ? (
                    <div className="w-100"><i className="inline-block far fa-dot-circle text-success" />&nbsp;Connected</div>
                  ) : (
                    <button className="btn btn-outline-success" type="button" onClick={onClick}>Connect</button>
                  )
                }
              </div>
            </form>
          </div>
          <Balance />
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
