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
import SupplyActivity from "./SupplyActivity";
import RedemptionActivity from "./RedemptionActivity";
import WithdrawActivity from "./WithdrawActivity";
import { Activity as ActivityType } from "../../types";
import { ETHER, NATIVE_COLLATERAL_ADDRESS, TREASURY_ADDRESS, VAULT_ENGINE_ADDRESS } from '../../constants';
import NativeCollateralABI from "@trustline-inc/probity/artifacts/contracts/probity/collateral/NativeCollateral.sol/NativeCollateral.json";
import VaultEngineABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngine.sol/VaultEngine.json";
import Info from '../../components/Info';
import EventContext from "../../contexts/TransactionContext"

function Capital({ collateralPrice }: { collateralPrice: number }) {
  const location = useLocation();
  const { account, active, library } = useWeb3React<Web3Provider>()
  const [error, setError] = React.useState<any|null>(null);
  const [loading, setLoading] = React.useState(false);
  const [activity, setActivity] = React.useState<ActivityType|null>(null);
  const [supplyAmount, setSupplyAmount] = React.useState(0);
  const [interestAmount, setInterestAmount] = React.useState(0);
  const [collateralAmount, setCollateralAmount] = React.useState(0);
  const [totalCollateral, setTotalCollateral] = React.useState(0);
  const [collateralRatio, setCollateralRatio] = React.useState(0);
  const ctx = useContext(EventContext)
  const [interestType, setInterestType] = React.useState("TCN")

  const { data: vault } = useSWR([VAULT_ENGINE_ADDRESS, 'vaults', utils.formatBytes32String("FLR"), account], {
    fetcher: fetcher(library, VaultEngineABI.abi),
  })

  /**
   * @function onCollateralAmountChange
   * @param event 
   * Updates state collateral and total collateral amounts
   */
  const onCollateralAmountChange = (event: any) => {
    var totalAmount;
    const delta = Number(event.target.value);
    if (activity === ActivityType.Redeem) totalAmount = Number(utils.formatEther(vault.capital).toString()) - Number(delta);
    else totalAmount = Number(utils.formatEther(vault.freeCollateral + vault.usedCollateral).toString()) + Number(delta);
    setTotalCollateral(totalAmount);
    setCollateralAmount(delta);
  }

  /**
   * Dynamically calculate the collateralization ratio
   */
  React.useEffect(() => {
    if (vault) {
      switch (activity) {
        case ActivityType.Supply:
          setCollateralRatio((totalCollateral * collateralPrice) / (Number(utils.formatEther(vault.capital).toString()) + Number(supplyAmount)));
          break;
        case ActivityType.Redeem:
          setCollateralRatio((totalCollateral * collateralPrice) / (Number(utils.formatEther(vault.capital).toString()) - Number(supplyAmount)));
          break;
      }
    }
  }, [totalCollateral, collateralPrice, supplyAmount, vault, activity]);

  /**
   * @function onSupplyAmountChange
   * @param event 
   */
  const onSupplyAmountChange = (event: any) => {
    const amount = Number(event.target.value)
    setSupplyAmount(amount);
    if (supplyAmount > 0)
      setCollateralRatio(totalCollateral / amount);
  }

  const onInterestAmountChange = (event: any) => {
    const amount = Number(event.target.value)
    setInterestAmount(amount);
  }

  // Set activity by the path
  React.useEffect(() => {
    if (location.pathname === "/capital/supply")  setActivity(ActivityType.Supply);
    if (location.pathname === "/capital/redeem") setActivity(ActivityType.Redeem);
    if (location.pathname === "/capital/withdraw") setActivity(ActivityType.Interest);
  }, [location])

  // Listener for Treasury events
  React.useEffect(() => {
    if (library) {
      const treasury = new Contract(TREASURY_ADDRESS, TreasuryABI.abi, library.getSigner())
      const deposit = treasury.filters.Deposit(null, null)
      // const redemption = treasury.filters.Redemption(null, null, null, account)
      const withdrawal = treasury.filters.Withdrawal(null, null)

      library.on(deposit, (event) => {
        console.log('Deposit Event:', event);
      })

      // library.on(redemption, (event) => {
      //   console.log('Redemption Event:', event);
      // })

      library.on(withdrawal, (event) => {
        console.log('Withdrawal Event:', event);
      })

      return () => {
        library.removeAllListeners(deposit)
        // library.removeAllListeners(redemption)
        library.removeAllListeners(withdrawal)
      }
    }
  })

  /**
   * @function supply
   */
   const supply = async () => {
    if (library && account) {
      const nativeCollateral = new Contract(NATIVE_COLLATERAL_ADDRESS, NativeCollateralABI.abi, library.getSigner())
      const vaultEngine = new Contract(VAULT_ENGINE_ADDRESS, VaultEngineABI.abi, library.getSigner())
      setLoading(true)

      try {
        // Deposit collateral
        var result = await nativeCollateral.deposit(
          {
            gasLimit: web3.utils.toWei('400000', 'wei'),
            value: ETHER.mul(collateralAmount)
          }
        );
        var data = await result.wait();
        ctx.updateTransactions(data);

        // Modify supply
        result = await vaultEngine.modifySupply(
          web3.utils.keccak256("FLR"),
          TREASURY_ADDRESS,
          ETHER.mul(collateralAmount),
          ETHER.mul(supplyAmount)
        );
        data = await result.wait();
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
      const treasury = new Contract(TREASURY_ADDRESS, TreasuryABI.abi, library.getSigner())

      try {
        const result = await treasury.redeem(
          utils.parseUnits(collateralAmount.toString(), "ether").toString(),
          utils.parseUnits(supplyAmount.toString(), "ether").toString(),
          {
            gasLimit: web3.utils.toWei('400000', 'wei')
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
            gasLimit: web3.utils.toWei('400000', 'wei')
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
                <NavLink className="nav-link" activeClassName="active" to={"/capital/supply"} onClick={() => { setActivity(ActivityType.Supply); setCollateralAmount(0) }}>Supply</NavLink>
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
              activity === ActivityType.Supply && (
                <SupplyActivity
                  collateralAmount={collateralAmount}
                  supplyAmount={supplyAmount}
                  collateralRatio={collateralRatio}
                  supply={supply}
                  loading={loading}
                  onCollateralAmountChange={onCollateralAmountChange}
                  onSupplyAmountChange={onSupplyAmountChange}
                />
              )
            }
            {
              activity === ActivityType.Redeem && (
                <RedemptionActivity
                  collateralAmount={collateralAmount}
                  onCollateralAmountChange={onCollateralAmountChange}
                  supplyAmount={supplyAmount}
                  collateralRatio={collateralRatio}
                  onSupplyAmountChange={onSupplyAmountChange}
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
