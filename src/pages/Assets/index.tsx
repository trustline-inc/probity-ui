import React, { useContext } from 'react';
import numbro from "numbro"
import useSWR from 'swr';
import { NavLink, useLocation } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { Contract, utils } from "ethers";
import web3 from "web3";
import { Helmet } from "react-helmet";
import fetcher from "../../fetcher";
import { Activity as ActivityType } from "../../types";
import Activity from "../../containers/Activity";
import { WAD, CONTRACTS } from '../../constants';
import Info from '../../components/Info';
import EventContext from "../../contexts/TransactionContext"
import AssetContext from "../../contexts/AssetContext"
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
  const assetContext = useContext(AssetContext)

  const { mutate: mutateVault } = useSWR([CONTRACTS[chainId!].VAULT_ENGINE.address, 'vaults', utils.id(getNativeTokenSymbol(chainId!)), account], {
    fetcher: fetcher(library, CONTRACTS[chainId!].VAULT_ENGINE.abi),
  })
  const { mutate: mutateBalance } = useSWR(["getBalance", account, "latest"])

  // Set activity by the path
  React.useEffect(() => {
    if (location.pathname === "/assets/deposit") setActivity(ActivityType.Deposit);
    if (location.pathname === "/assets/withdraw") setActivity(ActivityType.Withdraw);
  }, [location])

  const deposit = async () => {
    if (library && account) {
      try {
        const currentAsset = assetContext.asset
        let contract, args
        let _amount = WAD.mul(amount)

        // Check token type (native token or ERC20 token)
        if (["CFLR", "FLR", "SGB"].includes(currentAsset)) {
          // Native Token
          const nativeAssetManager = CONTRACTS[chainId!].NATIVE_ASSET_MANAGER
          contract = new Contract(nativeAssetManager.address, nativeAssetManager.abi, library.getSigner())
          args = [{
            gasLimit: web3.utils.toWei('400000', 'wei'),
            maxFeePerGas: 25 * 1e9,
            value: _amount
          }]
        } else {
          // ERC20 Token
          const assetManager = CONTRACTS[chainId!].ERC20_ASSET_MANAGER
          contract = new Contract(assetManager.address, assetManager.abi, library.getSigner())

          args = [
            _amount,
            {
              gasLimit: web3.utils.toWei('400000', 'wei'),
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
          console.log("Balance:  ", balance.toString())

          // ERC20 approve transaction
          if (allowance.lt(_amount)) {
            console.log("Creating allowance...")
            result = await erc20.callStatic.approve(assetManager.address, _amount)
            result = await erc20.approve(assetManager.address, _amount);
            const tx = await result.wait();
            console.log("tx", tx)
          }
        }

        setLoading(true)

        // Deposit asset
        console.log("Depositing asset...")
        await contract.callStatic.deposit(...args)
        const result = await contract.deposit(...args);
        const data = await result.wait();
        ctx.updateTransactions(data);
        mutateVault(undefined, true)
        mutateBalance(undefined, true)
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
      const nativeToken = new Contract(CONTRACTS[chainId!].NATIVE_ASSET_MANAGER.address, CONTRACTS[chainId!].NATIVE_ASSET_MANAGER.abi, library.getSigner())
      setLoading(true)

      try {
        // Withdraw asset
        const args = [WAD.mul(amount)]
        await nativeToken.callStatic.withdraw(...args)
        const result = await nativeToken.withdraw(...args);
        const data = await result.wait();
        ctx.updateTransactions(data);
        mutateVault(undefined, true)
        mutateBalance(undefined, true)
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
      <Helmet>
        <title>Probity | Manage Assets</title>
      </Helmet>
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
