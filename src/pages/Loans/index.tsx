import React from 'react';
import useSWR from 'swr';
import numbro from "numbro";
import { NavLink, useLocation } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { Contract, utils } from "ethers";
import { Activity as ActivityType } from "../../types";
import Activity from "../../containers/Activity";
import fetcher from "../../fetcher";
import { TELLER, TREASURY, VAULT_ENGINE, INTERFACES } from '../../constants';
import BorrowActivity from './BorrowActivity';
import RepayActivity from './RepayActivity';
import Info from '../../components/Info';
import AssetContext from "../../contexts/AssetContext"
import EventContext from "../../contexts/TransactionContext"
import { getNativeAssetManagerSymbol } from '../../utils';

function Loans({ assetPrice }: { assetPrice: number }) {
  const location = useLocation();
  const assetContext = React.useContext(AssetContext)
  const { account, active, library, chainId } = useWeb3React<Web3Provider>()
  const [activity, setActivity] = React.useState<ActivityType|null>(null);
  const [error, setError] = React.useState<any|null>(null);
  const [collateralAmount, setCollateralAmount] = React.useState(0);
  const [totalCollateral, setTotalCollateral] = React.useState(0);
  const [amount, setBorrowAmount] = React.useState(0);
  const [collateralRatio, setCollateralRatio] = React.useState(0);
  const [maxSize, setMaxSize] = React.useState(0)
  const [loading, setLoading] = React.useState(false);
  const nativeTokenSymbol = getNativeAssetManagerSymbol(chainId!)
  const currentAsset = assetContext.asset || nativeTokenSymbol
  const eventContext = React.useContext(EventContext)

  const { data: vault, mutate: mutateVault } = useSWR([VAULT_ENGINE, 'vaults', utils.id(getNativeAssetManagerSymbol(chainId!)), account], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })
  const { data: rate } = useSWR([TELLER, 'apr'], {
    fetcher: fetcher(library, INTERFACES[TELLER].abi),
  })
  const { data: asset } = useSWR([VAULT_ENGINE, 'assets', utils.id(currentAsset)], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })

  // Set activity by the path
  React.useEffect(() => {
    if (location.pathname === "/loans/borrow") setActivity(ActivityType.Borrow);
    if (location.pathname === "/loans/repay") setActivity(ActivityType.Repay);
  }, [location])

  /**
   * @function borrow
   */
  const borrow = async () => {
    if (library && account) {
      const vaultEngine = new Contract(VAULT_ENGINE, INTERFACES[VAULT_ENGINE].abi, library.getSigner())
      setLoading(true)

      try {
        const result = await vaultEngine.modifyDebt(
          utils.id(getNativeAssetManagerSymbol(chainId!)),
          TREASURY,
          utils.parseUnits(String(collateralAmount), 18),
          utils.parseUnits(String(amount), 45).div(asset.debtAccumulator),
        );
        const data = await result.wait();
        eventContext.updateTransactions(data);
        mutateVault(undefined, true);
        setBorrowAmount(0)
        setCollateralAmount(0)
      } catch (error) {
        console.log(error);
        setError(error);
      }
    }

    setLoading(false)
  }

  /**
   * @function repay
   */
  const repay = async () => {
    if (library && account) {
      const vault = new Contract(VAULT_ENGINE, INTERFACES[VAULT_ENGINE].abi, library.getSigner())
      setLoading(true)

      try {
        const result = await vault.modifyDebt(
          utils.id(getNativeAssetManagerSymbol(chainId!)),
          TREASURY,
          utils.parseUnits(String(-collateralAmount), 18),
          utils.parseUnits(String(-amount), 45).div(asset.debtAccumulator),
        );
        const data = await result.wait();
        eventContext.updateTransactions(data);
        mutateVault(undefined, true);
        setBorrowAmount(0)
        setCollateralAmount(0)
      } catch (error) {
        console.log(error);
        setError(error);
      }

      setLoading(false)
    }
  }

  const onAmountChange = (event: any) => {
    let amount;
    if (!event.target.value) amount = 0
    else amount = Number(numbro.unformat(event.target.value));
    setBorrowAmount(amount);
  }

  const onCollateralAmountChange = (event: any) => {
    let totalAmount, delta;
    if (!event.target.value) delta = 0
    else delta = Number(numbro.unformat(event.target.value));
    if (activity === ActivityType.Repay) totalAmount = Number(utils.formatEther(vault.collateral)) - Number(delta);
    else totalAmount = Number(utils.formatEther(vault.collateral)) + Number(delta);
    setTotalCollateral(totalAmount);
    setCollateralAmount(delta);
  }

  // Dynamically calculate the collateralization ratio
  React.useEffect(() => {
    if (vault) {
      switch (activity) {
        case ActivityType.Borrow:
          setCollateralRatio((totalCollateral * assetPrice) / (Number(utils.formatEther(vault.debt)) + Number(amount)));
          break;
        case ActivityType.Repay:
          setCollateralRatio((totalCollateral * assetPrice) / (Number(utils.formatEther(vault.debt)) - Number(amount)));
          break;
      }
    }
  }, [totalCollateral, assetPrice, amount, vault, activity]);

  return (
    <>
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
