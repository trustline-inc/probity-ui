import React from 'react';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from "ethers";
import {
  VAULT_ENGINE,
  NATIVE_COLLATERAL,
  INTERFACES
} from '../../constants';

function Status() {
  const [loading, setLoading] = React.useState(false);
  const { library } = useWeb3React<Web3Provider>()
  const [statuses, setStatuses] = React.useState({
    nativeCollateral: false,
    vaultEngine: false
  })
  const [fetched, setFetched] = React.useState(false)

  // Fetch contract deployment statuses
  React.useEffect(() => {
    if (library && !fetched) {
      (async () => {
        setLoading(true)
        const nativeCollateral = new Contract(NATIVE_COLLATERAL, INTERFACES[NATIVE_COLLATERAL].abi, library.getSigner())
        const vaultEngine = new Contract(VAULT_ENGINE, INTERFACES[VAULT_ENGINE].abi, library.getSigner())
        // If there is no contract currently deployed, the result is 0x.
        if (await nativeCollateral.provider.getCode(nativeCollateral.address) !== "0x")
          setStatuses({ ...statuses, nativeCollateral: true })
        if (await vaultEngine.provider.getCode(vaultEngine.address) !== "0x")
          setStatuses({ ...statuses, vaultEngine: true })
        setLoading(false)
        setFetched(true)
      })()
    }
  }, [library, statuses, fetched])

  return (
    <>
      {!loading && (
        <>
          <h1>Contracts</h1>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <code>NativeCollateral</code>
              {statuses.nativeCollateral ? (
                <span className="badge bg-success rounded-pill">ONLINE</span>
              ) : (
                <span className="badge bg-danger rounded-pill">OFFLINE</span>
              )}
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <code>VaultEngine</code>
              {statuses.vaultEngine ? (
                <span className="badge bg-success rounded-pill">ONLINE</span>
              ) : (
                <span className="badge bg-danger rounded-pill">OFFLINE</span>
              )}
            </li>
          </ul>
        </>
      )}
    </>
  );
}

export default Status;
