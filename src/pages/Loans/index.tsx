import React, { useContext } from 'react';
import useSWR from 'swr';
import { NavLink, useLocation } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import AureiABI from "@trustline-inc/aurei/artifacts/contracts/Aurei.sol/Aurei.json";
import TellerABI from "@trustline-inc/aurei/artifacts/contracts/Teller.sol/Teller.json";
import { Contract, utils } from "ethers";
import web3 from "web3";
import { Activity as ActivityType } from "../../types";
import Activity from "../../containers/Activity";
import fetcher from "../../fetcher";
import { AUREI_ADDRESS, TELLER_ADDRESS, VAULT_ADDRESS } from '../../constants';
import VaultABI from "@trustline-inc/aurei/artifacts/contracts/Vault.sol/Vault.json";
import BorrowActivity from './BorrowActivity';
import RepayActivity from './RepayActivity';
import Info from '../../components/Info';
import EventContext from "../../contexts/TransactionContext"

function Loans() {
  const location = useLocation();
  const { account, active, library } = useWeb3React<Web3Provider>()
  const [activity, setActivity] = React.useState<ActivityType|null>(null);
  const [error, setError] = React.useState<any|null>(null);
  const [collateralAmount, setCollateralAmount] = React.useState(0);
  const [aureiAmount, setAureiAmount] = React.useState(0);
  const [collateralPrice, setCollateralPrice] = React.useState(0.00);
  const [collateralRatio, setCollateralRatio] = React.useState(0);
  const [maxBorrow, setMaxBorrow] = React.useState(0)
  const ctx = useContext(EventContext)

  const { data: vault } = useSWR([VAULT_ADDRESS, 'get', account], {
    fetcher: fetcher(library, VaultABI.abi),
  })
  const { data: debtBalance } = useSWR([TELLER_ADDRESS, 'balanceOf', account], {
    fetcher: fetcher(library, TellerABI.abi),
  })
  const { data: rate } = useSWR([TELLER_ADDRESS, 'getAPR'], {
    fetcher: fetcher(library, TellerABI.abi),
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
          utils.parseUnits(aureiAmount.toString(), "ether").toString(),
          { 
            gasPrice: web3.utils.toWei('100', 'Gwei'),
            value: utils.parseUnits(collateralAmount.toString(), "ether").toString()
          }
        );
        const data = await result.wait();
        ctx.updateTransactions(data);
      } catch (error) {
        console.log(error);
        setError(error);
      }
    }
  }

  const repay = async () => {
    if (library && account) {
      const aurei = new Contract(AUREI_ADDRESS, AureiABI.abi, library.getSigner())
      const teller = new Contract(TELLER_ADDRESS, TellerABI.abi, library.getSigner())

      try {
        var result, data;
        result = await aurei.approve(
          TELLER_ADDRESS,
          utils.parseUnits(aureiAmount.toString(), "ether").toString()
        );
        data = await result.wait();
        ctx.updateTransactions(data);
        result = await teller.repay(
          utils.parseUnits(aureiAmount.toString(), "ether").toString(),
          utils.parseUnits(collateralAmount.toString(), "ether").toString(),
          { gasPrice: web3.utils.toWei('15', 'Gwei') }
        );
        data = await result.wait();
        ctx.updateTransactions(data);
      } catch (error) {
        console.log(error);
        setError(error);
      }
    }
  }

  const onAureiAmountChange = (event: any) => {
    const amount = event.target.value;
    setAureiAmount(amount);
  }

  const onCollateralAmountChange = (event: any) => {
    var amount;
    const delta = Number(event.target.value);
    if (activity === ActivityType.Repay) amount = Number(utils.formatEther(vault[0]).toString()) - Number(delta);
    else amount = Number(utils.formatEther(vault[0]).toString()) + Number(delta);
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
    if (debtBalance) {
      switch (activity) {
        case ActivityType.Borrow:
          setCollateralRatio((collateralAmount * collateralPrice) / (Number(utils.formatEther(debtBalance).toString()) + Number(aureiAmount)));
          break;
        case ActivityType.Repay:
          setCollateralRatio((collateralAmount * collateralPrice) / (Number(utils.formatEther(debtBalance).toString()) - Number(aureiAmount)));
          break;
      }
    }
  }, [collateralAmount, collateralPrice, aureiAmount, debtBalance, activity]);

  // Ensure loan size input does not exceed maximum
  React.useEffect(() => {
    if (Number(aureiAmount) > maxBorrow) setAureiAmount(maxBorrow)
  }, [aureiAmount, maxBorrow]);

  return (
    <>
      <header className="pt-2">
        <h1>Loan Management</h1>
        <p className="lead">Take out a secured stablecoin loan.</p>
        {active && <Info />}
      </header>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <div className="col-md-6 offset-md-3">
          {/* Activity Navigation */}
          <div>
            <ul className="nav nav-pills nav-justified">
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/loans/borrow"} onClick={() => { setActivity(ActivityType.Borrow); setCollateralAmount(0) }}>Borrow</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/loans/repay"} onClick={() => { setActivity(ActivityType.Repay); setCollateralAmount(0) }}>Repay</NavLink>
              </li>
            </ul>
          </div>
          <hr />
          {/* Loan Activities */}
          <Activity active={active} activity={activity} error={error}>
            <>
              {
                activity === ActivityType.Borrow && (
                  <BorrowActivity
                    rate={rate}
                    maxBorrow={maxBorrow}
                    aureiAmount={aureiAmount}
                    setMaxBorrow={setMaxBorrow}
                    collateralRatio={collateralRatio}
                    collateralAmount={collateralAmount}
                    onAureiAmountChange={onAureiAmountChange}
                    onCollateralAmountChange={onCollateralAmountChange}
                  />
                )
              }

              {
                activity === ActivityType.Repay && (
                  <RepayActivity
                    aureiAmount={aureiAmount}
                    collateralRatio={collateralRatio}
                    collateralAmount={collateralAmount}
                    onAureiAmountChange={onAureiAmountChange}
                    onCollateralAmountChange={onCollateralAmountChange}
                  />
                )
              }

              <div className="row">
                <div className="col-12 mt-4 d-grid">
                  <button
                    className="btn btn-primary btn-lg mt-4"
                    onClick={() => {
                      if (activity === (ActivityType.Borrow as ActivityType)) borrow()
                      if (activity === (ActivityType.Repay as ActivityType)) repay()
                    }}
                    disabled={aureiAmount === 0 || collateralAmount === 0}
                  >Confirm</button>
                </div>
              </div>
            </>
          </Activity>
        </div>
      </section>
    </>
  );
}

export default Loans;
