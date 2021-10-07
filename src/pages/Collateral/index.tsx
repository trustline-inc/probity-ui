import React, { useContext } from 'react';
import useSWR from 'swr';
import { NavLink, useLocation } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
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
  VAULT_ENGINE_ADDRESS
} from '../../constants';
import Info from '../../components/Info';
import EventContext from "../../contexts/TransactionContext"
import DepositActivity from './DepositActivity';
import WithdrawActivity from './WithdrawActivity';

function Collateral({ collateralPrice }: { collateralPrice: number }) {
  const location = useLocation();
  const { account, active, library } = useWeb3React<Web3Provider>()
  const [activity, setActivity] = React.useState<ActivityType|null>(null);
  const [error, setError] = React.useState<any|null>(null);
  const [collateralAmount, setCollateralAmount] = React.useState(0);
  const [totalCollateral, setTotalCollateral] = React.useState(0);
  const [collateralRatio, setCollateralRatio] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const ctx = useContext(EventContext)

  const { data: vault } = useSWR([VAULT_ENGINE_ADDRESS, 'vaults', web3.utils.keccak256("FLR"), account], {
    fetcher: fetcher(library, VaultEngineABI.abi),
  })

  // Set activity by the path
  React.useEffect(() => {
    if (location.pathname === "/collateral/deposit") setActivity(ActivityType.Deposit);
    if (location.pathname === "/collateral/withdraw") setActivity(ActivityType.Withdraw);
  }, [location])

  const deposit = async () => {
    if (library && account) {
      const nativeCollateral = new Contract(NATIVE_COLLATERAL_ADDRESS, NativeCollateralABI.abi, library.getSigner())
      setLoading(true)

      try {
        // Deposit collateral
        const result = await nativeCollateral.deposit(
          {
            gasLimit: web3.utils.toWei('400000', 'wei'),
            value: WAD.mul(collateralAmount)
          }
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

  const withdraw = async () => {
    if (library && account) {
      const nativeCollateral = new Contract(NATIVE_COLLATERAL_ADDRESS, NativeCollateralABI.abi, library.getSigner())
      setLoading(true)

      try {
        // Withdraw collateral
        const result = await nativeCollateral.withdraw(WAD.mul(collateralAmount));
        const data = await result.wait();
        ctx.updateTransactions(data);
      } catch (error) {
        console.log(error);
        setError(error);
      }

      setLoading(false)
    }
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
      const newRatio = (totalCollateral * collateralPrice) / (Number(utils.formatEther(vault.debt).toString()) + Number(utils.formatEther(vault.capital).toString()))
      setCollateralRatio(isFinite(newRatio) ? newRatio : 0);
    }
  }, [totalCollateral, collateralPrice, vault, activity]);

  return (
    <>
      <header className="pt-2">
        <h1>Collateral Management</h1>
        <p className="lead">Deposit or withdraw assets from your vault to be used as loan collateral/capital.</p>
        {active && <Info />}
      </header>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <div className="col-md-6 offset-md-3">
          {/* Activity Navigation */}
          <div>
            <ul className="nav nav-pills nav-justified">
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/collateral/deposit"} onClick={() => { setActivity(ActivityType.Borrow); setCollateralAmount(0) }}>Deposit</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/collateral/withdraw"} onClick={() => { setActivity(ActivityType.Repay); setCollateralAmount(0) }}>Withdraw</NavLink>
              </li>
            </ul>
          </div>
          <hr />
          {/* Collateral Activities */}
          <Activity active={active} activity={activity} error={error}>
            <>
            {
              activity === ActivityType.Deposit && (
                <DepositActivity
                  collateralAmount={collateralAmount}
                  collateralRatio={collateralRatio}
                  loading={loading}
                  onCollateralAmountChange={onCollateralAmountChange}
                  deposit={deposit}
                />
              )
            }
            {
              activity === ActivityType.Withdraw && (
                <WithdrawActivity
                  collateralAmount={collateralAmount}
                  onCollateralAmountChange={onCollateralAmountChange}
                  collateralRatio={collateralRatio}
                  loading={loading}
                  withdraw={withdraw}
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

export default Collateral;
