import React from 'react';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from "ethers";
import { CONTRACTS } from '../../constants';

function Status() {
  const [loading, setLoading] = React.useState(false);
  const { library, chainId } = useWeb3React<Web3Provider>()
  const [statuses, setStatuses] = React.useState<{ [key: string]: boolean}>({
    USD: false,
    AUCTIONEER: false,
    BRIDGE: false,
    LIQUIDATOR: false,
    PRICE_FEED: false,
    NATIVE_ASSET_MANAGER: false,
    REGISTRY: false,
    PBT: false,
    RESERVE_POOL: false,
    TELLER: false,
    TREASURY: false,
    VAULT_ENGINE: false,
    VAULT_MANAGER: false,
  })
  const [fetched, setFetched] = React.useState(false)
  const contracts: { [key: string]: any } = {
    "USD": CONTRACTS[chainId!].USD,
    "AUCTIONEER": CONTRACTS[chainId!].AUCTIONEER,
    "BRIDGE": CONTRACTS[chainId!].BRIDGE,
    "LIQUIDATOR": CONTRACTS[chainId!].LIQUIDATOR,
    "PRICE_FEED": CONTRACTS[chainId!].PRICE_FEED,
    "NATIVE_ASSET_MANAGER": CONTRACTS[chainId!].NATIVE_ASSET_MANAGER,
    "REGISTRY": CONTRACTS[chainId!].REGISTRY,
    "PBT": CONTRACTS[chainId!].PBT,
    "RESERVE_POOL": CONTRACTS[chainId!].RESERVE_POOL,
    "TELLER": CONTRACTS[chainId!].TELLER,
    "TREASURY": CONTRACTS[chainId!].TREASURY,
    "VAULT_ENGINE": CONTRACTS[chainId!].VAULT_ENGINE
  }

  const objectZip = (keys: any, values: any) =>
  keys.reduce(
    (others: any, key: any, index: any) => ({
      ...others,
      [key]: values[index],
    }),
    {}
  );

  // Fetch contract deployment statuses
  React.useEffect(() => {
    if (library && !fetched) {
      (async () => {
        setLoading(true)
        const responses: { [key: string]: boolean } = {}
        for (let key in contracts) {
          try {
            const contract = contracts[key]
            if (!contract.address) {
              console.log("no address for " + contract)
              continue
            }
            const _contract = new Contract(contract.address, contract.abi, library.getSigner())
            // If there is no contract currently deployed, the result is 0x.
            responses[contract] = await (new Promise(async (resolve, reject) => {
              if (_contract.address) {
                const code = await _contract.provider.getCode(_contract.address)
                const result = code !== "0x"
                resolve(result)
              } else {
                reject(false)
              }
            }))
          } catch (error) {
            continue
          }
        }
        setStatuses(objectZip(Object.keys(responses), await Promise.all(Object.values(responses))))
        setLoading(false)
        setFetched(true)
      })()
    }
  }, [library, fetched])

  const rows = Object.keys(statuses).map(contract => {
    return (
      <tr key={contract}>
        <td><code>{contract}</code></td>
        <td>
          {statuses[contract] ? (
            <code className="text-truncate">{contracts[contract]}</code>
          ) : (
            <span className="badge bg-danger rounded-pill">OFFLINE</span>
          )}
        </td>
      </tr>
    )
  })

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

export default Status;
