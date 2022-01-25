import { useEffect, useState, useContext } from "react";
import { utils } from "ethers";
import Activity from "../../containers/Activity";
import { FTSO, LIQUIDATOR, VAULT_ENGINE, INTERFACES, RAY } from '../../constants';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from "ethers";
import { Activity as ActivityType } from "../../types";
import numeral from "numeral";
import EventContext from "../../contexts/TransactionContext"
import { getNativeTokenSymbol } from "../../utils";

function Liquidations({ collateralPrice }: { collateralPrice: number }) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [vaults, setVaults] = useState<any>([]);
  const { library, active, chainId } = useWeb3React<Web3Provider>()
  const [error, setError] = useState<any|null>(null);
  const ctx = useContext(EventContext)

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
            equity,
            debt,
            activeAssetAmount
          } = await vaultEngine.vaults(utils.id(getNativeTokenSymbol(chainId!)), address);
          const {
            debtAccumulator,
            adjustedPrice
          } = await vaultEngine.assets(utils.id(getNativeTokenSymbol(chainId!)));

          // Get the vault's debt and equity
          const debtAndEquity = (debt.mul(debtAccumulator).div(RAY)).add(equity)

          // Get the current collateral ratio
          const ftsoContract = new Contract(FTSO, INTERFACES[FTSO].abi, library.getSigner())
          const { _price } = await ftsoContract.getCurrentPrice()

          let collateralRatio
          if (activeAssetAmount.gt(0) && debtAndEquity.gt(0)) {
            collateralRatio = `${activeAssetAmount.mul(_price).div(RAY).mul(100).div(debtAndEquity).toString()}%`
          } else {
            collateralRatio = `0%`
          }
          console.log("collateralRatio", collateralRatio)

          // Check if it's liquidation eligible
          const liquidationEligible = debtAndEquity.gt(activeAssetAmount.mul(adjustedPrice).div(RAY))

          _vaults.push({
            address: address,
            debt: numeral(utils.formatEther(debt.mul(debtAccumulator).div(RAY)).toString()).format('$0,0.00'),
            equity: numeral(utils.formatEther(equity).toString()).format('$0,0.00'),
            collateralRatio,
            liquidationEligible,
          });
        }
        setVaults(_vaults);
        setLoading(false)
      })()
    }
  }, [library, users, collateralPrice, chainId])

  const liquidate = async (vault: any, index: number) => {
    if (library) {
      const liquidator = new Contract(LIQUIDATOR, INTERFACES[LIQUIDATOR].abi, library.getSigner())

      try {
        const result = await liquidator.liquidateVault(utils.id("CFLR"), vault.address);
        const data = await result.wait();
        ctx.updateTransactions(data);
        const _vaults = vaults
        _vaults[index] = {
          ...vault,
          debt: "$0.00",
          equity: "$0.00",
          collateralRatio: "0%",
          liquidationEligible: false
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
              <code>{vault.address}</code>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <h5>Debt</h5>
              {vault.debt}
            </div>
            <div className="col-4">
              <h5>Equity</h5>
              {vault.equity}
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
    <Activity active={active} activity={ActivityType.Liquidate} error={error}>
      <h4>Under-Collateralized Vaults</h4>
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
  )
}

export default Liquidations;