import { useEffect, useState, useContext } from "react";
import { utils } from "ethers";
import Activity from "../../containers/Activity";
import { CONTRACTS, RAY } from '../../constants';
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

function Monitor({ assetPrice }: { assetPrice: number }) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [positions, setPositions] = useState<any>([]);
  const { library, active, chainId } = useWeb3React<Web3Provider>()
  const [error, setError] = useState<any|null>(null);
  const eventContext = useContext(EventContext)
  const assetContext = useContext(AssetContext)
  const nativeTokenSymbol = getNativeTokenSymbol(chainId!)
  const currentAsset = assetContext.asset || nativeTokenSymbol

  useEffect(() => {
    if (library) {
      (async () => {
        const vault = new Contract(CONTRACTS[chainId!].VAULT_ENGINE.address, CONTRACTS[chainId!].VAULT_ENGINE.abi, library.getSigner())
        const _users = await vault.getVaultList();
        setUsers(_users);
      })()
    }
  }, [library, chainId])

  useEffect(() => {
    if (library) {
      (async () => {
        setLoading(true)
        const _positions: any[] = [];
        for (let address of users) {
          const vaultEngine = new Contract(CONTRACTS[chainId!].VAULT_ENGINE.address, CONTRACTS[chainId!].VAULT_ENGINE.abi, library.getSigner())
          const {
            underlying,
            normEquity,
            normDebt,
            collateral,
            initialEquity
          } = await vaultEngine.vaults(utils.id("ETH"), address);
          const { adjustedPrice } = await vaultEngine.assets(utils.id("ETH"));
          const debtAccumulator = await vaultEngine.debtAccumulator();
          const equityAccumulator = await vaultEngine.equityAccumulator();

          const _debt = normDebt.mul(debtAccumulator)

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
          _positions.push({
            address: address,
            debt: `${numbro(utils.formatEther(normDebt.mul(debtAccumulator).div(RAY)).toString()).format(formatOptions)} USD`,
            equity: `${numbro(utils.formatEther(normEquity.mul(equityAccumulator).div(RAY)).toString()).format(formatOptions)} USD`,
            collateralRatio,
            underlyingRatio,
            liquidationEligible,
            underlying: `${numbro(utils.formatEther(underlying).toString()).format(formatOptions)} ${currentAsset}`,
            collateral: `${numbro(utils.formatEther(collateral).toString()).format(formatOptions)} ${currentAsset}`
          });
        }
        setPositions(_positions);
        setLoading(false)
      })()
    }
  }, [library, users, assetPrice, chainId, currentAsset])

  const liquidate = async (vault: any, index: number) => {
    if (library) {
      const liquidator = new Contract(CONTRACTS[chainId!].LIQUIDATOR.address, CONTRACTS[chainId!].LIQUIDATOR.abi, library.getSigner())

      try {
        const result = await liquidator.liquidateVault(utils.id(process.env.REACT_APP_NATIVE_TOKEN!), vault.address);
        const data = await result.wait();
        eventContext.updateTransactions(data);
        const _positions = positions
        _positions[index] = {
          ...vault,
          debt: "$0.00",
          equity: "$0.00",
          collateralRatio: "0%",
          liquidationEligible: false,
        }
        setPositions(_positions)
      } catch (error) {
        console.error(error)
        setError(error);
      }
    }
  }

  const liquidationEligiblePositions = positions.filter((vault: any) => vault.liquidationEligible).map((vault: any, index: number) => {
    return (
      <div className="card my-3 px-2" key={index}>
        <div className="card-body">
          <div className="row">
            <div className="col-8 border">
              <pre className="mt-3">{JSON.stringify(vault, null, 2)}</pre>
            </div>
            <div className="col-4 d-flex justify-content-center align-items-center">
              <div>
                <button className="btn btn-primary w-100" disabled={!vault.liquidationEligible} onClick={() => liquidate(vault, index)}>
                  {loading ? (<i className="fa fa-spinner fa-spin" />) : "Liquidate Position"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  })

  const nonEligiblePositions = positions.filter((vault: any) => !vault.liquidationEligible).map((vault: any, index: number) => {
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
      <h1>Health Monitor</h1>
      <Activity active={active} activity={ActivityType.Monitor} error={error}>
        <h4>Eligible for Collateral Liquidation</h4>
        {
          loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              Loading...
            </div>
          ) : liquidationEligiblePositions.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              No collateral is currently eligible for liquidation
            </div>
          ) : liquidationEligiblePositions
        }
        <div className="py-1" />
        <h4>Non-Eligible Positions</h4>
        {
          loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              Loading...
            </div>
          ) : nonEligiblePositions.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              There are no positions to display.
            </div>
          ) : nonEligiblePositions
        }
      </Activity>
    </>
  )
}

export default Monitor;