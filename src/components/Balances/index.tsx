import React from 'react';
import useSWR from 'swr';
import web3 from "web3";
import { Nav } from 'react-bootstrap'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { utils } from "ethers";
import { getNativeTokenSymbol, getStablecoinABI, getStablecoinAddress, getStablecoinSymbol } from "../../utils"
import fetcher from "../../fetcher";
import numeral from "numeral";
import {
  RAY,
  TCN_TOKEN,
  VAULT_ENGINE,
  INTERFACES
} from "../../constants";
import './index.css';

function Balances() {
  enum BalanceType { Individual, Aggregate }
  const [selected, setSelected] = React.useState(BalanceType.Individual)
  const { account, library, chainId } = useWeb3React<Web3Provider>()

  // Read data from deployed contracts
  const { data: vault, mutate: mutateVault } = useSWR([VAULT_ENGINE, "vaults", web3.utils.keccak256(getNativeTokenSymbol(chainId!)), account], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })
  const { data: vaultStablecoinBalance, mutate: mutateVaultStablecoinBalance } = useSWR([VAULT_ENGINE, 'aur', account], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })
  const { data: tcnBalance, mutate: mutateInterestBalance } = useSWR([VAULT_ENGINE, 'tcn', account], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })
  const { data: stablecoinBalance, mutate: mutateStablecoinBalance } = useSWR([getStablecoinAddress(chainId!), 'balanceOf', account], {
    fetcher: fetcher(library, getStablecoinABI(chainId!).abi),
  })
  const { data: tcnERC20Balance, mutate: mutateTcnERC20Balance } = useSWR([TCN_TOKEN, 'balanceOf', account], {
    fetcher: fetcher(library, INTERFACES[TCN_TOKEN].abi),
  })
  const { data: totalStablecoinSupply, mutate: mutatetotalStablecoinSupply } = useSWR([getStablecoinAddress(chainId!), 'totalSupply'], {
    fetcher: fetcher(library, getStablecoinABI(chainId!).abi),
  })
  const { data: totalDebt, mutate: mutateTotalDebt } = useSWR([VAULT_ENGINE, 'totalDebt'], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })
  const { data: totalCapital, mutate: mutateTotalSupply } = useSWR([VAULT_ENGINE, 'totalCapital'], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })

  React.useEffect(() => {
    if (library) {
      library.on("block", () => {
        mutateVault(undefined, true);
        mutateVaultStablecoinBalance(undefined, true);
        mutatetotalStablecoinSupply(undefined, true);
        mutateTotalDebt(undefined, true);
        mutateStablecoinBalance(undefined, true);
        mutateTcnERC20Balance(undefined, true);
        mutateTotalSupply(undefined, true);
        mutateInterestBalance(undefined, true);
      });

      return () => {
        library.removeAllListeners("block");
      };
    }
  });

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
              <h5>Assets</h5>
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
                  Encumbered
                </div>
                <div className="col-6">
                  <span className="text-truncate">{numeral(utils.formatEther(vault.usedCollateral)).format('0,0.0[00000000000000000]')} {getNativeTokenSymbol(chainId!)}</span>
                </div>
              </div>
              <hr />
              <h5>Treasury & Loans</h5>
              <div className="row my-2 text-truncate">
                <div className="col-6">
                  Loan Balance
                </div>
                <div className="col-6">
                  <span className="text-truncate">{vault ? numeral(utils.formatEther(vault.debt)).format('0,0.0[00000000000000000]') : null} {getStablecoinSymbol(chainId!)}</span>
                </div>
              </div>
              <div className="row my-2 text-truncate">
                <div className="col-6">
                  Capital Balance
                </div>
                <div className="col-6">
                <span className="text-truncate">{vault ? numeral(utils.formatEther(vault.capital)).format('0,0.0[00000000000000000]') : null} {getStablecoinSymbol(chainId!)}</span>
                </div>
              </div>
              <hr/>
              <h5>Stablecoins</h5>
              <div className="row text-truncate my-2">
                <div className="col-6">
                  Vault AUR                
                </div>
                <div className="col-6">
                  <span className="text-truncate">{vaultStablecoinBalance ? numeral(utils.formatEther(vaultStablecoinBalance.div(RAY))).format('0,0.0[00000000000000000]') : "0"} {getStablecoinSymbol(chainId!)}</span>
                </div>
              </div>
              <div className="row text-truncate my-2">
                <div className="col-6">
                  ERC20 AUR
                </div>
                <div className="col-6">
                  <span className="text-truncate">{stablecoinBalance ? numeral(utils.formatEther(stablecoinBalance)).format('0,0.0[00000000000000000]') : "0"} {getStablecoinSymbol(chainId!)}</span>
                </div>
              </div>
              <div className="row text-truncate my-2 mt-4">
                <div className="col-6">
                  Vault TCN
                </div>
                <div className="col-6">
                  <span className="text-truncate">{tcnBalance ? numeral(utils.formatEther(tcnBalance.div(RAY))).format('0,0.0[00000000000000000]') : "0"} TCN</span>
                </div>
              </div>
              <div className="row text-truncate my-2">
                <div className="col-6">
                  ERC20 TCN                 
                </div>
                <div className="col-6">
                  <span className="text-truncate">{tcnERC20Balance ? numeral(utils.formatEther(tcnERC20Balance)).format('0,0.0[00000000000000000]') : "0"} TCN</span>
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
                  <span className="text-truncate">{totalCapital ? numeral(utils.formatEther(totalCapital.div(RAY))).format('0,0.0[00000000000000000]') : null} {getStablecoinSymbol(chainId!)}</span>
                </div>
              </div>
              <div className="row my-2 text-truncate">
                <div className="col-6">
                  <h6>Outstanding Loans</h6>
                </div>
                <div className="col-6">
                  <span className="text-truncate">{totalDebt ? numeral(utils.formatEther(totalDebt.div(RAY))).format('0,0.0[00000000000000000]') : null} {getStablecoinSymbol(chainId!)}</span>
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