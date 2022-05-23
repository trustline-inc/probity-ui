import React, { useContext } from 'react';
import useSWR from 'swr';
import numbro from "numbro"
import { NavLink, useLocation } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import TreasuryABI from "@trustline-inc/probity/artifacts/contracts/probity/Treasury.sol/Treasury.json";
import { Contract, utils } from "ethers";
import fetcher from "../../fetcher";
import { Activity as ActivityType } from "../../types";
import Activity from "../../containers/Activity";
import RedemptionActivity from './RedemptionActivity';
import IssuanceActivity from './IssuanceActivity';
import EventContext from "../../contexts/TransactionContext"
import { CONTRACTS } from "../../constants"

function Stablecoins() {
  const location = useLocation();
  const { account, active, library, chainId } = useWeb3React<Web3Provider>()
  const [activity, setActivity] = React.useState<ActivityType|null>(null);
  const [error, setError] = React.useState<any|null>(null);
  const [amount, setAmount] = React.useState(0);
  const [maxSize, setMaxSize] = React.useState(0)
  const [loading, setLoading] = React.useState(false);
  const ctx = useContext(EventContext)

  const { mutate: mutateVaultAurBalance } = useSWR([CONTRACTS[chainId!].VAULT_ENGINE.address, 'stablecoin', account], {
    fetcher: fetcher(library, CONTRACTS[chainId!].VAULT_ENGINE.abi),
  })
  const { mutate: mutateAurErc20Balance } = useSWR([CONTRACTS[chainId!].USD.address, 'balanceOf', account], {
    fetcher: fetcher(library, CONTRACTS[chainId!].USD.abi),
  })

  // Set activity by the path
  React.useEffect(() => {
    if (location.pathname === "/stablecoins/redeem") setActivity(ActivityType.RedeemCurrency);
    if (location.pathname === "/stablecoins/issue") setActivity(ActivityType.IssueCurrency);
  }, [location])

  /**
   * @function issue
   */
    const issue = async () => {
    if (library && account) {
      const treasury = new Contract(CONTRACTS[chainId!].TREASURY.address, TreasuryABI.abi, library.getSigner())
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
   * @function redeem
   */
  const redeem = async () => {
    if (library && account) {
      const treasury = new Contract(CONTRACTS[chainId!].TREASURY.address, TreasuryABI.abi, library.getSigner())
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
        <h1>Stablecoins</h1>
      </header>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <div className="col-md-12 col-lg-8 offset-lg-2">
          {/* Activity Navigation */}
          <div>
            <ul className="nav nav-pills nav-justified">
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/stablecoins/issue"} onClick={() => { setActivity(ActivityType.IssueCurrency); }}>Issue</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/stablecoins/redeem"} onClick={() => { setActivity(ActivityType.RedeemCurrency); }}>Redeem</NavLink>
              </li>
            </ul>
          </div>
          <hr />
          {/* Stablecoin Activities */}
          <Activity active={active} activity={activity} error={error}>
            <>
              {
                activity === ActivityType.IssueCurrency && (
                  <IssuanceActivity
                    maxSize={maxSize}
                    setMaxSize={setMaxSize}
                    amount={amount}
                    onAmountChange={onAmountChange}
                    issue={issue}
                    loading={loading}
                  />
                )
              }
              {
                activity === ActivityType.RedeemCurrency && (
                  <RedemptionActivity
                    maxSize={maxSize}
                    setMaxSize={setMaxSize}
                    amount={amount}
                    onAmountChange={onAmountChange}
                    redeem={redeem}
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

export default Stablecoins;
