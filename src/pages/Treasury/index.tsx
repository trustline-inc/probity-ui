import React, { useContext } from 'react';
import web3 from "web3";
import useSWR from 'swr';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { NavLink, useLocation } from "react-router-dom";
import TreasuryABI from "@trustline/probity/artifacts/contracts/probity/Treasury.sol/Treasury.json";
import { Contract, utils } from "ethers";
import fetcher from "../../fetcher";
import Activity from "../../containers/Activity";
import StakeActivity from "./StakeActivity";
import RedemptionActivity from "./RedemptionActivity";
import WithdrawActivity from "./WithdrawActivity";
import { Activity as ActivityType } from "../../types";
import { WAD, TREASURY, VAULT_ENGINE, INTERFACES } from '../../constants';
import Info from '../../components/Info';
import EventContext from "../../contexts/TransactionContext"
import { getNativeTokenSymbol } from '../../utils';

function Treasury({ collateralPrice }: { collateralPrice: number }) {
  const location = useLocation();
  const { account, active, library, chainId } = useWeb3React<Web3Provider>()
  const [error, setError] = React.useState<any|null>(null);
  const [loading, setLoading] = React.useState(false);
  const [activity, setActivity] = React.useState<ActivityType|null>(null);
  const [supplyAmount, setSupplyAmount] = React.useState(0);
  const [interestAmount, setInterestAmount] = React.useState(0);
  const [collateralAmount, setCollateralAmount] = React.useState(0);
  const [totalCollateral, setTotalCollateral] = React.useState(0);
  const [collateralRatio, setCollateralRatio] = React.useState(0);
  const ctx = useContext(EventContext)
  const [interestType, setInterestType] = React.useState("PBT")

  const { data: vault } = useSWR([VAULT_ENGINE, 'vaults', web3.utils.keccak256(getNativeTokenSymbol(chainId!)), account], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })

  /**
   * @function onCollateralAmountChange
   * @param event 
   * Updates state collateral and total collateral amounts
   */
  const onCollateralAmountChange = (event: any) => {
    var totalAmount;
    const delta = Number(event.target.value);
    if (activity === ActivityType.Redeem) totalAmount = Number(utils.formatEther(vault.usedCollateral)) - Number(delta);
    else totalAmount = Number(utils.formatEther(vault.usedCollateral)) + Number(delta);
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
          setCollateralRatio((totalCollateral * collateralPrice) / (Number(utils.formatEther(vault.capital)) + Number(utils.formatEther(vault.debt)) + Number(supplyAmount)));
          break;
        case ActivityType.Redeem:
          setCollateralRatio((totalCollateral * collateralPrice) / (Number(utils.formatEther(vault.capital)) + Number(utils.formatEther(vault.debt)) - Number(supplyAmount)));
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
    if (supplyAmount > 0) {
      setCollateralRatio(totalCollateral / (Number(utils.formatEther(vault.capital)) + Number(utils.formatEther(vault.debt)) + Number(supplyAmount)));
    }
  }

  const onInterestAmountChange = (event: any) => {
    const amount = Number(event.target.value)
    setInterestAmount(amount);
  }

  // Set activity by the path
  React.useEffect(() => {
    if (location.pathname === "/treasury/stake")  setActivity(ActivityType.Supply);
    if (location.pathname === "/treasury/redeem") setActivity(ActivityType.Redeem);
    if (location.pathname === "/treasury/withdraw") setActivity(ActivityType.Interest);
  }, [location])

  /**
   * @function mint
   */
   const mint = async () => {
    if (library && account) {
      const vaultEngine = new Contract(VAULT_ENGINE, INTERFACES[VAULT_ENGINE].abi, library.getSigner())
      setLoading(true)

      try {
        // Modify supply
        const result = await vaultEngine.modifySupply(
          web3.utils.keccak256(getNativeTokenSymbol(chainId!)),
          TREASURY,
          WAD.mul(collateralAmount),
          WAD.mul(supplyAmount),
          { gasLimit: 300000 }
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

  /**
   * @function burn
   */
  const burn = async () => {
    if (library && account) {
      const vaultEngine = new Contract(VAULT_ENGINE, INTERFACES[VAULT_ENGINE].abi, library.getSigner())
      setLoading(true)

      try {
        const result = await vaultEngine.connect(library.getSigner()).modifySupply(
          web3.utils.keccak256(getNativeTokenSymbol(chainId!)),
          TREASURY,
          WAD.mul(-collateralAmount),
          WAD.mul(-supplyAmount)
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

  /**
   * @function withdraw
   */
    const withdraw = async () => {
    if (library && account) {
      const treasury = new Contract(TREASURY, TreasuryABI.abi, library.getSigner())

      try {
        const isPBT = interestType === "PBT";
        const result = await treasury.withdraw(
          utils.parseUnits(interestAmount.toString(), "ether").toString(),
          isPBT,
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
        <h1>Treasury Management</h1>
        <p className="lead">Stake assets to earn yield from loans created by Probity.</p>
        {active && <Info />}
      </header>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <div className="col-md-6 offset-md-3">
          {/* Activity Navigation */}
          <div>
            <ul className="nav nav-pills nav-justified">
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/treasury/stake"} onClick={() => { setActivity(ActivityType.Supply); setCollateralAmount(0) }}>Stake</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/treasury/redeem"} onClick={() => { setActivity(ActivityType.Redeem); setCollateralAmount(0) }}>Redeem</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/treasury/withdraw"} onClick={() => { setActivity(ActivityType.Interest); setCollateralAmount(0) }}>Withdraw</NavLink>
              </li>
            </ul>
          </div>
          <hr />
          {/* Treasury Management Activities */}
          <Activity active={active} activity={activity} error={error}>
            {
              activity === ActivityType.Supply && (
                <StakeActivity
                  collateralAmount={collateralAmount}
                  supplyAmount={supplyAmount}
                  collateralRatio={collateralRatio}
                  supply={mint}
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
                  redeem={burn}
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
