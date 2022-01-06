import React from 'react';
import useSWR from 'swr';
import { Nav } from 'react-bootstrap'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { Contract, utils } from "ethers";
import { getNativeTokenSymbol, getStablecoinABI, getStablecoinAddress, getStablecoinSymbol } from "../../utils"
import fetcher from "../../fetcher";
import numeral from "numeral";
import {
  RAY,
  FTSO,
  PBT_TOKEN,
  VAULT_ENGINE,
  INTERFACES
} from "../../constants";
import './index.css';

function Balances() {
  enum BalanceType { Individual, Aggregate }
  const [selected, setSelected] = React.useState(BalanceType.Individual)
  const { account, library, chainId } = useWeb3React<Web3Provider>()
  const [collateralRatio, setCollateralRatio] = React.useState("")
  const [estimatedAPR, setEstimatedAPR] = React.useState("")

  // Read data from deployed contracts
  const { data: vault, mutate: mutateVault } = useSWR([VAULT_ENGINE, "vaults", utils.id(getNativeTokenSymbol(chainId!)), account], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })
  const { data: vaultStablecoinBalance, mutate: mutateVaultStablecoinBalance } = useSWR([VAULT_ENGINE, 'stablecoin', account], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })
  const { data: pbtBalance, mutate: mutateInterestBalance } = useSWR([VAULT_ENGINE, 'pbt', account], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })
  const { data: stablecoinERC20Balance, mutate: mutateStablecoinERC20Balance } = useSWR([getStablecoinAddress(chainId!), 'balanceOf', account], {
    fetcher: fetcher(library, getStablecoinABI(chainId!).abi),
  })
  const { data: pbtERC20Balance, mutate: mutatePbtERC20Balance } = useSWR([PBT_TOKEN, 'balanceOf', account], {
    fetcher: fetcher(library, INTERFACES[PBT_TOKEN].abi),
  })
  const { data: totalStablecoinSupply, mutate: mutatetotalStablecoinSupply } = useSWR([getStablecoinAddress(chainId!), 'totalSupply'], {
    fetcher: fetcher(library, getStablecoinABI(chainId!).abi),
  })
  const { data: totalDebt, mutate: mutateTotalDebt } = useSWR([VAULT_ENGINE, 'totalDebt'], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })
  const { data: totalEquity, mutate: mutateTotalEquity } = useSWR([VAULT_ENGINE, 'totalCapital'], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })
  const { data: collateralType, mutate: mutateCollateralType } = useSWR([VAULT_ENGINE, 'collateralTypes', utils.id(getNativeTokenSymbol(chainId!))], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })

  React.useEffect(() => {
    if (library) {
      library.on("block", () => {
        mutateVault(undefined, true);
        mutateVaultStablecoinBalance(undefined, true);
        mutatetotalStablecoinSupply(undefined, true);
        mutateTotalDebt(undefined, true);
        mutateStablecoinERC20Balance(undefined, true);
        mutatePbtERC20Balance(undefined, true);
        mutateTotalEquity(undefined, true);
        mutateInterestBalance(undefined, true);
        mutateCollateralType(undefined, true);
      });

      return () => {
        library.removeAllListeners("block");
      };
    }
  });

  /**
   * Update the current APR
   */
  React.useEffect(() => {
    if (totalDebt && totalEquity) {
      if (totalEquity.toString() === "0" || totalDebt.toString() === "0") return setEstimatedAPR("0%")
      const borrows = Number(utils.formatEther(totalDebt.div(RAY)));
      const supply = Number(utils.formatEther(totalEquity.div(RAY)));
      const newUtilization = (borrows / supply);
      const newAPR = ((1 / (100 * (1 - newUtilization)))) * 100
      setEstimatedAPR(`${(Math.ceil(newAPR / 0.25) * 0.25).toFixed(2)}%`)
    }
  }, [totalEquity, totalDebt])

  React.useEffect(() => {
    if (library) {
      (async () => {
        try {
          const vaultEngine = new Contract(VAULT_ENGINE, INTERFACES[VAULT_ENGINE].abi, library.getSigner())
          const {
            capital,
            debt,
            usedCollateral
          } = await vaultEngine.vaults(utils.id(getNativeTokenSymbol(chainId!)), account);
          const {
            debtAccumulator
          } = await vaultEngine.collateralTypes(utils.id(getNativeTokenSymbol(chainId!)));
          const ftsoContract = new Contract(FTSO, INTERFACES[FTSO].abi, library.getSigner())
          const { _price } = await ftsoContract.getCurrentPrice()
  
          // Get the vault's debt and equity
          const debtAndEquity = (debt.mul(debtAccumulator).div(RAY)).add(capital)
  
          // Get the current collateral ratio
          if (debtAndEquity.toString() !== "0") {
            const _collateralRatio = `${usedCollateral.mul(_price).div(RAY).mul(100).div(debtAndEquity).toString()}%`
            setCollateralRatio(_collateralRatio)
          } else {
            setCollateralRatio("0%")
          }
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [account, library, chainId, totalDebt, totalEquity])

  if (!vault) return null;
  return (
    <>
      <header className="pt-2">
        <h1>Balances</h1>
      </header>
      <div className="border rounded p-4 shadow-sm bg-white">

        <Nav
          fill
          variant="pills"
          activeKey={selected}
        >
          <Nav.Item>
            <Nav.Link eventKey={BalanceType.Individual} onClick={() => setSelected(BalanceType.Individual)}>Individual</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={BalanceType.Aggregate} onClick={() => setSelected(BalanceType.Aggregate)}>Aggregate</Nav.Link>
          </Nav.Item>
        </Nav>

        <hr />

        {
          selected === BalanceType.Individual ? (
            <>
              <h5>Wallet</h5>
              <div className="row my-2">
                <div className="col-6">
                  Available
                </div>
                <div className="col-6">
                  <span className="text-truncate">{numeral(utils.formatEther(vault.freeCollateral)).format('0,0.0[00000000000000000]')} {getNativeTokenSymbol(chainId!)}</span>
                </div>
              </div>
              <div className="row my-2 text-truncate">
                <div className="col-6">
                  Pledged
                </div>
                <div className="col-6">
                  <span className="text-truncate">{numeral(utils.formatEther(vault.usedCollateral)).format('0,0.0[00000000000000000]')} {getNativeTokenSymbol(chainId!)}</span>
                </div>
              </div>
              <div className="row my-2 text-truncate">
                <div className="col-6">
                  Total
                </div>
                <div className="col-6">
                  <span className="text-truncate">{numeral(utils.formatEther(vault.freeCollateral.add(vault.usedCollateral))).format('0,0.0[00000000000000000]')} {getNativeTokenSymbol(chainId!)}</span>
                </div>
              </div>
              <hr />
              <h5>Treasury & Loans</h5>
              <div className="row my-2 text-truncate">
                <div className="col-6">
                  Equity Balance
                </div>
                <div className="col-6">
                <span className="text-truncate">{vault && collateralType ? numeral(utils.formatEther(vault.capital.mul(collateralType.capitalAccumulator).div(RAY))).format('0,0.0[00000000000000000]') : null} {getStablecoinSymbol(chainId!)}</span>
                </div>
              </div>
              <div className="row my-2 text-truncate">
                <div className="col-6">
                  Debt Balance
                </div>
                <div className="col-6">
                  <span className="text-truncate">{vault && collateralType ? numeral(utils.formatEther(vault.debt.mul(collateralType.debtAccumulator).div(RAY))).format('0,0.0[00000000000000000]') : null} {getStablecoinSymbol(chainId!)}</span>
                </div>
              </div>
              <div className="row my-2 text-truncate">
                <div className="col-6">
                  Collateral Ratio
                </div>
                <div className="col-6">
                  <span className="text-truncate">{collateralRatio}</span>
                </div>
              </div>
              <div className="row my-2 text-truncate">
                <div className="col-6">
                  Current APR
                </div>
                <div className="col-6">
                  <span className="text-truncate">{estimatedAPR}</span>
                </div>
              </div>
              <hr/>
              <h5>Stablecoins</h5>
              <div className="row text-truncate my-2">
                <div className="col-6">
                  Vault {getStablecoinSymbol(chainId!)}
                </div>
                <div className="col-6">
                  {/* TODO: Fix display of balances < 1 which appear as NaN */}
                  <span className="text-truncate">{vaultStablecoinBalance ? numeral(utils.formatEther(vaultStablecoinBalance.div(RAY))).format('0,0.0[00000000000000000]') : "0"} {getStablecoinSymbol(chainId!)}</span>
                </div>
              </div>
              <div className="row text-truncate my-2">
                <div className="col-6">
                  ERC20 {getStablecoinSymbol(chainId!)}
                </div>
                <div className="col-6">
                  <span className="text-truncate">{stablecoinERC20Balance ? numeral(utils.formatEther(stablecoinERC20Balance)).format('0,0.0[00000000000000000]') : "0"} {getStablecoinSymbol(chainId!)}</span>
                </div>
              </div>
              <div className="row text-truncate my-2 mt-4">
                <h5>Voting Power</h5>
                <div className="col-6">
                  Vault PBT
                </div>
                <div className="col-6">
                  <span className="text-truncate">{pbtBalance ? numeral(utils.formatEther(pbtBalance.div(RAY))).format('0,0.0[00000000000000000]') : "0"} PBT</span>
                </div>
              </div>
              <div className="row text-truncate my-2">
                <div className="col-6">
                  ERC20 PBT                 
                </div>
                <div className="col-6">
                  <span className="text-truncate">{pbtERC20Balance ? numeral(utils.formatEther(pbtERC20Balance)).format('0,0.0[00000000000000000]') : "0"} PBT</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h5>System Stats</h5>
              <div className="row my-2 mt-4 text-truncate">
                <div className="col-6">
                  <h6>Circulating Supply</h6>
                </div>
                  <div className="col-6">
                  <span className="text-truncate">{totalStablecoinSupply ? numeral(utils.formatEther(totalStablecoinSupply)).format('0,0.0[00000000000000000]') : null} {getStablecoinSymbol(chainId!)}</span>
                </div>
              </div>
              <div className="row my-2 text-truncate">
                <div className="col-6">
                  <h6>Total Supply</h6>
                </div>
                <div className="col-6">
                  <span className="text-truncate">{totalEquity && collateralType ? numeral(utils.formatEther(totalEquity.div(RAY).mul(collateralType.capitalAccumulator).div(RAY).toString())).format('0,0.0[00000000000000000]') : null} {getStablecoinSymbol(chainId!)}</span>
                </div>
              </div>
              <div className="row my-2 text-truncate">
                <div className="col-6">
                  <h6>Total Debt</h6>
                </div>
                <div className="col-6">
                  <span className="text-truncate">{totalDebt && collateralType ? numeral(utils.formatEther(totalDebt.div(RAY).mul(collateralType.debtAccumulator).div(RAY).toString())).format('0,0.0[00000000000000000]') : null} {getStablecoinSymbol(chainId!)}</span>
                </div>
              </div>
            </>
          )
        }
      </div>
    </>
  )
}

export default Balances;