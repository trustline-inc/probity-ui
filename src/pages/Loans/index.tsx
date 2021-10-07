import React, { useContext } from 'react';
import useSWR from 'swr';
import { NavLink, useLocation } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import AureiABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/Aurei.sol/Aurei.json";
import TellerABI from "@trustline-inc/probity/artifacts/contracts/probity/Teller.sol/Teller.json";
import TreasuryABI from "@trustline-inc/probity/artifacts/contracts/probity/Treasury.sol/Treasury.json";
import VaultEngineABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngine.sol/VaultEngine.json";
import { BigNumber, Contract, utils } from "ethers";
import web3 from "web3";
import { Activity as ActivityType } from "../../types";
import Activity from "../../containers/Activity";
import fetcher from "../../fetcher";
import {
  WAD,
  TELLER_ADDRESS,
  TREASURY_ADDRESS,
  VAULT_ENGINE_ADDRESS,
  AUREI_ADDRESS,
  RAY
} from '../../constants';
import BorrowActivity from './BorrowActivity';
import RepayActivity from './RepayActivity';
import WithdrawActivity from './WithdrawActivity';
import Info from '../../components/Info';
import EventContext from "../../contexts/TransactionContext"

function Loans({ collateralPrice }: { collateralPrice: number }) {
  const location = useLocation();
  const { account, active, library } = useWeb3React<Web3Provider>()
  const [activity, setActivity] = React.useState<ActivityType|null>(null);
  const [error, setError] = React.useState<any|null>(null);
  const [collateralAmount, setCollateralAmount] = React.useState(0);
  const [totalCollateral, setTotalCollateral] = React.useState(0);
  const [aureiAmount, setAureiAmount] = React.useState(0);
  const [collateralRatio, setCollateralRatio] = React.useState(0);
  const [maxSize, setMaxSize] = React.useState(0)
  const [loading, setLoading] = React.useState(false);
  const ctx = useContext(EventContext)

  const { data: vault } = useSWR([VAULT_ENGINE_ADDRESS, 'vaults', web3.utils.keccak256("FLR"), account], {
    fetcher: fetcher(library, VaultEngineABI.abi),
  })
  const { data: rate } = useSWR([TELLER_ADDRESS, 'APR'], {
    fetcher: fetcher(library, TellerABI.abi),
  })

  // Set activity by the path
  React.useEffect(() => {
    if (location.pathname === "/loans/borrow") setActivity(ActivityType.Borrow);
    if (location.pathname === "/loans/repay") setActivity(ActivityType.Repay);
    if (location.pathname === "/loans/withdraw") setActivity(ActivityType.Withdraw);
  }, [location])

  const borrow = async () => {
    if (library && account) {
      const vaultEngine = new Contract(VAULT_ENGINE_ADDRESS, VaultEngineABI.abi, library.getSigner())
      setLoading(true)

      try {
        // Modify debt
        const result = await vaultEngine.modifyDebt(
          web3.utils.keccak256("FLR"),
          TREASURY_ADDRESS,
          WAD.mul(collateralAmount),
          WAD.mul(aureiAmount)
        );
        const data = await result.wait();
        ctx.updateTransactions(data);
      } catch (error) {
        console.log(error);
        setError(error);
      }
    }

    setLoading(false)
  }

  const repay = async () => {
    if (library && account) {
      const vault = new Contract(VAULT_ENGINE_ADDRESS, VaultEngineABI.abi, library.getSigner())
      setLoading(true)

      try {
        // Modify debt
        const result = await vault.modifyDebt(
          web3.utils.keccak256("FLR"),
          TREASURY_ADDRESS,
          WAD.mul(-collateralAmount),
          WAD.mul(-aureiAmount)
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
        const treasury = new Contract("0xD11EcC22b794b6E5312FbF507191f8Cf1a4155F6", TreasuryABI.abi, library.getSigner())
        const aurei = new Contract("0x7c0B4863DB0176c09EB6F9B636b50Fa109594259", AureiABI.abi, library.getSigner())
        const vaultEngine = new Contract("0x8Ae6D9d64Ef3F9c125516207A9da1c87531c3Eee", VaultEngineABI.abi, library.getSigner())
        setLoading(true)
        try {
          const addr = await treasury.aurei()
          console.log("aur addr:", addr)
          let balance = await aurei.totalSupply()
          console.log("supply:", balance.toString())
          console.log("AUR balance before:", balance.toString())
          const amount = BigNumber.from(aureiAmount).mul(RAY)
          console.log("amount:", amount.toString())
          const result = await treasury.withdrawAurei(amount);
          console.log("result", result)
          const data = await result.wait();
          console.log("data", data)
          balance = await aurei.balanceOf(account)
          console.log("AUR balance after :", balance.toString())
          ctx.updateTransactions(data);
        } catch (error) {
          console.log(error);
          setError(error);
        }
        setLoading(false)
      }
  }

  // Listener for Aurei Transfer event
  React.useEffect(() => {
    if (library) {

      const filter = {
        address: "0xcf9173ec85f051a509F4c21Ecb5EaaEDC1A98a21",
        topics: [
          utils.id("Transfer(address,address,uint256)")
        ]
      }

      const treasury = new Contract("0xf6D099B6C81ab597071f954700b73b3810e31c9D", TreasuryABI.abi, library.getSigner())
      const aurei = new Contract(AUREI_ADDRESS, AureiABI.abi, library.getSigner())

      aurei.on("Transfer", (to, amount, from) => {
        console.log("Transfer")
        console.log(to, amount, from);
      });

      treasury.on("Withdrawal", (user, amount) => {
        console.log("Withdrawal")
        console.log(user, amount.toString());
      });

      // const transfer = aurei.filters.Transfer(null, null)

      // library.on(filter, (event) => {
      //   console.log('Transfer Event:', event);
      // })

      return () => {
        // library.removeAllListeners(transfer)
      }
    }
  })

  const onAureiAmountChange = (event: any) => {
    const amount = Number(event.target.value);
    setAureiAmount(amount);
  }

  const onCollateralAmountChange = (event: any) => {
    var totalAmount;
    const delta = Number(event.target.value);
    if (activity === ActivityType.Repay) totalAmount = Number(utils.formatEther(vault.usedCollateral).toString()) - Number(delta);
    else totalAmount = Number(utils.formatEther(vault.usedCollateral).toString()) + Number(delta);
    setTotalCollateral(totalAmount);
    setCollateralAmount(delta);
  }

  // Dynamically calculate the collateralization ratio
  React.useEffect(() => {
    if (vault) {
      switch (activity) {
        case ActivityType.Borrow:
          setCollateralRatio((totalCollateral * collateralPrice) / (Number(utils.formatEther(vault.debt).toString()) + Number(utils.formatEther(vault.capital).toString()) + Number(aureiAmount)));
          break;
        case ActivityType.Repay:
          setCollateralRatio((totalCollateral * collateralPrice) / (Number(utils.formatEther(vault.debt).toString()) + Number(utils.formatEther(vault.capital).toString()) - Number(aureiAmount)));
          break;
      }
    }
  }, [totalCollateral, collateralPrice, aureiAmount, vault, activity]);

  return (
    <>
      <header className="pt-2">
        <h1>Loan Management</h1>
        <p className="lead">Take out a secured stablecoin loan.</p>
        {active && <Info />}
      </header>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <div className="col-md-6 offset-md-3">
          {/* Activity Navigation */}
          <div>
            <ul className="nav nav-pills nav-justified">
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/loans/borrow"} onClick={() => { setActivity(ActivityType.Borrow); setCollateralAmount(0) }}>Borrow</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/loans/repay"} onClick={() => { setActivity(ActivityType.Repay); setCollateralAmount(0) }}>Repay</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to={"/loans/withdraw"} onClick={() => { setActivity(ActivityType.Withdraw); setCollateralAmount(0) }}>Withdraw</NavLink>
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
                    aureiAmount={aureiAmount}
                    setMaxSize={setMaxSize}
                    collateralRatio={collateralRatio}
                    collateralAmount={collateralAmount}
                    onAureiAmountChange={onAureiAmountChange}
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
                    aureiAmount={aureiAmount}
                    collateralRatio={collateralRatio}
                    collateralAmount={collateralAmount}
                    onAureiAmountChange={onAureiAmountChange}
                    onCollateralAmountChange={onCollateralAmountChange}
                  />
                )
              }
              {
                activity === ActivityType.Withdraw && (
                  <WithdrawActivity
                    maxSize={maxSize}
                    setMaxSize={setMaxSize}
                    aureiAmount={aureiAmount}
                    onAureiAmountChange={onAureiAmountChange}
                    withdraw={withdraw}
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

export default Loans;
