import React, { useContext } from 'react';
import useSWR from 'swr';
import { NavLink, useLocation } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import TellerABI from "@trustline-inc/probity/artifacts/contracts/probity/Teller.sol/Teller.json";
import VaultEngineABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngine.sol/VaultEngine.json";
import { Contract, utils } from "ethers";
import { Activity as ActivityType } from "../../types";
import Activity from "../../containers/Activity";
import fetcher from "../../fetcher";
import {
  RAD,
  WAD,
  TELLER,
  TREASURY,
  VAULT_ENGINE,
} from '../../constants';
import BorrowActivity from './BorrowActivity';
import RepayActivity from './RepayActivity';
import Info from '../../components/Info';
import EventContext from "../../contexts/TransactionContext"
import { getNativeTokenSymbol } from '../../utils';

function Loans({ collateralPrice }: { collateralPrice: number }) {
  const location = useLocation();
  const { account, active, library, chainId } = useWeb3React<Web3Provider>()
  const [activity, setActivity] = React.useState<ActivityType|null>(null);
  const [error, setError] = React.useState<any|null>(null);
  const [collateralAmount, setCollateralAmount] = React.useState(0);
  const [totalCollateral, setTotalCollateral] = React.useState(0);
  const [amount, setBorrowAmount] = React.useState(0);
  const [collateralRatio, setCollateralRatio] = React.useState(0);
  const [maxSize, setMaxSize] = React.useState(0)
  const [loading, setLoading] = React.useState(false);
  const ctx = useContext(EventContext)

  const { data: vault } = useSWR([VAULT_ENGINE, 'vaults', utils.id(getNativeTokenSymbol(chainId!)), account], {
    fetcher: fetcher(library, VaultEngineABI.abi),
  })
  const { data: rate } = useSWR([TELLER, 'apr'], {
    fetcher: fetcher(library, TellerABI.abi),
  })

  // Set activity by the path
  React.useEffect(() => {
    if (location.pathname === "/loans/borrow") setActivity(ActivityType.Borrow);
    if (location.pathname === "/loans/repay") setActivity(ActivityType.Repay);
  }, [location])

  const borrow = async () => {
    if (library && account) {
      const vaultEngine = new Contract(VAULT_ENGINE, VaultEngineABI.abi, library.getSigner())
      setLoading(true)

      try {
        // Modify debt
        const result = await vaultEngine.modifyDebt(
          utils.id(getNativeTokenSymbol(chainId!)),
          TREASURY,
          WAD.mul(collateralAmount),
          RAD.mul(amount)
        );
        const data = await result.wait();
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
      const vault = new Contract(VAULT_ENGINE, VaultEngineABI.abi, library.getSigner())
      setLoading(true)

      try {
        // Modify debt
        const result = await vault.modifyDebt(
          utils.id(getNativeTokenSymbol(chainId!)),
          TREASURY,
          WAD.mul(-collateralAmount),
          RAD.mul(-amount)
        );
        const data = await result.wait();
        ctx.updateTransactions(data);
      } catch (error) {
        console.log(error);
        setError(error);
      }

      setLoading(false)
    }
  }

  const onAmountChange = (event: any) => {
    const amount = Number(event.target.value);
    setBorrowAmount(amount);
  }

  const onCollateralAmountChange = (event: any) => {
    var totalAmount;
    const delta = Number(event.target.value);
    if (activity === ActivityType.Repay) totalAmount = Number(utils.formatEther(vault.activeAssetAmount)) - Number(delta);
    else totalAmount = Number(utils.formatEther(vault.activeAssetAmount)) + Number(delta);
    setTotalCollateral(totalAmount);
    setCollateralAmount(delta);
  }

  // Dynamically calculate the collateralization ratio
  React.useEffect(() => {
    if (vault) {
      switch (activity) {
        case ActivityType.Borrow:
          setCollateralRatio((totalCollateral * collateralPrice) / (Number(utils.formatEther(vault.debt)) + Number(utils.formatEther(vault.equity)) + Number(amount)));
          break;
        case ActivityType.Repay:
          setCollateralRatio((totalCollateral * collateralPrice) / (Number(utils.formatEther(vault.debt)) + Number(utils.formatEther(vault.equity)) - Number(amount)));
          break;
      }
    }
  }, [totalCollateral, collateralPrice, amount, vault, activity]);

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
                    maxSize={maxSize}
                    amount={amount}
                    setMaxSize={setMaxSize}
                    collateralRatio={collateralRatio}
                    collateralAmount={collateralAmount}
                    onAmountChange={onAmountChange}
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
                    amount={amount}
                    collateralRatio={collateralRatio}
                    collateralAmount={collateralAmount}
                    onAmountChange={onAmountChange}
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
