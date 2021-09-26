import React from 'react';
import useSWR from 'swr';
import Nav from 'react-bootstrap/Nav'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import AureiABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/Aurei.sol/Aurei.json";
import VaultEngineABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngine.sol/VaultEngine.json";
import TcnTokenABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/TcnToken.sol/TcnToken.json";
import { utils } from "ethers";
import fetcher from "../../fetcher";
import numeral from "numeral";
import {
  AUREI_ADDRESS,
  TCN_TOKEN_ADDRESS,
  TREASURY_ADDRESS,
  VAULT_ENGINE_ADDRESS
} from "../../constants";
import './index.css';

function Balances() {
  enum BalanceType { Individual, Aggregate }
  const [selected, setSelected] = React.useState(BalanceType.Individual)
  const { account, library } = useWeb3React<Web3Provider>()

  // Read data from deployed contracts
  const { data: vault, mutate: mutateVault } = useSWR([VAULT_ENGINE_ADDRESS, "vaults", utils.formatBytes32String("FLR"), account], {
    fetcher: fetcher(library, VaultEngineABI.abi),
  })
  const { data: aureiBalance, mutate: mutateDebt } = useSWR([VAULT_ENGINE_ADDRESS, 'AUR', account], {
    fetcher: fetcher(library, VaultEngineABI.abi),
  })
  const { data: interestBalance, mutate: mutateInterestBalance } = useSWR([VAULT_ENGINE_ADDRESS, 'TCN', account], {
    fetcher: fetcher(library, VaultEngineABI.abi),
  })
  const { data: tcnBalance, mutate: mutateTcnBalance } = useSWR([TCN_TOKEN_ADDRESS, 'balanceOf', account], {
    fetcher: fetcher(library, TcnTokenABI.abi),
  })
  const { data: totalAurei, mutate: mutateTotalAurei } = useSWR([AUREI_ADDRESS, 'totalSupply'], {
    fetcher: fetcher(library, AureiABI.abi),
  })
  const { data: totalDebt, mutate: mutateTotalDebt } = useSWR([VAULT_ENGINE_ADDRESS, 'totalDebt'], {
    fetcher: fetcher(library, VaultEngineABI.abi),
  })
  const { data: totalSupply, mutate: mutateTotalSupply } = useSWR([VAULT_ENGINE_ADDRESS, 'AUR', TREASURY_ADDRESS], {
    fetcher: fetcher(library, VaultEngineABI.abi),
  })

  React.useEffect(() => {
    if (library) {
      library.on("block", () => {
        mutateVault(undefined, true);
        mutateDebt(undefined, true);
        mutateTotalAurei(undefined, true);
        mutateTotalDebt(undefined, true);
        mutateTcnBalance(undefined, true);
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
        <p className="lead">Assets, Debts, and Capital balances.</p>
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
              <h5>Collateral</h5>
              <div className="row my-2">
                <div className="col-12">
                  <h6>Free Collateral</h6>
                  <span className="text-truncate">{numeral(utils.formatEther(vault.freeCollateral)).format('0,0.0[00000000000000000]')} FLR</span>
                </div>
              </div>
              <div className="row my-2 text-truncate">
                <div className="col-12">
                  <h6>Used Collateral</h6>
                  <span className="text-truncate">{numeral(utils.formatEther(vault.lockedCollateral)).format('0,0.0[00000000000000000]')} FLR</span>
                </div>
              </div>
              <hr />
              <h5>Balance Sheet</h5>
              <div className="row my-2 text-truncate">
                <div className="col-12">
                  <h6>Assets</h6>
                </div>
                <span className="text-truncate">{aureiBalance ? numeral(utils.formatEther(aureiBalance.toString())).format('0,0.0[00000000000000000]') : null} AUR</span>
                <br/>
                <span className="text-truncate">{tcnBalance ? numeral(utils.formatEther(tcnBalance.toString())).format('0,0.0[00000000000000000]') : null} TCN</span>
              </div>
              <div className="row my-2 text-truncate">
                <div className="col-12">
                  <h6>Debt</h6>
                  <span className="text-truncate">{vault ? numeral(utils.formatEther(vault.debt.toString())).format('0,0.0[00000000000000000]') : null} AUR</span>
                </div>
              </div>
              <div className="row my-2 text-truncate">
                <div className="col-12">
                  <h6>Capital</h6>
                  <span className="text-truncate">{vault ? numeral(utils.formatEther(vault.capital.toString())).format('0,0.0[00000000000000000]') : null} AUR</span>
                </div>
              </div>
              <div className="row my-2 text-truncate">
                <div className="col-12">
                  <h6>Interest</h6>
                  <span className="text-truncate">{interestBalance ? utils.formatEther(interestBalance.toString()) : null} TCN</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h5>Balance Sheet</h5>
              <div className="row my-2 text-truncate">
                <div className="col-12">
                  <h6>Assets</h6>
                  <span className="text-truncate">{totalAurei ? numeral(utils.formatEther(totalAurei.toString())).format('0,0.0[00000000000000000]') : null} AUR</span>
                </div>
              </div>
              <div className="row my-2 text-truncate">
                <div className="col-12">
                  <h6>Debt</h6>
                  <span className="text-truncate">{totalDebt ? numeral(utils.formatEther(totalDebt.toString())).format('0,0.0[00000000000000000]') : null} AUR</span>
                </div>
              </div>
              <div className="row my-2 text-truncate">
                <div className="col-12">
                  <h6>Capital</h6>
                  <span className="text-truncate">{totalSupply ? numeral(utils.formatEther(totalSupply.toString())).format('0,0.0[00000000000000000]') : null} AUR</span>
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