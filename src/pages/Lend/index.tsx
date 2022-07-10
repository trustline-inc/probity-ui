import React from 'react';
import web3 from "web3";
import useSWR from 'swr';
import numbro from "numbro"
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { NavLink, useLocation } from "react-router-dom";
import TreasuryABI from "@trustline-inc/probity/artifacts/contracts/probity/Treasury.sol/Treasury.json";
import VaultEngineABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngine.sol/VaultEngine.json";
import { Contract, utils } from "ethers";
import fetcher from "../../fetcher";
import Activity from "../../containers/Activity";
import InvestActivity from "./InvestActivity";
import RedemptionActivity from "./RedemptionActivity";
import CollectActivity from "./CollectActivity";
import { Activity as ActivityType } from "../../types";
import { CONTRACTS, RAY } from '../../constants';
import Info from '../../components/Info';
import AssetContext from "../../contexts/AssetContext"
import EventContext from "../../contexts/TransactionContext"
import { getNativeTokenSymbol } from '../../utils';

function Lend({ assetPrice }: { assetPrice: number }) {
  const location = useLocation();
  const assetContext = React.useContext(AssetContext)
  const { account, active, library, chainId } = useWeb3React<Web3Provider>()
  const [error, setError] = React.useState<any|null>(null);
  const [loading, setLoading] = React.useState(false);
  const [activity, setActivity] = React.useState<ActivityType|null>(null);
  const [equityAmount, setEquityAmount] = React.useState(0);
  const [interestAmount, setInterestAmount] = React.useState(0);
  const [underlyingAmount, setUnderlyingAmount] = React.useState(0);
  const [totalUnderlying, setTotalUnderlying] = React.useState(0);
  const [underlyingRatio, setUnderlyingRatio] = React.useState(0);
  const eventContext = React.useContext(EventContext)
  const nativeTokenSymbol = getNativeTokenSymbol(chainId!)
  const currentAsset = assetContext.asset || nativeTokenSymbol
  const [interestType, setInterestType] = React.useState("PBT")

  const { data: vault, mutate: mutateVault } = useSWR([CONTRACTS[chainId!].VAULT_ENGINE.address, 'vaults', utils.id(getNativeTokenSymbol(chainId!)), account], {
    fetcher: fetcher(library, CONTRACTS[chainId!].VAULT_ENGINE.abi),
  })

  const { data: price } = useSWR([CONTRACTS[chainId!].PRICE_FEED.address, 'getPrice', utils.id(currentAsset)], {
    fetcher: fetcher(library, CONTRACTS[chainId!].PRICE_FEED.abi),
  })

  const { data: asset, mutate: mutateAsset } = useSWR([CONTRACTS[chainId!].VAULT_ENGINE.address, 'assets', utils.id(currentAsset)], {
    fetcher: fetcher(library, CONTRACTS[chainId!].VAULT_ENGINE.abi),
  })

  let liquidationRatio = "";
  if (price && asset?.adjustedPrice) {
    // Get the liquidation ratio
    const denominator = Number(String(utils.formatUnits(asset.adjustedPrice.mul(RAY).div(price), 27)))
    liquidationRatio = String(1 / denominator)
  } else {
    liquidationRatio = `<Loading...>`
  }

  /**
   * @function onUnderlyingAmountChange
   * @param event 
   * Updates state collateral and total collateral amounts
   */
  const onUnderlyingAmountChange = (event: any) => {
    let totalAmount, delta;
    if (!event.target.value) delta = 0
    else delta = Number(numbro.unformat(event.target.value));
    if (activity === ActivityType.RedeemEquity) totalAmount = Number(utils.formatEther(vault.underlying)) - Number(delta);
    else totalAmount = Number(utils.formatEther(vault.underlying)) + Number(delta);
    setTotalUnderlying(totalAmount);
    setUnderlyingAmount(delta);
  }

  /**
   * Dynamically calculate the collateralization ratio
   */
  React.useEffect(() => {
    if (vault) {
      switch (activity) {
        case ActivityType.IssueEquity:
          setUnderlyingRatio((totalUnderlying * assetPrice) / (Number(utils.formatUnits(vault.initialEquity, 45)) + Number(equityAmount)));
          break;
        case ActivityType.RedeemEquity:
          setUnderlyingRatio((totalUnderlying * assetPrice) / (Number(utils.formatUnits(vault.initialEquity, 45)) - Number(equityAmount)));
          break;
      }
    }
  }, [totalUnderlying, assetPrice, equityAmount, vault, activity]);

  /**
   * @function onEquityAmountChange
   * @param event 
   */
  const onEquityAmountChange = (event: any) => {
    let amount
    if (!event.target.value) amount = 0
    else amount = Number(numbro.unformat(event.target.value))
    setEquityAmount(amount);
    if (equityAmount > 0) {
      setUnderlyingRatio(
        totalUnderlying / (Number(utils.formatEther(vault.initialEquity)) + Number(utils.formatEther(vault.debt)) + Number(equityAmount))
      );
    }
  }

  /**
   * @function onInterestAmountChange
   * @param event 
   */
  const onInterestAmountChange = (event: any) => {
    let amount
    if (!event.target.value) amount = 0
    else amount = Number(numbro.unformat(event.target.value))
    setInterestAmount(amount);
  }

  // Set activity by the path
  React.useEffect(() => {
    if (location.pathname === "/lend/invest")  setActivity(ActivityType.IssueEquity);
    if (location.pathname === "/lend/redeem") setActivity(ActivityType.RedeemEquity);
    if (location.pathname === "/lend/collect-interest") setActivity(ActivityType.Collect);
  }, [location])

  /**
   * @function invest
   */
   const invest = async () => {
    if (library && account) {
      const vaultEngine = new Contract(CONTRACTS[chainId!].VAULT_ENGINE.address, CONTRACTS[chainId!].VAULT_ENGINE.abi, library.getSigner())
      setLoading(true)
      try {
        const args = [
          utils.id(getNativeTokenSymbol(chainId!)),
          CONTRACTS[chainId!].TREASURY.address,
          utils.parseUnits(String(underlyingAmount), 18),
          utils.parseUnits(String(equityAmount), 45).div(asset.equityAccumulator),
          { gasLimit: 300000 }
        ]
        await vaultEngine.callStatic.modifyEquity(...args)
        const result = await vaultEngine.modifyEquity(...args);
        const data = await result.wait();
        eventContext.updateTransactions(data);
        mutateVault(undefined, true);
        setEquityAmount(0)
        setUnderlyingAmount(0)
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
      const vaultEngine = new Contract(CONTRACTS[chainId!].VAULT_ENGINE.address, CONTRACTS[chainId!].VAULT_ENGINE.abi, library.getSigner())
      setLoading(true)

      try {
        const args = [
          utils.id(getNativeTokenSymbol(chainId!)),
          CONTRACTS[chainId!].TREASURY.address,
          utils.parseUnits(String(-underlyingAmount), 18),
          utils.parseUnits(String(-equityAmount), 45).div(asset.equityAccumulator),
        ]
        await vaultEngine.callStatic.modifyEquity(...args)
        const result = await vaultEngine.connect(library.getSigner()).modifyEquity(...args);
        const data = await result.wait();
        eventContext.updateTransactions(data);
        mutateVault(undefined, true);
        setEquityAmount(0)
        setUnderlyingAmount(0)
      } catch (error) {
        console.log(error);
        setError(error);
      }
      setLoading(false)
    }
  }

  /**
   * @function collect
   */
    const collect = async () => {
    if (library && account) {
      const treasury = new Contract(CONTRACTS[chainId!].TREASURY.address, TreasuryABI.abi, library.getSigner())
      const vaultEngine = new Contract(CONTRACTS[chainId!].VAULT_ENGINE.address, VaultEngineABI.abi, library.getSigner())
      setLoading(true)

      try {
        let args: any = [utils.id(getNativeTokenSymbol(chainId!))]
        await vaultEngine.callStatic.collectInterest(...args)
        let result = await vaultEngine.collectInterest(...args);
        let data = await result.wait();
        eventContext.updateTransactions(data);

        const isPBT = interestType === "PBT";
        args = [
          utils.parseUnits(String(interestAmount), 18),
          {
            gasLimit: web3.utils.toWei('400000', 'wei')
          }
        ]

        if (isPBT) {
          await treasury.callStatic.withdrawPbt(...args)
          result = await treasury.withdrawPbt(...args);
        } else {
          await treasury.callStatic.withdrawStablecoin(...args)
          result = await treasury.withdrawStablecoin(...args);
        }
        data = await result.wait();
        eventContext.updateTransactions(data);
        mutateVault(undefined, true);
        mutateAsset(undefined, true);
        setInterestAmount(0)
      } catch (error) {
        console.log(error);
        setError(error);
      }
      setLoading(false)
    }
  }

  return (
    <>
      <header>
        <h1>Lending</h1>
        {active && <Info />}
      </header>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <div className="col-md-12 col-lg-8 offset-lg-2">
          {/* Activity Navigation */}
          <div>
            <ul className="nav nav-pills nav-justified">
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/lend/invest"} onClick={() => { setActivity(ActivityType.IssueEquity); setUnderlyingAmount(0) }}>Invest</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/lend/redeem"} onClick={() => { setActivity(ActivityType.RedeemEquity); setUnderlyingAmount(0) }}>Redeem</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/lend/collect-interest"} onClick={() => { setActivity(ActivityType.Collect); setUnderlyingAmount(0) }}>Collect</NavLink>
              </li>
            </ul>
          </div>
          <hr />
          {/* Fund Management Activities */}
          <Activity active={active} activity={activity} error={error}>
            {
              activity === ActivityType.IssueEquity && (
                <InvestActivity
                  underlyingAmount={underlyingAmount}
                  equityAmount={equityAmount}
                  underlyingRatio={underlyingRatio}
                  invest={invest}
                  loading={loading}
                  onUnderlyingAmountChange={onUnderlyingAmountChange}
                  onEquityAmountChange={onEquityAmountChange}
                  currentAsset={currentAsset}
                  liquidationRatio={liquidationRatio}
                />
              )
            }
            {
              activity === ActivityType.RedeemEquity && (
                <RedemptionActivity
                  underlyingAmount={underlyingAmount}
                  onUnderlyingAmountChange={onUnderlyingAmountChange}
                  equityAmount={equityAmount}
                  underlyingRatio={underlyingRatio}
                  onEquityAmountChange={onEquityAmountChange}
                  currentAsset={currentAsset}
                  redeem={redeem}
                  loading={loading}
                  liquidationRatio={liquidationRatio}
                />
              )
            }
            {
              activity === ActivityType.Collect && (
                <CollectActivity
                  interestAmount={interestAmount}
                  onInterestAmountChange={onInterestAmountChange}
                  collect={collect}
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

export default Lend;