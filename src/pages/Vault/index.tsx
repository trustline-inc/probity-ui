import React, { useContext } from 'react';
import useSWR from 'swr';
import numbro from "numbro"
import { NavLink, useLocation } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import TreasuryABI from "@trustline-inc/probity/artifacts/contracts/probity/Treasury.sol/Treasury.json";
import { Contract, utils } from "ethers";
import fetcher from "../../fetcher";
import { AUREI, VAULT_ENGINE, INTERFACES } from '../../constants';
import { Activity as ActivityType } from "../../types";
import Activity from "../../containers/Activity";
import { TREASURY } from '../../constants';
import DepositActivity from '../Vault/DepositActivity';
import WithdrawActivity from '../Vault/WithdrawActivity';
import EventContext from "../../contexts/TransactionContext"

function Vault() {
  const location = useLocation();
  const { account, active, library } = useWeb3React<Web3Provider>()
  const [activity, setActivity] = React.useState<ActivityType|null>(null);
  const [error, setError] = React.useState<any|null>(null);
  const [amount, setAmount] = React.useState(0);
  const [maxSize, setMaxSize] = React.useState(0)
  const [loading, setLoading] = React.useState(false);
  const ctx = useContext(EventContext)

  const { mutate: mutateVaultAurBalance } = useSWR([VAULT_ENGINE, 'stablecoin', account], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })
  const { mutate: mutateAurErc20Balance } = useSWR([AUREI, 'balanceOf', account], {
    fetcher: fetcher(library, INTERFACES[AUREI].abi),
  })

  // Set activity by the path
  React.useEffect(() => {
    if (location.pathname === "/vault/deposit") setActivity(ActivityType.Deposit);
    if (location.pathname === "/vault/withdraw") setActivity(ActivityType.Withdraw);
  }, [location])

  /**
   * @function withdraw
   */
    const withdraw = async () => {
    if (library && account) {
      const treasury = new Contract(TREASURY, TreasuryABI.abi, library.getSigner())
      setLoading(true)
      try {
        const result = await treasury.withdrawStablecoin(
          utils.parseUnits(String(amount), 18)
        );
        const data = await result.wait();
        ctx.updateTransactions(data);
        mutateVaultAurBalance(undefined, true)
        mutateAurErc20Balance(undefined, true)
        setAmount(0)
      } catch (error) {
        console.log(error);
        setError(error);
      }
      setLoading(false)
    }
  }

  /**
   * @function deposit
   */
  const deposit = async () => {
    if (library && account) {
      const treasury = new Contract(TREASURY, TreasuryABI.abi, library.getSigner())
      setLoading(true)
      try {
        const result = await treasury.depositStablecoin(
          utils.parseUnits(String(amount), 18)
        );
        const data = await result.wait();
        ctx.updateTransactions(data);
        mutateVaultAurBalance(undefined, true)
        mutateAurErc20Balance(undefined, true)
        setAmount(0)
      } catch (error) {
        console.log(error);
        setError(error);
      }
      setLoading(false)
    }
  }

  const onAmountChange = (event: any) => {
    let amount
    if (!event.target.value) amount = 0
    else amount = Number(numbro.unformat(event.target.value));
    setAmount(amount);
  }

  return (
    <>
      <header>
        <h1>Vault</h1>
      </header>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <div className="col-md-12 col-lg-8 offset-lg-2">
          {/* Activity Navigation */}
          <div>
            <ul className="nav nav-pills nav-justified">
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/vault/withdraw"} onClick={() => { setActivity(ActivityType.Withdraw); }}>Withdraw</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/vault/deposit"} onClick={() => { setActivity(ActivityType.Deposit); }}>Deposit</NavLink>
              </li>
            </ul>
          </div>
          <hr />
          {/* Stablecoin Activities */}
          <Activity active={active} activity={activity} error={error}>
            <>
              {
                activity === ActivityType.Withdraw && (
                  <WithdrawActivity
                    maxSize={maxSize}
                    setMaxSize={setMaxSize}
                    amount={amount}
                    onAmountChange={onAmountChange}
                    withdraw={withdraw}
                    loading={loading}
                  />
                )
              }
              {
                activity === ActivityType.Deposit && (
                  <DepositActivity
                    maxSize={maxSize}
                    setMaxSize={setMaxSize}
                    amount={amount}
                    onAmountChange={onAmountChange}
                    deposit={deposit}
                    loading={loading}
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

export default Vault;
