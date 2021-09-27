import React, { useContext } from 'react';
import useSWR from 'swr';
import { NavLink, useLocation } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import TellerABI from "@trustline-inc/probity/artifacts/contracts/probity/Teller.sol/Teller.json";
import NativeCollateralABI from "@trustline-inc/probity/artifacts/contracts/probity/collateral/NativeCollateral.sol/NativeCollateral.json";
import VaultEngineABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngine.sol/VaultEngine.json";
import { Contract, utils } from "ethers";
import web3 from "web3";
import { Activity as ActivityType } from "../../types";
import Activity from "../../containers/Activity";
import fetcher from "../../fetcher";
import {
  WAD,
  NATIVE_COLLATERAL_ADDRESS,
  TELLER_ADDRESS,
  TREASURY_ADDRESS,
  VAULT_ENGINE_ADDRESS
} from '../../constants';
import BorrowActivity from './BorrowActivity';
import RepayActivity from './RepayActivity';
import Info from '../../components/Info';
import EventContext from "../../contexts/TransactionContext"

function Loans({ collateralPrice }: { collateralPrice: number }) {
  const location = useLocation();
  const { account, active, library } = useWeb3React<Web3Provider>()
  const [activity, setActivity] = React.useState<ActivityType|null>(null);
  const [error, setError] = React.useState<any|null>(null);
  const [collateralAmount, setCollateralAmount] = React.useState(0);
  const [totalCollateral, setTotalCollateral] = React.useState(0);
  const [aureiAmount, setAureiAmount] = React.useState(0);
  const [collateralRatio, setCollateralRatio] = React.useState(0);
  const [maxBorrow, setMaxBorrow] = React.useState(0)
  const [loading, setLoading] = React.useState(false);
  const ctx = useContext(EventContext)

  const { data: vault } = useSWR([VAULT_ENGINE_ADDRESS, 'vaults', web3.utils.keccak256("FLR"), account], {
    fetcher: fetcher(library, VaultEngineABI.abi),
  })
  const { data: rate } = useSWR([TELLER_ADDRESS, 'APR'], {
    fetcher: fetcher(library, TellerABI.abi),
  })

  // Set activity by the path
  React.useEffect(() => {
    if (location.pathname === "/loans/borrow") setActivity(ActivityType.Borrow);
    if (location.pathname === "/loans/repay") setActivity(ActivityType.Repay);
  }, [location])

  const borrow = async () => {
    if (library && account) {
      const nativeCollateral = new Contract(NATIVE_COLLATERAL_ADDRESS, NativeCollateralABI.abi, library.getSigner())
      const vault = new Contract(VAULT_ENGINE_ADDRESS, VaultEngineABI.abi, library.getSigner())
      setLoading(true)

      try {
        // Deposit collateral
        var result = await nativeCollateral.deposit(
          {
            gasLimit: web3.utils.toWei('400000', 'wei'),
            value: WAD.mul(collateralAmount)
          }
        );
        var data = await result.wait();
        ctx.updateTransactions(data);

        // Modify debt
        result = await vault.modifyDebt(
          web3.utils.keccak256("FLR"),
          TREASURY_ADDRESS,
          WAD.mul(collateralAmount),
          WAD.mul(aureiAmount)
        );
        data = await result.wait();
        ctx.updateTransactions(data);
      } catch (error) {
        console.log(error);
        setError(error);
      }
    }

    setLoading(false)
  }

  const repay = async () => {
    if (library && account) {
      const nativeCollateral = new Contract(NATIVE_COLLATERAL_ADDRESS, NativeCollateralABI.abi, library.getSigner())
      const vault = new Contract(VAULT_ENGINE_ADDRESS, VaultEngineABI.abi, library.getSigner())
      setLoading(true)
      console.log(WAD.mul(collateralAmount).mul(-1).toString(), WAD.mul(aureiAmount).mul(-1).toString())
      try {
        // Modify debt
        var result = await vault.modifyDebt(
          web3.utils.keccak256("FLR"),
          TREASURY_ADDRESS,
          WAD.mul(collateralAmount).mul(-1),
          WAD.mul(aureiAmount).mul(-1)
        );
        var data = await result.wait();
        ctx.updateTransactions(data);

        // Withdraw collateral
        result = await nativeCollateral.withdraw(WAD.mul(collateralAmount));
        data = await result.wait();
        ctx.updateTransactions(data);
      } catch (error) {
        console.log(error);
        setError(error);
      }

      setLoading(false)
    }
  }

  const onAureiAmountChange = (event: any) => {
    const amount = Number(event.target.value);
    setAureiAmount(amount);
  }

  const onCollateralAmountChange = (event: any) => {
    var totalAmount;
    const delta = Number(event.target.value);
    if (activity === ActivityType.Repay) totalAmount = Number(utils.formatEther(vault.usedCollateral).toString()) - Number(delta);
    else totalAmount = Number(utils.formatEther(vault.freeCollateral.add(vault.usedCollateral)).toString()) + Number(delta);
    setTotalCollateral(totalAmount);
    setCollateralAmount(delta);
  }

  // Dynamically calculate the collateralization ratio
  React.useEffect(() => {
    if (vault) {
      switch (activity) {
        case ActivityType.Borrow:
          setCollateralRatio((totalCollateral * collateralPrice) / (Number(utils.formatEther(vault.debt).toString()) + Number(utils.formatEther(vault.capital).toString()) + Number(aureiAmount)));
          break;
        case ActivityType.Repay:
          setCollateralRatio((totalCollateral * collateralPrice) / (Number(utils.formatEther(vault.debt).toString()) + Number(utils.formatEther(vault.capital).toString()) - Number(aureiAmount)));
          break;
      }
    }
  }, [totalCollateral, collateralPrice, aureiAmount, vault, activity]);

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
                    borrow={borrow}
                    loading={loading}
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
                    rate={rate}
                    repay={repay}
                    loading={loading}
                    aureiAmount={aureiAmount}
                    collateralRatio={collateralRatio}
                    collateralAmount={collateralAmount}
                    onAureiAmountChange={onAureiAmountChange}
                    onCollateralAmountChange={onCollateralAmountChange}
                  />
                )
              }
            </>
          </Activity>
        </div>
      </section>
    </>
  );
}

export default Loans;
