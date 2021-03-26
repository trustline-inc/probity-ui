import React from 'react';
import useSWR from 'swr';
import { NavLink, useLocation } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import TellerABI from "@trustline/probity/artifacts/contracts/Teller.sol/Teller.json";
import TreasuryABI from "@trustline/probity/artifacts/contracts/Treasury.sol/Treasury.json";
import { Contract, utils } from "ethers";
import { Activity as ActivityType } from "../../types";
import Activity from "../../containers/Activity";
import fetcher from "../../fetcher";
import { TELLER_ADDRESS, TREASURY_ADDRESS } from '../../constants';
import BorrowActivity from './BorrowActivity';

function Loans() {
  const location = useLocation();
  const { account, active, library } = useWeb3React<Web3Provider>()
  const [activity, setActivity] = React.useState<ActivityType|null>(null);
  const [error, setError] = React.useState<any|null>(null);
  const [collateralAmount, setCollateralAmount] = React.useState(0);
  const [aureiAmount, setAureiAmount] = React.useState(0);
  const [collateralPrice, setCollateralPrice] = React.useState(0.00);
  const [collateralRatio, setCollateralRatio] = React.useState(0);

  const { data: debtBalance } = useSWR([TELLER_ADDRESS, 'balanceOf', account], {
    fetcher: fetcher(library, TellerABI.abi),
  })
  const { data: equityBalance } = useSWR([TREASURY_ADDRESS, 'balanceOf', account], {
    fetcher: fetcher(library, TreasuryABI.abi),
  })

  // Set activity by the path
  React.useEffect(() => {
    if (location.pathname === "/loans/borrow") setActivity(ActivityType.Borrow);
    if (location.pathname === "/loans/repay") setActivity(ActivityType.Repay);
  }, [location])

  const borrow = async () => {
    if (library && account) {
      const teller = new Contract(TELLER_ADDRESS, TellerABI.abi, library.getSigner())

      try {
        const result = await teller.createLoan(
          utils.parseUnits(collateralAmount.toString(), "ether").toString(),
          utils.parseUnits(aureiAmount.toString(), "ether").toString()
        );
        console.log("result:", result)
        // TODO: Wait for transaction validation using event
        const data = await result.wait();
        console.log("events:", data);
      } catch (error) {
        console.log(error);
        setError(error);
      }
    }
  }

  const repay = async () => {

  }

  const onAureiAmountChange = (event: any) => {
    const amount = event.target.value;
    setAureiAmount(amount);
  }

  const onCollateralAmountChange = (event: any) => {
    const amount = event.target.value;
    setCollateralAmount(amount);
  }

  // Start listening to price feed
  React.useEffect(() => {
    const runEffect = async () => {
      // TODO: Fetch live price
      setCollateralPrice(1.00);
    }
    runEffect();
  }, []);

  // Dynamically calculate the collateralization ratio
  React.useEffect(() => {
    setCollateralRatio((collateralAmount * collateralPrice) / aureiAmount);
  }, [collateralAmount, collateralPrice, aureiAmount]);

  return (
    <>
      <header className="pt-2">
        <h1>Stablecoin Loans</h1>
        <p className="lead">Borrow Aurei and repay debt with Spark (FLR).</p>
      </header>
      <section className="border rounded p-5 mb-5">
        {/* Activity Navigation */}
        <div>
          <ul className="nav nav-pills nav-fill">
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" to={"/loans/borrow"} onClick={() => { setActivity(ActivityType.Borrow) }}>Borrow</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" to={"/loans/repay"} onClick={() => { setActivity(ActivityType.Repay) }}>Repay</NavLink>
            </li>
          </ul>
        </div>
        <hr />
        {/* Loan Activities */}
        <Activity active={active} activity={activity} error={error}>
          <>
            <div className="p-5 border rounded">
            <label className="form-label">Amount</label>
              <div className="input-group input-group-lg">
                <input type="number" min="0.000000000000000000" placeholder="0.000000000000000000" className="form-control" onChange={onAureiAmountChange} />
                <span className="input-group-text font-monospace">{"AUR"}</span>
              </div>
              <br/>
              <label className="form-label">Collateral</label>
              <div className="input-group input-group-lg mb-3">
                <input type="number" min="0.000000000000000000" placeholder="0.000000000000000000" className="form-control" onChange={onCollateralAmountChange} />
                <span className="input-group-text font-monospace">{"FLR"}</span>
              </div>
            </div>

            {
              activity === ActivityType.Borrow && (
                <BorrowActivity
                  debtBalance={debtBalance}
                  equityBalance={equityBalance}
                  aureiAmount={aureiAmount}
                  collateralRatio={collateralRatio}
                />
              )
            }

            <div className="row">
              <div className="col-6 offset-3 d-grid">
                <button
                  className="btn btn-primary btn-lg mt-4"
                  onClick={() => {
                    if (activity === (ActivityType.Borrow as ActivityType)) borrow()
                    if (activity === (ActivityType.Repay as ActivityType)) repay()
                  }}
                  disabled={aureiAmount === 0 || collateralAmount === 0}
                >Comfirm</button>
              </div>
            </div>
          </>
        </Activity>
      </section>
    </>
  );
}

export default Loans;
