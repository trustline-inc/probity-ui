import React from 'react';
import { Contract, utils } from "ethers";
import { NavLink, useLocation } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import VaultABI from "@trustline/aurei/artifacts/contracts/Vault.sol/Vault.json";
import Activity from "../../containers/Activity";
import { Activity as ActivityType } from "../../types";
import { VAULT_ADDRESS } from "../../constants";
import Info from '../../components/Info';

function Vault() {
  const location = useLocation();
  const [error, setError] = React.useState<any|null>(null);
  const [activity, setActivity] = React.useState<ActivityType|null>(null);
  const { account, active, library } = useWeb3React<Web3Provider>()
  const [collateralAmount, setCollateralAmount] = React.useState(0);
  const [collateralPrice, setCollateralPrice] = React.useState(0.00);
  const [collateralValue, setCollateralValue] = React.useState(0.00);

  // Set activity by the path
  React.useEffect(() => {
    if (location.pathname === "/vault/deposit")  setActivity(ActivityType.Deposit);
    if (location.pathname === "/vault/withdraw") setActivity(ActivityType.Withdraw);
  }, [location])

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

  // Listener for VaultUpdated event
  React.useEffect(() => {
    if (library) {
      const vault = new Contract(VAULT_ADDRESS, VaultABI.abi, library.getSigner())

      const event = vault.filters.VaultUpdated(account)

      library.on(event, (from, to, amount, event) => {
        console.log('VaultUpdated', { from, to, amount, event })
      })

      return () => {
        library.removeAllListeners(event)
      }
    }
  })

  /**
   * @function depositCollateral
   */
  const depositCollateral = async () => {
    if (library && account) {
      const vault = new Contract(VAULT_ADDRESS, VaultABI.abi, library.getSigner())

      try {
        const result = await vault.deposit({ value: utils.parseEther(collateralAmount.toString()) });

        // TODO: Wait for transaction validation using event
        const data = await result.wait();
        console.log("events:", data.events);
      } catch (error) {
        console.log(error);
        setError(error);
      }
    }
  }

  /**
   * @function withdrawCollateral
   */
  const withdrawCollateral = async () => {
    if (library && account) {
      const vault = new Contract(VAULT_ADDRESS, VaultABI.abi, library.getSigner())

      try {
        const result = await vault.withdraw(utils.parseEther(collateralAmount.toString()).toString());

        // TODO: Wait for transaction validation using event
        const data = await result.wait();
        console.log("events:", data.events);
      } catch (error) {
        console.log(error);
        setError(error);
      }
    }
  }

  return (
    <>
      <header className="pt-2">
        <h1><i className="fas fa-lock" style={{fontSize:'1.8rem'}} /> Vault Management</h1>
        <p className="lead">The Probity vault securely stores crypto collateral.</p>
        {active && <Info />}

      </header>    
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <div className="col-md-6 offset-md-3">
          {/* Activity Navigation */}
          <div>
            <ul className="nav nav-pills nav-justified">
              <li className="nav-item ">
                <NavLink className="nav-link" activeClassName="active" to={"/vault/deposit"} onClick={() => { setActivity(ActivityType.Deposit) }}>Deposit</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/vault/withdraw"} onClick={() => { setActivity(ActivityType.Withdraw) }}>Withdraw</NavLink>
              </li>
            </ul>
          </div>
          <hr />
          {/* Vault Activity */}
          <Activity active={active} activity={activity} error={error}>
          {
            active && activity !== null && (
              <>
                <div className="row">
                  <div className="col-12">
                    <div className="py-3">
                      <label htmlFor="depositAmountInput" className="form-label">Amount (CFLR)</label>
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
                  <div className="col-12">
                    <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
                      <div className="m-2"><span className="text-muted h6">CFLR/USD</span><br />${collateralPrice}</div>
                      <div className="m-2"><span className="text-muted h6">Value</span><br />${collateralValue.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 mt-4 d-grid">
                    <button
                      type="button"
                      className="btn btn-primary btn-lg"
                      disabled={collateralAmount === 0}
                      onClick={() => {
                        if (activity === (ActivityType.Deposit as ActivityType))  depositCollateral()
                        if (activity === (ActivityType.Withdraw as ActivityType)) withdrawCollateral()
                      }}
                    >Confirm</button>
                  </div>
                </div>
              </>
            )
          }
          </Activity>
        </div>
      </section>
    </>
  );
}

export default Vault;
