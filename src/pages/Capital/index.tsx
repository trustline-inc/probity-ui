import React from 'react';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { NavLink, useLocation } from "react-router-dom";
import TreasuryABI from "@trustline/aurei/artifacts/contracts/Treasury.sol/Treasury.json";
import { Contract, utils } from "ethers";
import Activity from "../../containers/Activity";
import IssuanceActivity from "./IssuanceActivity";
import RedemptionActivity from "./RedemptionActivity";
import { Activity as ActivityType } from "../../types";
import { TREASURY_ADDRESS } from "../../constants";
import Info from '../../components/Info';

function Capital() {
  const location = useLocation();
  const { account, active, library } = useWeb3React<Web3Provider>()
  const [error, setError] = React.useState<any|null>(null);
  const [activity, setActivity] = React.useState<ActivityType|null>(null);
  const [equityAmount, setEquityAmount] = React.useState(0);
  const [collateralAmount, setCollateralAmount] = React.useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [collateralPrice, setCollateralPrice] = React.useState(0.00);
  const [collateralRatio, setCollateralRatio] = React.useState(0);

  const onCollateralAmountChange = (event: any) => {
    const amount = Number(event.target.value)
    setCollateralAmount(amount);
    if (equityAmount > 0)
      setCollateralRatio(amount / equityAmount);
  }

  const onEquityAmountChange = (event: any) => {
    const amount = Number(event.target.value)
    setEquityAmount(amount);
    if (equityAmount > 0)
      setCollateralRatio(collateralAmount / amount);
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
    if (location.pathname === "/capital/issue")  setActivity(ActivityType.Issue);
    if (location.pathname === "/capital/redeem") setActivity(ActivityType.Redeem);
  }, [location])

  /**
   * @function issueEquity
   */
   const issueEquity = async () => {
    if (library && account) {
      const treasury = new Contract(TREASURY_ADDRESS, TreasuryABI.abi, library.getSigner())

      try {
        const result = await treasury.issue(
          utils.parseUnits(collateralAmount.toString(), "ether").toString(),
          utils.parseUnits(equityAmount.toString(), "ether").toString()
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

  /**
   * @function redeemEquity
   */
  const redeemEquity = async () => {
    if (library && account) {
      const treasury = new Contract(TREASURY_ADDRESS, TreasuryABI.abi, library.getSigner())

      try {
        const result = await treasury.redeem(
          utils.parseUnits(collateralAmount.toString(), "ether").toString(),
          utils.parseUnits(equityAmount.toString(), "ether").toString()
        );
        console.log("result:", result)
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
        <h1><i className="fas fa-coins"  style={{fontSize:'1.8rem'}} /> Capital Management</h1>
        <p className="lead">Converting collateral to capital allows you to earn interest.</p>
        {active && <Info />}

      </header>
      <section className="border rounded p-5 mb-5">
        {/* Activity Navigation */}
        <div>
          <ul className="nav nav-pills nav-fill">
            <li className="nav-item">
              <NavLink className="nav-link border" activeClassName="active" to={"/capital/issue"} onClick={() => { setActivity(ActivityType.Issue) }}>Issue</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link border" activeClassName="active" to={"/capital/redeem"} onClick={() => { setActivity(ActivityType.Redeem) }}>Redeem</NavLink>
            </li>
          </ul>
        </div>
        <hr />
        {/* Capital Management Activities */}
        <Activity active={active} activity={activity} error={error}>
          {
            activity === ActivityType.Issue && (
              <IssuanceActivity
                collateralAmount={collateralAmount}
                equityAmount={equityAmount}
                collateralRatio={collateralRatio}
                issueEquity={issueEquity}
                onCollateralAmountChange={onCollateralAmountChange}
                onEquityAmountChange={onEquityAmountChange}
              />
            )
          }
          {
            activity === ActivityType.Redeem && (
              <RedemptionActivity
                collateralAmount={collateralAmount}
                onCollateralAmountChange={onCollateralAmountChange}
                equityAmount={equityAmount}
                onEquityAmountChange={onEquityAmountChange}
                redeemEquity={redeemEquity}
              />
            )
          }
        </Activity>
      </section>
    </>
  );
}

export default Capital;
