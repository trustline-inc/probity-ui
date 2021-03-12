import React from 'react';
import useSWR from 'swr';
import { BigNumber, Contract, utils } from "ethers";
import { NavLink } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import ProbityABI from "@trustline/probity/artifacts/contracts/Probity.sol/Probity.json";
import fetcher from "./fetcher";

const PROBITY_ADDRESS = "0x4c5859f0F772848b2D91F1D83E2Fe57935348029";

function Collateral() {
  const { library } = useWeb3React<Web3Provider>()
  const { data: vault } = useSWR([PROBITY_ADDRESS, 'getVault'], {
    fetcher: fetcher(library, ProbityABI.abi),
  })

  if (!vault) return null;
  return (
    <div className="border rounded py-1 px-2">
      <div className="row my-2">
        <div className="col-3 offset-3">
          Vault ID:
        </div>
        <div className="col-4">
          {vault[0].toString()}<br/>
        </div>
      </div>
      <div className="row my-2">
        <div className="col-3 offset-3">
          Collateral:
        </div>
        <div className="col-4">
          {utils.formatEther(vault[1])} FLR
        </div>
      </div>
    </div>
  )
}

function Vault() {
  const location = useLocation();
  const { account, active, library } = useWeb3React<Web3Provider>()
  const [collateralAmount, setCollateralAmount] = React.useState(0);
  const [collateralPrice, setCollateralPrice] = React.useState(0.00);
  const [collateralValue, setCollateralValue] = React.useState(0.00);

  // Start listening to price feed
  React.useEffect(() => {
    const runEffect = async () => {
      // TODO: Fetch live price
      setCollateralPrice(1.00);
    }
    runEffect();
  }, []);

  // Set collateral value when collateral price changes
  React.useEffect(() => {
    setCollateralValue((collateralPrice * collateralAmount));
  }, [collateralPrice, collateralAmount]);

  // Listener for VaultCreated event
  React.useEffect(() => {
    if (library) {
      const probity = new Contract(PROBITY_ADDRESS, ProbityABI.abi, library.getSigner())

      const event = probity.filters.VaultCreated(account)

      library.on(event, (from, to, amount, event) => {
        console.log('VaultCreated', { from, to, amount, event })
      })

      return () => {
        library.removeAllListeners(event)
      }
    }
  })

  /**
   * @function openVault
   */
  const openVault = async () => {
    if (library && account) {
      const probity = new Contract(PROBITY_ADDRESS, ProbityABI.abi, library.getSigner())

      try {
        const result = await probity.openVault(0, 0, { value: utils.parseEther(collateralAmount.toString()) });

        // TODO: Wait for transaction validation using event
        const data = await result.wait();
        console.log("events:", data.events);
      } catch (error) {
        console.log(error);
      }
    }
  }

  /**
   * @function depositCollateral
   */
  const depositCollateral = async () => {
    if (library && account) {
      const probity = new Contract(PROBITY_ADDRESS, ProbityABI.abi, library.getSigner())

      try {
        const result = await probity.addCollateral(0, { value: utils.parseEther(collateralAmount.toString()) });

        // TODO: Wait for transaction validation using event
        const data = await result.wait();
        console.log("events:", data.events);
      } catch (error) {
        console.log(error);
      }
    }
  }

  /**
   * @function withdrawCollateral
   */
  const withdrawCollateral = async () => {
    if (library && account) {
      const probity = new Contract(PROBITY_ADDRESS, ProbityABI.abi, library.getSigner())

      try {
        const result = await probity.withdrawCollateral(utils.parseEther(collateralAmount.toString()).toString());

        // TODO: Wait for transaction validation using event
        const data = await result.wait();
        console.log("events:", data.events);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <header className="py-5">
        <h1>Vault</h1>
        <p className="lead">The Probity vault securely stores crypto collateral.</p>
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          <strong><i className="fas fa-exclamation-circle"></i></strong> Only Spark (FLR) is currently supported.
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      </header>    
      <section className="border rounded p-5 w-50 mb-5">
        {/* Activity Navigation */}
        <div>
          <h3 className="pb-2 text-center">Collateral Management</h3>
          {active && <Collateral />}
          <hr />
          <ul className="nav nav-pills nav-fill">
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" to={"/vault/deposit"}>Deposit</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" to={"/vault/withdraw"}>Withdraw</NavLink>
            </li>
          </ul>
        </div>
        <hr />
        {/* Vault Activity */}
        <div className="container">
          <div className="row">
            <div className="col-6 offset-3">
              <div className="py-3">
                <label htmlFor="depositAmountInput" className="form-label">Amount (FLR)</label>
                <input
                  type="number"
                  min={0}
                  className="form-control"
                  id="depositAmountInput"
                  placeholder="0.000000000000000000"
                  onChange={event => setCollateralAmount(Number(event.target.value))}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6 offset-3">
              <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
                <div className="m-2"><span className="text-muted h6">FLR/USD</span><br />${collateralPrice}</div>
                <div className="m-2"><span className="text-muted h6">Value</span><br />${collateralValue.toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6 offset-3 mt-4">
              <div className="d-grid">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    if (location.pathname === "/vault/deposit")  depositCollateral()
                    if (location.pathname === "/vault/withdraw") withdrawCollateral()
                  }}
                >Confirm</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Vault;
