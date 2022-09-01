import React from 'react';
import web3 from "web3";
import useSWR from 'swr';
import numbro from "numbro"
import { BigNumber } from 'ethers';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { NavLink, useLocation } from "react-router-dom";
import TreasuryABI from "@trustline-inc/probity/artifacts/contracts/probity/Treasury.sol/Treasury.json";
import VaultEngineABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngine.sol/VaultEngine.json";
import { Contract, utils } from "ethers";
import { Helmet } from "react-helmet";
import fetcher from "../../fetcher";
import Activity from "../../containers/Activity";
import InvestActivity from "./SubscriptionActivity";
import RedemptionActivity from "./RedemptionActivity";
import { Activity as ActivityType } from "../../types";
import { CONTRACTS, RAY, WAD } from '../../constants';
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
  const currentAsset = "USD"
  const [interestType, setInterestType] = React.useState("USD")

  const { data: vault, mutate: mutateVault } = useSWR([CONTRACTS[chainId!].VAULT_ENGINE.address, 'vaults', utils.id(currentAsset), account], {
    fetcher: fetcher(library, CONTRACTS[chainId!].VAULT_ENGINE.abi),
  })

  const { data: price } = useSWR([CONTRACTS[chainId!].PRICE_FEED.address, 'getPrice', utils.id(currentAsset)], {
    fetcher: fetcher(library, CONTRACTS[chainId!].PRICE_FEED.abi),
  })

  const { data: asset, mutate: mutateAsset } = useSWR([CONTRACTS[chainId!].VAULT_ENGINE.address, 'assets', utils.id(currentAsset)], {
    fetcher: fetcher(library, CONTRACTS[chainId!].VAULT_ENGINE.abi),
  })

  let { data: equityAccumulator } = useSWR([CONTRACTS[chainId!].VAULT_ENGINE.address, 'equityAccumulator'], {
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

  const deposit = async () => {
    if (library && account) {
      try {
        const currentAsset = "USD"
        let contract, args
        let _amount = WAD.mul(equityAmount)

        // ERC20 Token
        const assetManager = CONTRACTS[chainId!][`${currentAsset}_MANAGER`]
        contract = new Contract(assetManager.address, assetManager.abi, library.getSigner())

        args = [
          _amount,
          {
            gasLimit: web3.utils.toWei('300000', 'wei'),
            maxFeePerGas: 25 * 1e9,
          },
        ]

        // ERC20 allowance check
        const erc20 = new Contract(CONTRACTS[chainId!].USD.address, CONTRACTS[chainId!].USD.abi, library.getSigner())
        let result = await erc20.allowance(account, assetManager.address);
        const allowance = result
        console.log("Allowance:", allowance.toString())
        console.log("owner:", account)
        console.log("spender:", assetManager.address)

        // ERC20 balance check
        result = await erc20.callStatic.balanceOf(account)
        result = await erc20.balanceOf(account);
        const balance = result
        console.log("Balance:  ", BigNumber.from(balance).div(WAD).toString())

        // ERC20 approve transaction
        if (allowance.lt(_amount)) {
          console.log("Creating allowance...")
          result = await erc20.callStatic.approve(
            assetManager.address,
            _amount,
            {
              gasLimit: web3.utils.toWei('300000', 'wei'),
              maxFeePerGas: 25 * 1e9,
            }
          )
          result = await erc20.approve(
            assetManager.address,
            _amount,
            {
              gasLimit: web3.utils.toWei('300000', 'wei'),
              maxFeePerGas: 25 * 1e9,
            }
          );
          const tx = await result.wait();
          console.log("tx", tx)
        }

        setLoading(true)

        // Deposit asset
        console.log("Depositing asset...")
        await contract.callStatic.deposit(...args)
        result = await contract.deposit(...args);
        const data = await result.wait();
        eventContext.updateTransactions(data);
        mutateVault(undefined, true)
      } catch (error) {
        console.log(error);
        setError(error);
      }
    }
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
   * Dynamically calculate the underlying ratio
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
        totalUnderlying / (Number(utils.formatEther(vault.initialEquity)) + Number(utils.formatEther(vault.normDebt)) + Number(equityAmount))
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
    if (location.pathname === "/investment/subscribe")  setActivity(ActivityType.IssueEquity);
    if (location.pathname === "/investment/redeem") setActivity(ActivityType.RedeemEquity);
  }, [location])

  /**
   * @function subscribe
   */
   const subscribe = async () => {
    if (library && account) {
      const vaultEngine = new Contract(CONTRACTS[chainId!].VAULT_ENGINE.address, CONTRACTS[chainId!].VAULT_ENGINE.abi, library.getSigner())
      equityAccumulator = await vaultEngine.equityAccumulator();
      setLoading(true)
      await deposit()
      try {
        const args = [
          utils.id("USD"),
          utils.parseUnits(String(equityAmount), 18),
          utils.parseUnits(String(equityAmount), 45).div(equityAccumulator),
          { gasLimit: web3.utils.toWei('300000', 'wei'), maxFeePerGas: 25 * 1e9 }
        ]
        console.log("args:", args)
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
      equityAccumulator = await vaultEngine.equityAccumulator();
      setLoading(true)

      try {
        const args = [
          utils.id("USD"),
          utils.parseUnits(String(-equityAmount), 18),
          utils.parseUnits(String(-equityAmount), 45).div(equityAccumulator),
          { gasLimit: web3.utils.toWei('300000', 'wei'), maxFeePerGas: 25 * 1e9 }
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

  return (
    <>
      <Helmet>
        <title>Probity | Private Credit Fund</title>
      </Helmet>
      <header>
        <h1>Investment Management</h1>
        {active && <Info />}
      </header>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <div className="col-md-12 col-lg-8 offset-lg-2">
          {/* Activity Navigation */}
          <div>
            <ul className="nav nav-pills nav-justified">
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  activeClassName="active"
                  to={"/investment/subscribe"}
                  onClick={() => { setActivity(ActivityType.IssueEquity); setUnderlyingAmount(0) }}
                >
                  Subscribe
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  activeClassName="active"
                  to={"/investment/redeem"}
                  onClick={() => { setActivity(ActivityType.RedeemEquity); setUnderlyingAmount(0) }}
                >
                  Redeem
                </NavLink>
              </li>
            </ul>
          </div>
          <hr />
          {/* Fund Management Activities */}
          <Activity active={active} activity={activity} error={error}>
            {
              activity === ActivityType.IssueEquity && (
                <InvestActivity
                  // underlyingAmount={underlyingAmount}
                  underlyingAmount={equityAmount} // Apex demo - for USD only
                  equityAmount={equityAmount}
                  underlyingRatio={underlyingRatio}
                  subscribe={subscribe}
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
                  // underlyingAmount={underlyingAmount}
                  underlyingAmount={equityAmount} // Apex demo - for USD only
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
          </Activity>
        </div>
      </section>
    </>
  );
}

export default Lend;
