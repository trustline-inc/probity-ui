import React from 'react';
import useLocalStorageState from "use-local-storage-state";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { NavLink, useLocation } from "react-router-dom";
import ProbityABI from "@trustline/probity/artifacts/contracts/Probity.sol/Probity.json";
import { Contract, utils } from "ethers";
import { PROBITY_ADDRESS } from "./constants";

enum Activity {
  Issue,
  Redeem
}

function Equity() {
  const location = useLocation();
  const { account, active, library } = useWeb3React<Web3Provider>()
  const [activity, setActivity] = React.useState<Activity|null>(null);
  const [displayInfoAlert, setDisplayInfoAlert] = useLocalStorageState("displayInfoAlert", true);
  const [equityAmount, setEquityAmount] = React.useState(0);
  const [collateralAmount, setCollateralAmount] = React.useState(200);
  const [collateralPrice, setCollateralPrice] = React.useState(0.00);
  const [collateralRatio, setCollateralRatio] = React.useState(150);
  const collateralAmountInput = React.useRef<HTMLInputElement>(null);
  const equityAmountInput = React.useRef<HTMLInputElement>(null);

  const onCollateralAmountChange = (event: any) => {
    const _collateralAmount = Number(event.target.value)
    setCollateralAmount(_collateralAmount);
    setEquityAmount(_collateralAmount / (collateralRatio * 0.01));
  }

  const onCollRatioChange = (event: any) => {
    const _collateralRatio = event.target.value;
    setCollateralRatio(_collateralRatio);
    setEquityAmount(collateralAmount * (_collateralRatio * 0.01));
  }

  const onEquityAmountChange = (event: any) => {
    const _equityAmount = Number(event.target.value)
    setEquityAmount(_equityAmount);
    setCollateralAmount(_equityAmount / (collateralRatio * 0.01));
  }

  // Start listening to price feed
  React.useEffect(() => {
    const runEffect = async () => {
      // TODO: Fetch live price
      setCollateralPrice(1.00);
    }
    runEffect();
  }, []);

  // Set activity by the path
  React.useEffect(() => {
    if (location.pathname === "/equity/issue")  setActivity(Activity.Issue);
    if (location.pathname === "/equity/redeem") setActivity(Activity.Redeem);
  }, [location])

  /**
   * @function issueEquity
   */
   const issueEquity = async () => {
    if (library && account) {
      const probity = new Contract(PROBITY_ADDRESS, ProbityABI.abi, library.getSigner())

      try {
        const result = await probity.issueEquity(0, { value: utils.parseEther(collateralAmount.toString()) });

        // TODO: Wait for transaction validation using event
        const data = await result.wait();
        console.log("events:", data.events);
      } catch (error) {
        console.log(error);
      }
    }
  }

  /**
   * @function redeemEquity
   */
  const redeemEquity = async () => {
    if (library && account) {
      const probity = new Contract(PROBITY_ADDRESS, ProbityABI.abi, library.getSigner())

      try {
        const result = await probity.redeemEquity(utils.parseEther(collateralAmount.toString()).toString());

        // TODO: Wait for transaction validation using event
        const data = await result.wait();
        console.log("events:", data.events);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      <header className="pt-5">
        <h1>Equity Management</h1>
        <p className="lead">Converting collateral to equity allows you to earn interest.</p>
        {
          displayInfoAlert ? (
            <div className="alert alert-info alert-dismissible fade show" role="alert">
              <strong><i className="fas fa-exclamation-circle"></i></strong> Only Spark (FLR) is currently supported as collateral.
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => {
                setDisplayInfoAlert(false);
              }}></button>
            </div>
          ) : (null)
        }
      </header>
      <section className="border rounded p-5 mb-5">
        {/* Activity Navigation */}
        <div>
          <ul className="nav nav-pills nav-fill">
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" to={"/equity/issue"} onClick={() => { setActivity(Activity.Issue) }}>Issue</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" to={"/equity/redeem"} onClick={() => { setActivity(Activity.Redeem) }}>Redeem</NavLink>
            </li>
          </ul>
        </div>
        <hr />
        {/* Equity Activity */}
        {
          active && activity !== null && (
            <>
              <div className="row">
                <div className="col-6 offset-3">
                  <div className="py-3">
                    <label htmlFor="collateralConversionInput" className="form-label">Amount (FLR)</label>
                    <input
                      type="number"
                      min={0}
                      className="form-control"
                      id="collateralConversionInput"
                      placeholder="0.000000000000000000"
                      value={collateralAmount}
                      onChange={onCollateralAmountChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6 offset-3">
                  <label htmlFor="collateralRatio" className="form-label">Collateral Ratio</label>
                  <input type="range" min="150" max="300" className="form-range" step="1" defaultValue={collateralRatio} id="collateralRatio" onChange={onCollRatioChange} />
                </div>
              </div>
              <div className="row">
                <div className="col-6 offset-3">
                  <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
                    <div className="m-2"><span className="text-muted h6">Coll. Ratio</span><br />{Number(collateralRatio).toFixed(0)}%</div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6 offset-3">
                  <div className="py-3">
                    <label htmlFor="equityIssuanceInput" className="form-label">Amount (AUR)</label>
                    <input
                      type="number"
                      min={0}
                      className="form-control"
                      id="equityIssuanceInput"
                      placeholder="0.000000000000000000"
                      value={equityAmount}
                      onChange={onEquityAmountChange}
                    />
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
                        if (activity === (Activity.Issue as Activity))  issueEquity()
                        if (activity === (Activity.Redeem as Activity)) redeemEquity()
                      }}
                    >Confirm</button>
                  </div>
                </div>
              </div>
            </>
          )
        }
        {
          !active && activity !== null && (
            <div className="py-5 text-center">Please connect your wallet to manage equity operations.</div>
          )
        }
        {
          active && activity === null && (
            <div className="py-5 text-center">Please select an activity.</div>
          )
        }
      </section>
    </>
  );
}

export default Equity;
