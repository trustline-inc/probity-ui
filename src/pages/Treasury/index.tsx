import React, { useContext } from 'react';
import web3 from "web3";
import useSWR from 'swr';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { NavLink, useLocation } from "react-router-dom";
import TreasuryABI from "@trustline-inc/probity/artifacts/contracts/probity/Treasury.sol/Treasury.json";
import { Contract, utils } from "ethers";
import fetcher from "../../fetcher";
import Activity from "../../containers/Activity";
import InvestActivity from "./InvestActivity";
import RedemptionActivity from "./RedemptionActivity";
import WithdrawActivity from "./WithdrawActivity";
import { Activity as ActivityType } from "../../types";
import { RAD, WAD, TREASURY, VAULT_ENGINE, INTERFACES } from '../../constants';
import Info from '../../components/Info';
import EventContext from "../../contexts/TransactionContext"
import { getNativeTokenSymbol } from '../../utils';

function Treasury({ collateralPrice }: { collateralPrice: number }) {
  const location = useLocation();
  const { account, active, library, chainId } = useWeb3React<Web3Provider>()
  const [error, setError] = React.useState<any|null>(null);
  const [loading, setLoading] = React.useState(false);
  const [activity, setActivity] = React.useState<ActivityType|null>(null);
  const [equityAmount, setEquityAmount] = React.useState(0);
  const [interestAmount, setInterestAmount] = React.useState(0);
  const [underlyingAmount, setUnderlyingAmount] = React.useState(0);
  const [totalUnderlying, setTotalUnderlying] = React.useState(0);
  const [underlyingRatio, setUnderlyingRatio] = React.useState(0);
  const ctx = useContext(EventContext)
  const [interestType, setInterestType] = React.useState("PBT")

  const { data: vault } = useSWR([VAULT_ENGINE, 'vaults', utils.id(getNativeTokenSymbol(chainId!)), account], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })

  /**
   * @function onUnderlyingAmountChange
   * @param event 
   * Updates state collateral and total collateral amounts
   */
  const onUnderlyingAmountChange = (event: any) => {
    var totalAmount;
    const delta = Number(event.target.value);
    if (activity === ActivityType.Redeem) totalAmount = Number(utils.formatEther(vault.activeAssetAmount)) - Number(delta);
    else totalAmount = Number(utils.formatEther(vault.activeAssetAmount)) + Number(delta);
    setTotalUnderlying(totalAmount);
    setUnderlyingAmount(delta);
  }

  /**
   * Dynamically calculate the collateralization ratio
   */
  React.useEffect(() => {
    if (vault) {
      switch (activity) {
        case ActivityType.Supply:
          setUnderlyingRatio((totalUnderlying * collateralPrice) / (Number(utils.formatEther(vault.equity)) + Number(utils.formatEther(vault.debt)) + Number(equityAmount)));
          break;
        case ActivityType.Redeem:
          setUnderlyingRatio((totalUnderlying * collateralPrice) / (Number(utils.formatEther(vault.equity)) + Number(utils.formatEther(vault.debt)) - Number(equityAmount)));
          break;
      }
    }
  }, [totalUnderlying, collateralPrice, equityAmount, vault, activity]);

  /**
   * @function onEquityAmountChange
   * @param event 
   */
  const onEquityAmountChange = (event: any) => {
    const amount = Number(event.target.value)
    setEquityAmount(amount);
    if (equityAmount > 0) {
      setUnderlyingRatio(totalUnderlying / (Number(utils.formatEther(vault.equity)) + Number(utils.formatEther(vault.debt)) + Number(equityAmount)));
    }
  }

  const onInterestAmountChange = (event: any) => {
    const amount = Number(event.target.value)
    setInterestAmount(amount);
  }

  // Set activity by the path
  React.useEffect(() => {
    if (location.pathname === "/treasury/invest")  setActivity(ActivityType.Supply);
    if (location.pathname === "/treasury/redeem") setActivity(ActivityType.Redeem);
    if (location.pathname === "/treasury/collect-interest") setActivity(ActivityType.Interest);
  }, [location])

  /**
   * @function invest
   */
   const invest = async () => {
    if (library && account) {
      const vaultEngine = new Contract(VAULT_ENGINE, INTERFACES[VAULT_ENGINE].abi, library.getSigner())
      setLoading(true)

      try {
        const args = [
          utils.id(getNativeTokenSymbol(chainId!)),
          TREASURY,
          WAD.mul(underlyingAmount),
          RAD.mul(equityAmount),
          { gasLimit: 300000 }
        ]
        await vaultEngine.callStatic.modifyEquity(...args)
        const result = await vaultEngine.modifyEquity(...args);
        const data = await result.wait();
        ctx.updateTransactions(data);
      } catch (error) {
        console.log(error);
        setError(error);
      }
      setLoading(false)
    }
  }

  /**
   * @function redeem
   */
  const redeem = async () => {
    if (library && account) {
      const vaultEngine = new Contract(VAULT_ENGINE, INTERFACES[VAULT_ENGINE].abi, library.getSigner())
      setLoading(true)

      try {
        const args = [
          utils.id(getNativeTokenSymbol(chainId!)),
          TREASURY,
          WAD.mul(-underlyingAmount),
          RAD.mul(-equityAmount)
        ]
        await vaultEngine.callStatic.modifyEquity(...args)
        const result = await vaultEngine.connect(library.getSigner()).modifyEquity(...args);
        const data = await result.wait();
        ctx.updateTransactions(data);
      } catch (error) {
        console.log(error);
        setError(error);
      }
      setLoading(false)
    }
  }

  /**
   * @function withdraw
   */
    const withdraw = async () => {
    if (library && account) {
      const treasury = new Contract(TREASURY, TreasuryABI.abi, library.getSigner())

      try {
        const isPBT = interestType === "PBT";
        const args = [
          utils.parseUnits(interestAmount.toString(), "ether").toString(),
          isPBT,
          {
            gasLimit: web3.utils.toWei('400000', 'wei')
          }
        ]
        await treasury.callStatic.withdrawStablecoin(...args)
        const result = await treasury.withdrawStablecoin(...args);
        const data = await result.wait();
        ctx.updateTransactions(data);
      } catch (error) {
        console.log(error);
        setError(error);
      }
    }
  }

  return (
    <>
      <header className="pt-2">
        <h1>Treasury Management</h1>
        <p className="lead">Invest assets to earn yield from loans created by Probity.</p>
        {active && <Info />}
      </header>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <div className="col-md-6 offset-md-3">
          {/* Activity Navigation */}
          <div>
            <ul className="nav nav-pills nav-justified">
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/treasury/invest"} onClick={() => { setActivity(ActivityType.Supply); setUnderlyingAmount(0) }}>Invest</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/treasury/redeem"} onClick={() => { setActivity(ActivityType.Redeem); setUnderlyingAmount(0) }}>Redeem</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/treasury/collect-interest"} onClick={() => { setActivity(ActivityType.Interest); setUnderlyingAmount(0) }}>Collect</NavLink>
              </li>
            </ul>
          </div>
          <hr />
          {/* Treasury Management Activities */}
          <Activity active={active} activity={activity} error={error}>
            {
              activity === ActivityType.Supply && (
                <InvestActivity
                  underlyingAmount={underlyingAmount}
                  equityAmount={equityAmount}
                  underlyingRatio={underlyingRatio}
                  supply={invest}
                  loading={loading}
                  onUnderlyingAmountChange={onUnderlyingAmountChange}
                  onEquityAmountChange={onEquityAmountChange}
                />
              )
            }
            {
              activity === ActivityType.Redeem && (
                <RedemptionActivity
                  underlyingAmount={underlyingAmount}
                  onUnderlyingAmountChange={onUnderlyingAmountChange}
                  equityAmount={equityAmount}
                  underlyingRatio={underlyingRatio}
                  onEquityAmountChange={onEquityAmountChange}
                  redeem={redeem}
                  loading={loading}
                />
              )
            }
            {
              activity === ActivityType.Interest && (
                <WithdrawActivity
                  interestAmount={interestAmount}
                  onInterestAmountChange={onInterestAmountChange}
                  withdraw={withdraw}
                  loading={loading}
                  setInterestType={setInterestType}
                  interestType={interestType}
                />
              )
            }
          </Activity>
        </div>
      </section>
    </>
  );
}

export default Treasury;
