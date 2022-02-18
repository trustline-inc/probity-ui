import React, { useContext } from 'react';
import numbro from "numbro"
import useSWR from 'swr';
import { NavLink, useLocation } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { Contract, utils } from "ethers";
import web3 from "web3";
import fetcher from "../../fetcher";
import { Activity as ActivityType } from "../../types";
import Activity from "../../containers/Activity";
import {
  WAD,
  NATIVE_TOKEN,
  VAULT_ENGINE,
  INTERFACES
} from '../../constants';
import Info from '../../components/Info';
import EventContext from "../../contexts/TransactionContext"
import DepositActivity from './DepositActivity';
import WithdrawActivity from './WithdrawActivity';
import { getNativeTokenSymbol } from '../../utils';

function Assets() {
  const location = useLocation();
  const { account, active, library, chainId } = useWeb3React<Web3Provider>()
  const [activity, setActivity] = React.useState<ActivityType|null>(null);
  const [error, setError] = React.useState<any|null>(null);
  const [amount, setAmount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const ctx = useContext(EventContext)

  const { mutate: mutateVault } = useSWR([VAULT_ENGINE, 'vaults', utils.id(getNativeTokenSymbol(chainId!)), account], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })

  // Set activity by the path
  React.useEffect(() => {
    if (location.pathname === "/assets/deposit") setActivity(ActivityType.Deposit);
    if (location.pathname === "/assets/withdraw") setActivity(ActivityType.Withdraw);
  }, [location])

  const deposit = async () => {
    if (library && account) {
      const nativeToken = new Contract(NATIVE_TOKEN, INTERFACES[NATIVE_TOKEN].abi, library.getSigner())
      setLoading(true)

      try {
        // Deposit collateral
        const args = [{
          gasLimit: web3.utils.toWei('400000', 'wei'),
          value: WAD.mul(amount)
        }]
        await nativeToken.callStatic.deposit(...args)
        const result = await nativeToken.deposit(...args);
        const data = await result.wait();
        ctx.updateTransactions(data);
        mutateVault(undefined, true)
        setAmount(0)
      } catch (error) {
        console.log(error);
        setError(error);
      }
    }

    setLoading(false)
  }

  const withdraw = async () => {
    if (library && account) {
      const nativeToken = new Contract(NATIVE_TOKEN, INTERFACES[NATIVE_TOKEN].abi, library.getSigner())
      setLoading(true)

      try {
        // Withdraw asset
        const args = [WAD.mul(amount)]
        await nativeToken.callStatic.withdraw(...args)
        const result = await nativeToken.withdraw(...args);
        const data = await result.wait();
        ctx.updateTransactions(data);
        mutateVault(undefined, true)
        setAmount(0)
      } catch (error) {
        console.log(error);
        setError(error);
      }

      setLoading(false)
    }
  }

  const onAmountChange = (event: any) => {
    let delta
    if (!event.target.value) delta = 0
    else delta = Number(numbro.unformat(event.target.value));
    setAmount(delta);
  }

  return (
    <>
      <header>
        <h1>Asset Management</h1>
        {active && <Info />}
      </header>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <div className="col-md-12 col-lg-8 offset-lg-2">
          {/* Activity Navigation */}
          <div>
            <ul className="nav nav-pills nav-justified">
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/assets/deposit"} onClick={() => { setActivity(ActivityType.Borrow); setAmount(0) }}>Deposit</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/assets/withdraw"} onClick={() => { setActivity(ActivityType.Repay); setAmount(0) }}>Withdraw</NavLink>
              </li>
            </ul>
          </div>
          <hr />
          {/* Activities */}
          <Activity active={active} activity={activity} error={error}>
            <>
            {
              activity === ActivityType.Deposit && (
                <DepositActivity
                  amount={amount}
                  loading={loading}
                  onAmountChange={onAmountChange}
                  deposit={deposit}
                />
              )
            }
            {
              activity === ActivityType.Withdraw && (
                <WithdrawActivity
                  amount={amount}
                  onAmountChange={onAmountChange}
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

export default Assets;
