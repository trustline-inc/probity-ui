import React, { useContext } from 'react';
import web3 from "web3";
import useSWR from 'swr';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { NavLink, useLocation } from "react-router-dom";
import TreasuryABI from "@trustline-inc/aurei/artifacts/contracts/Treasury.sol/Treasury.json";
import { Contract, utils } from "ethers";
import fetcher from "../../fetcher";
import Activity from "../../containers/Activity";
import StakingActivity from "./StakingActivity";
import RedemptionActivity from "./RedemptionActivity";
import WithdrawActivity from "./WithdrawActivity";
import { Activity as ActivityType } from "../../types";
import { TREASURY_ADDRESS, VAULT_ADDRESS } from '../../constants';
import VaultABI from "@trustline-inc/aurei/artifacts/contracts/Vault.sol/Vault.json";
import Info from '../../components/Info';
import EventContext from "../../contexts/TransactionContext"

function Capital() {
  const location = useLocation();
  const { account, active, library } = useWeb3React<Web3Provider>()
  const [error, setError] = React.useState<any|null>(null);
  const [activity, setActivity] = React.useState<ActivityType|null>(null);
  const [equityAmount, setEquityAmount] = React.useState(0);
  const [interestAmount, setInterestAmount] = React.useState(0);
  const [collateralAmount, setCollateralAmount] = React.useState(0);
  const [totalCollateral, setTotalCollateral] = React.useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [collateralPrice, setCollateralPrice] = React.useState(0.00);
  const [collateralRatio, setCollateralRatio] = React.useState(0);
  const ctx = useContext(EventContext)
  const [interestType, setInterestType] = React.useState("TCN")

  const { data: vault } = useSWR([VAULT_ADDRESS, 'get', account], {
    fetcher: fetcher(library, VaultABI.abi),
  })
  const { data: equityBalance } = useSWR([TREASURY_ADDRESS, 'capitalOf', account], {
    fetcher: fetcher(library, TreasuryABI.abi),
  })

  const onCollateralAmountChange = (event: any) => {
    var totalAmount;
    const delta = Number(event.target.value);
    if (activity === ActivityType.Redeem) totalAmount = Number(utils.formatEther(vault[1]).toString()) - Number(delta);
    else totalAmount = Number(utils.formatEther(vault[1]).toString()) + Number(delta);
    setTotalCollateral(totalAmount);
    setCollateralAmount(delta);
  }

  // Dynamically calculate the collateralization ratio
  React.useEffect(() => {
    if (equityBalance) {
      switch (activity) {
        case ActivityType.Stake:
          setCollateralRatio((totalCollateral * collateralPrice) / (Number(utils.formatEther(equityBalance).toString()) + Number(equityAmount)));
          break;
        case ActivityType.Redeem:
          setCollateralRatio((totalCollateral * collateralPrice) / (Number(utils.formatEther(equityBalance).toString()) - Number(equityAmount)));
          break;
      }
    }
  }, [totalCollateral, collateralPrice, equityAmount, equityBalance, activity]);

  const onEquityAmountChange = (event: any) => {
    const amount = Number(event.target.value)
    setEquityAmount(amount);
    if (equityAmount > 0)
      setCollateralRatio(totalCollateral / amount);
  }

  const onInterestAmountChange = (event: any) => {
    const amount = Number(event.target.value)
    setInterestAmount(amount);
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
    if (location.pathname === "/capital/stake")  setActivity(ActivityType.Stake);
    if (location.pathname === "/capital/redeem") setActivity(ActivityType.Redeem);
    if (location.pathname === "/capital/withdraw") setActivity(ActivityType.Interest);
  }, [location])

  // Listener for Treasury events
  React.useEffect(() => {
    if (library) {
      const treasury = new Contract(TREASURY_ADDRESS, TreasuryABI.abi, library.getSigner())
      const stake = treasury.filters.Stake(null, null, null, account)
      const redemption = treasury.filters.Redemption(null, null, null, account)
      const withdrawal = treasury.filters.Withdrawal(null, null, null, account)

      library.on(stake, (event) => {
        console.log('Stake Event:', event);
      })

      library.on(redemption, (event) => {
        console.log('Redemption Event:', event);
      })

      library.on(withdrawal, (event) => {
        console.log('Withdrawal Event:', event);
      })

      return () => {
        library.removeAllListeners(stake)
        library.removeAllListeners(redemption)
        library.removeAllListeners(withdrawal)
      }
    }
  })

  /**
   * @function stake
   */
   const stake = async () => {
    if (library && account) {
      const treasury = new Contract(TREASURY_ADDRESS, TreasuryABI.abi, library.getSigner())

      try {
        const result = await treasury.stake(
          utils.parseUnits(equityAmount.toString(), "ether").toString(),
          { 
            gasPrice: web3.utils.toWei('225', 'Gwei'),
            gasLimit: 300000,
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

  /**
   * @function redeem
   */
  const redeem = async () => {
    if (library && account) {
      const treasury = new Contract(TREASURY_ADDRESS, TreasuryABI.abi, library.getSigner())

      try {
        const result = await treasury.redeem(
          utils.parseUnits(collateralAmount.toString(), "ether").toString(),
          utils.parseUnits(equityAmount.toString(), "ether").toString(),
          {
            gasPrice: web3.utils.toWei('225', 'Gwei'),
            gasLimit: 300000
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

  /**
   * @function withdraw
   */
    const withdraw = async () => {
    if (library && account) {
      const treasury = new Contract(TREASURY_ADDRESS, TreasuryABI.abi, library.getSigner())

      try {
        const isTCN = interestType === "TCN";
        const result = await treasury.withdraw(
          utils.parseUnits(interestAmount.toString(), "ether").toString(),
          isTCN,
          {
            gasPrice: web3.utils.toWei('225', 'Gwei'),
            gasLimit: 300000
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

  return (
    <>
      <header className="pt-2">
        <h1>Capital Management</h1>
        <p className="lead">Staking assets to create Aurei capital allows you to earn interest.</p>
        {active && <Info />}
      </header>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <div className="col-md-6 offset-md-3">
          {/* Activity Navigation */}
          <div>
            <ul className="nav nav-pills nav-justified">
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/capital/stake"} onClick={() => { setActivity(ActivityType.Stake); setCollateralAmount(0) }}>Stake</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/capital/redeem"} onClick={() => { setActivity(ActivityType.Redeem); setCollateralAmount(0) }}>Redeem</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/capital/withdraw"} onClick={() => { setActivity(ActivityType.Interest); setCollateralAmount(0) }}>Withdraw</NavLink>
              </li>
            </ul>
          </div>
          <hr />
          {/* Capital Management Activities */}
          <Activity active={active} activity={activity} error={error}>
            {
              activity === ActivityType.Stake && (
                <StakingActivity
                  collateralAmount={collateralAmount}
                  equityAmount={equityAmount}
                  collateralRatio={collateralRatio}
                  stake={stake}
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
                  collateralRatio={collateralRatio}
                  onEquityAmountChange={onEquityAmountChange}
                  redeem={redeem}
                />
              )
            }
            {
              activity === ActivityType.Interest && (
                <WithdrawActivity
                  interestAmount={interestAmount}
                  onInterestAmountChange={onInterestAmountChange}
                  withdraw={withdraw}
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

export default Capital;
