import React from 'react';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from "ethers";
import { CONTRACTS } from '../../constants';

function Contracts() {
  const [loading, setLoading] = React.useState(false);
  const { library, chainId } = useWeb3React<Web3Provider>()
  const [contracts, setContracts] = React.useState<{ [key: string]: Contract|null}>({
    "USD": null,
    "USD_MANAGER": null,
    "AUCTIONEER": null,
    "BRIDGE": null,
    "LIQUIDATOR": null,
    "PRICE_FEED": null,
    "NATIVE_ASSET_MANAGER": null,
    "REGISTRY": null,
    "PBT": null,
    "RESERVE_POOL": null,
    "TELLER": null,
    "TREASURY": null,
    "VAULT_ENGINE": null,
  })
  const [fetched, setFetched] = React.useState(false)

  const objectZip = (keys: any, values: any) =>
    keys.reduce(
      (others: any, key: any, index: any) => ({
        ...others,
        [key]: values[index],
      }),
      {}
  );

  React.useEffect(() => {
    if (library && !fetched) {
      (async () => {
        setLoading(true)
        const responses: { [key: string]: Contract } = {}
        for (let contract in contracts) {
          responses[contract] = new Contract(CONTRACTS[chainId!][contract].address, CONTRACTS[chainId!][contract].abi, library.getSigner(chainId))
        }
        const _contracts = objectZip(Object.keys(contracts), await Promise.all(Object.values(responses)))
        console.log("_contracts", _contracts)
        setContracts(_contracts)
        setLoading(false)
        setFetched(true)
      })()
    }
  }, [library, fetched, contracts, chainId])

  console.log("contracts:", contracts)

  const rows = Object.keys(contracts).map(contract => {

    console.log("===========================")
    console.log("contract_name:", contract)
    console.log("contract_instance:", contracts[contract])
    console.log("contract_address:", contracts[contract]?.address)
    return (
      <tr key={contract}>
        <td><code>{contract}</code></td>
        <td>
          {contracts[contract]?.address ? (
            <code className="text-truncate">{contracts[contract]?.address}</code>
          ) : (
            <span className="badge bg-danger rounded-pill">OFFLINE</span>
          )}
        </td>
      </tr>
    )
  })

  console.log("rows", rows)

  return (
    <>
      {!loading ? (
        <>
          <h1>Contracts</h1>
          <div className="table-responsive">
            <table className="table table-bordered">
              <tbody>
                {rows}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="d-flex justify-content-center align-items-center h-100">
          <i className="fa fa-spin fa-spinner fa-2x"></i>
        </div>
      )}
    </>
  );
}

export default Contracts;
