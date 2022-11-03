import React from 'react';
import useSWR from 'swr';
import numbro from "numbro";
import { NavLink, useLocation } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { Contract, utils, BigNumber } from "ethers";
import web3 from "web3"
import { Helmet } from "react-helmet";
import { Activity as ActivityType } from "../../types";
import Activity from "../../containers/Activity";
import fetcher from "../../fetcher";
import { CONTRACTS, WAD } from '../../constants';
import BorrowActivity from './BorrowActivity';
import RepayActivity from './RepayActivity';
import Info from '../../components/Info';
import AssetContext from "../../contexts/AssetContext"
import EventContext from "../../contexts/TransactionContext"
import { getNativeTokenSymbol } from '../../utils';

function Loans({ assetPrice }: { assetPrice: number }) {
  const location = useLocation();
  const assetContext = React.useContext(AssetContext)
  const { account, active, library, chainId } = useWeb3React<Web3Provider>()
  const [activity, setActivity] = React.useState<ActivityType|null>(null);
  const [error, setError] = React.useState<any|null>(null);
  const [collateralAmount, setCollateralAmount] = React.useState(0);
  const [totalCollateral, setTotalCollateral] = React.useState(0);
  const [amount, setAmount] = React.useState(0);
  const [collateralRatio, setCollateralRatio] = React.useState(0);
  const [maxSize, setMaxSize] = React.useState(0)
  const [loading, setLoading] = React.useState(false);
  const [repayFullAmount, setRepayFullAmount] = React.useState(false)
  const nativeTokenSymbol = getNativeTokenSymbol(chainId!)
  const eventContext = React.useContext(EventContext)

  const { data: vault, mutate: mutateVault } = useSWR([CONTRACTS[chainId!].VAULT_ENGINE.address, 'vaults', utils.id('ETH'), account], {
    fetcher: fetcher(library, CONTRACTS[chainId!].VAULT_ENGINE.abi),
  })
  const { mutate: mutateBalance } = useSWR([CONTRACTS[chainId!].VAULT_ENGINE.address, 'systemCurrency', account], {
    fetcher: fetcher(library, CONTRACTS[chainId!].VAULT_ENGINE.abi),
  })
  const { mutate: mutateLendingPoolDebt } = useSWR([CONTRACTS[chainId!].VAULT_ENGINE.address, 'lendingPoolDebt'], {
    fetcher: fetcher(library, CONTRACTS[chainId!].VAULT_ENGINE.abi),
  })
  const { data: rate } = useSWR([CONTRACTS[chainId!].TELLER.address, 'apr'], {
    fetcher: fetcher(library, CONTRACTS[chainId!].TELLER.abi),
  })
  const { data: debtAccumulator } = useSWR([CONTRACTS[chainId!].VAULT_ENGINE.address, 'debtAccumulator'], {
    fetcher: fetcher(library, CONTRACTS[chainId!].VAULT_ENGINE.abi),
  })
  const { data: asset } = useSWR([CONTRACTS[chainId!].VAULT_ENGINE.address, 'assets', utils.id(nativeTokenSymbol)], {
    fetcher: fetcher(library, CONTRACTS[chainId!].VAULT_ENGINE.abi),
  })

  /**
   * Set activity by the path
   */
  React.useEffect(() => {
    if (location.pathname === "/loans/borrow") setActivity(ActivityType.Borrow);
    if (location.pathname === "/loans/repay") setActivity(ActivityType.Repay);
  }, [location])

  const deposit = async () => {
    if (library && account) {
      try {
        let contract, args, _amount
        if (collateralAmount < 1 && collateralAmount > 0) {
          var divisor = 1 / collateralAmount;
          _amount = WAD.div(divisor)
        } else {
          _amount = WAD.mul(collateralAmount)
        }

        // Native Token
        const assetManager = CONTRACTS[chainId!].NATIVE_ASSET_MANAGER
        contract = new Contract(assetManager.address, assetManager.abi, library.getSigner())

        args = [
          {
            gasLimit: web3.utils.toWei('400000', 'wei'),
            maxFeePerGas: 30 * 1e9,
            value: _amount
          },
        ]

        setLoading(true)

        // Deposit asset
        console.log("Depositing asset...")
        await contract.callStatic.deposit(...args)
        const result = await contract.deposit(...args);
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
   * @function depositSystemCurrency
   */
   const depositSystemCurrency = async (_amount: BigNumber) => {
    if (library && account) {
      const treasury = new Contract(CONTRACTS[chainId!].TREASURY.address, CONTRACTS[chainId!].TREASURY.abi, library.getSigner())
      setLoading(true)
      try {
        const result = await treasury.depositSystemCurrency(
          _amount,
          {
            gasLimit: 400000,
            maxFeePerGas: 30 * 1e9,
            maxPriorityFeePerGas: 1e9
          }
        );
        const data = await result.wait();
        eventContext.updateTransactions(data);
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
      const treasury = new Contract(CONTRACTS[chainId!].TREASURY.address, CONTRACTS[chainId!].TREASURY.abi, library.getSigner())
      setLoading(true)
      try {
        const result = await treasury.withdrawSystemCurrency(
          utils.parseUnits(String(amount), 18),
          {
            gasLimit: 400000,
            maxFeePerGas: 30 * 1e9
          }
        );
        const data = await result.wait();
        eventContext.updateTransactions(data);
        setAmount(0)
      } catch (error) {
        console.log(error);
        setError(error);
      }
    }
  }

  /**
   * @function borrow
   */
  const borrow = async () => {
    if (library && account) {
      const vaultEngine = new Contract(CONTRACTS[chainId!].VAULT_ENGINE.address, CONTRACTS[chainId!].VAULT_ENGINE.abi, library.getSigner())
      const debtAccumulator = await vaultEngine.debtAccumulator()
      setLoading(true)
      await deposit()
      const args = [
        utils.id(process.env.REACT_APP_NATIVE_TOKEN!),
        utils.parseUnits(String(collateralAmount), 18),
        utils.parseUnits(String(amount), 45).div(debtAccumulator),
        { gasLimit: 400000, maxFeePerGas: 30 * 1e9 }
      ]

      try {
        await vaultEngine.callStatic.modifyDebt(...args);
        const result = await vaultEngine.modifyDebt(...args);
        const data = await result.wait();
        eventContext.updateTransactions(data);
        mutateVault(undefined, true);
        mutateBalance(undefined, true);
        mutateLendingPoolDebt(undefined, true)
        setCollateralAmount(0)
      } catch (error) {
        console.log(error);
        setError(error);
      }
    }

    await withdraw()

    setLoading(false)
  }

  /**
   * @function repay
   */
  const repay = async () => {
    if (library && account) {
      const vaultEngine = new Contract(CONTRACTS[chainId!].VAULT_ENGINE.address, CONTRACTS[chainId!].VAULT_ENGINE.abi, library.getSigner())
      const debtAccumulator = await vaultEngine.debtAccumulator()
      setLoading(true)

      let _amount, _collateralAmount
      if (repayFullAmount) {
        _amount = vault?.normDebt.mul("-1")
        _collateralAmount = vault?.collateral.mul("-1")
      } else {
        _amount = utils.parseUnits(String(-amount), 45).div(debtAccumulator)
        _collateralAmount = utils.parseUnits(String(-collateralAmount), 18)
      }

      const args = [
        utils.id(nativeTokenSymbol),
        _collateralAmount,
        _amount,
        { gasLimit: 400000, maxFeePerGas: 30 * 1e9 }
      ]

      try {
        const amount = vault?.normDebt.mul(debtAccumulator)
        await depositSystemCurrency(amount)
        await vaultEngine.callStatic.modifyDebt(...args)
        const result = await vaultEngine.modifyDebt(...args);
        const data = await result.wait();
        eventContext.updateTransactions(data);
        mutateVault(undefined, true);
        mutateBalance(undefined, true);
        mutateLendingPoolDebt(undefined, true)
        setAmount(0)
        setCollateralAmount(0)
      } catch (error) {
        console.log(error);
        setError(error);
      }

      setLoading(false)
    }
  }

  /**
   * @function onAmountChange
   * @param event
   */
  const onAmountChange = (value: string, repayFullAmount?: boolean) => {
    let _amount;
    if (value === null) _amount = 0
    else _amount = Number(numbro.unformat(value));
    setAmount(_amount);
  }

  /**
   * @function onCollateralAmountChange
   * @param event
   */
  const onCollateralAmountChange = (value: string, repayFullAmount?: boolean) => {
    let totalAmount, delta;
    if (!value) delta = 0
    else delta = Number(numbro.unformat(value));
    if (activity === ActivityType.Repay) totalAmount = Number(utils.formatEther(vault.collateral)) - Number(delta);
    else totalAmount = Number(utils.formatEther(vault.collateral)) + Number(delta);
    setTotalCollateral(totalAmount);
    setCollateralAmount(delta);
  }

  /**
   * Dynamically calculate the collateralization ratio
   */
  React.useEffect(() => {
    if (vault && asset) {
      let newDebtAmount
      switch (activity) {
        case ActivityType.Borrow:
          if (vault && debtAccumulator) {
            newDebtAmount = (Number(utils.formatUnits(vault?.normDebt.mul(debtAccumulator), 45)) + Number(amount))
            setCollateralRatio((totalCollateral * assetPrice) / newDebtAmount);
          }
          break;
        case ActivityType.Repay:
          newDebtAmount = (Number(utils.formatUnits(vault.normDebt.mul(debtAccumulator), 45)) - Number(amount))
          if (newDebtAmount === 0) setCollateralRatio(0)
          else setCollateralRatio((totalCollateral * assetPrice) / newDebtAmount);
          break;
      }
    }
  }, [totalCollateral, assetPrice, amount, vault, activity, asset, debtAccumulator]);

  return (
    <>
      <Helmet>
        <title>Probity | Borrow</title>
      </Helmet>
      <header>
        <h1>Debt Management</h1>
        {active && <Info />}
      </header>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <div className="col-md-12 col-lg-8 offset-lg-2">
          {/* Activity Navigation */}
          <div>
            <ul className="nav nav-pills nav-justified">
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/loans/borrow"} onClick={() => { setActivity(ActivityType.Borrow); setCollateralAmount(0) }}>Borrow</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/loans/repay"} onClick={() => { setActivity(ActivityType.Repay); setCollateralAmount(0) }}>Repay</NavLink>
              </li>
            </ul>
          </div>
          <hr />
          {/* Loan Activities */}
          <Activity active={active} activity={activity} error={error}>
            <>
              {
                activity === ActivityType.Borrow && (
                  <BorrowActivity
                    rate={rate}
                    borrow={borrow}
                    loading={loading}
                    maxSize={maxSize}
                    amount={amount}
                    setMaxSize={setMaxSize}
                    collateralRatio={collateralRatio}
                    collateralAmount={collateralAmount}
                    onAmountChange={onAmountChange}
                    onCollateralAmountChange={onCollateralAmountChange}
                  />
                )
              }
              {
                activity === ActivityType.Repay && (
                  <RepayActivity
                    rate={rate}
                    repay={repay}
                    loading={loading}
                    amount={amount}
                    collateralRatio={collateralRatio}
                    collateralAmount={collateralAmount}
                    onAmountChange={onAmountChange}
                    onCollateralAmountChange={onCollateralAmountChange}
                    repayFullAmount={repayFullAmount}
                    setRepayFullAmount={setRepayFullAmount}
                    collateralInUse={vault ? vault?.collateral.div(WAD).toString() : ""}
                    vault={vault}
                    debtAccumulator={debtAccumulator}
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

export default Loans;
