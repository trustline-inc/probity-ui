import { useEffect, useState, useContext } from "react";
import { utils } from "ethers";
import Activity from "../../containers/Activity";
import { LIQUIDATOR, VAULT_ENGINE, INTERFACES, RAY } from '../../constants';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from "ethers";
import { Activity as ActivityType } from "../../types";
import numbro from "numbro";
import EventContext from "../../contexts/TransactionContext"
import AssetContext from "../../contexts/AssetContext"
import { getNativeTokenSymbol } from "../../utils";

const formatOptions = {
  thousandSeparated: true,
  optionalMantissa: true,
  trimMantissa: true,
  mantissa: 4
}

function Liquidations({ assetPrice }: { assetPrice: number }) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [vaults, setVaults] = useState<any>([]);
  const { library, active, chainId } = useWeb3React<Web3Provider>()
  const [error, setError] = useState<any|null>(null);
  const eventContext = useContext(EventContext)
  const assetContext = useContext(AssetContext)
  const nativeTokenSymbol = getNativeTokenSymbol(chainId!)
  const currentAsset = assetContext.asset || nativeTokenSymbol

  useEffect(() => {
    if (library) {
      (async () => {
        const vault = new Contract(VAULT_ENGINE, INTERFACES[VAULT_ENGINE].abi, library.getSigner())
        const _users = await vault.getUserList();
        setUsers(_users);
      })()
    }
  }, [library])

  useEffect(() => {
    if (library) {
      (async () => {
        setLoading(true)
        const _vaults: any[] = [];
        for (let address of users) {
          const vaultEngine = new Contract(VAULT_ENGINE, INTERFACES[VAULT_ENGINE].abi, library.getSigner())
          const {
            underlying,
            equity,
            debt,
            collateral,
            initialEquity
          } = await vaultEngine.vaults(utils.id(currentAsset), address);
          const {
            debtAccumulator,
            adjustedPrice
          } = await vaultEngine.assets(utils.id(currentAsset));

          const _debt = debt.mul(debtAccumulator)

          // Get collateral ratio
          let collateralRatio
          if (_debt.toString() !== "0") {
            const numerator = Number(utils.formatEther(String(collateral))) * assetPrice
            const denominator = Number(utils.formatUnits(String(_debt), 45))
            collateralRatio = `${((numerator / denominator) * 100).toFixed(4)}%`
          } else {
            collateralRatio = "0%"
          }

          // Get underlying ratio
          let underlyingRatio
          if (initialEquity.toString() !== "0") {
            const numerator = Number(utils.formatEther(String(underlying))) * assetPrice
            const denominator = Number(utils.formatUnits(String(initialEquity), 45))
            underlyingRatio = `${((numerator / denominator) * 100).toFixed(4)}%`
          } else {
            underlyingRatio = "0%"
          }

          // Check if it's liquidation eligible
          const liquidationEligible = _debt.gt(collateral.mul(adjustedPrice))

          _vaults.push({
            address: address,
            debt: `${numbro(utils.formatEther(debt.mul(debtAccumulator).div(RAY)).toString()).format(formatOptions)} AUR`,
            equity: `${numbro(utils.formatEther(equity).toString()).format(formatOptions)} AUR`,
            collateralRatio,
            underlyingRatio,
            liquidationEligible,
            underlying: `${numbro(utils.formatEther(underlying).toString()).format(formatOptions)} ${currentAsset}`,
            collateral: `${numbro(utils.formatEther(collateral).toString()).format(formatOptions)} ${currentAsset}`
          });
        }
        setVaults(_vaults);
        setLoading(false)
      })()
    }
  }, [library, users, assetPrice, chainId])

  const liquidate = async (vault: any, index: number) => {
    if (library) {
      const liquidator = new Contract(LIQUIDATOR, INTERFACES[LIQUIDATOR].abi, library.getSigner())

      try {
        const result = await liquidator.liquidateVault(utils.id("CFLR"), vault.address);
        const data = await result.wait();
        eventContext.updateTransactions(data);
        const _vaults = vaults
        _vaults[index] = {
          ...vault,
          debt: "$0.00",
          equity: "$0.00",
          collateralRatio: "0%",
          liquidationEligible: false,
        }
        setVaults(_vaults)
      } catch (error) {
        console.error(error)
        setError(error);
      }
    }
  }

  const liquidationEligibleVaults = vaults.filter((vault: any) => vault.liquidationEligible).map((vault: any, index: number) => {
    return (
      <div className="card my-3" key={index}>
        <div className="card-body">
          <div className="row">
            <div className="col-8 border">
              <pre className="mt-3">{JSON.stringify(vault, null, 2)}</pre>
            </div>
            <div className="col-4 d-flex justify-content-center align-items-center">
              <div>
                <button className="btn btn-primary w-100" disabled={!vault.liquidationEligible} onClick={() => liquidate(vault, index)}>
                  {loading ? (<i className="fa fa-spinner fa-spin" />) : "Liquidate Vault"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  })

  const nonEligibleVaults = vaults.filter((vault: any) => !vault.liquidationEligible).map((vault: any, index: number) => {
    return (
      <div className="card my-3" key={index}>
        <div className="card-body text-center">
          <div className="row mb-3">
            <div className="col-12">
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1"><i className="fa fa-vault"></i></span>
                <input className="form-control" type="text" value={vault.address} readOnly />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <h5>Equity</h5>
              {vault.equity}
            </div>
            <div className="col-4">
              <h5>Underlying</h5>
              {vault.underlying}
            </div>
            <div className="col-4">
              <h5>Supply Ratio</h5>
              {vault.underlyingRatio}
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-4">
              <h5>Debt</h5>
              {vault.debt}
            </div>
            <div className="col-4">
              <h5>Collateral</h5>
              {vault.collateral}
            </div>
            <div className="col-4">
              <h5>Collateral Ratio</h5>
              {vault.collateralRatio}
            </div>
          </div>
        </div>
      </div>
    )
  })

  return (
    <>
      <h1>Vaults</h1>
      <Activity active={active} activity={ActivityType.Liquidate} error={error}>
        <h4>Liquidation Eligible</h4>
        {
          loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              Loading...
            </div>
          ) : liquidationEligibleVaults.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              No vault collateral is currently eligible for liquidation
            </div>
          ) : liquidationEligibleVaults
        }
        <div className="py-1" />
        <h4>Non-Eligible Vaults</h4>
        {
          loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              Loading...
            </div>
          ) : nonEligibleVaults.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              There are no vaults to display.
            </div>
          ) : nonEligibleVaults
        }
      </Activity>
    </>
  )
}

export default Liquidations;