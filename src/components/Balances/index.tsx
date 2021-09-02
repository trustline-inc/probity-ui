import React from 'react';
import useSWR from 'swr';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import AureiABI from "@trustline-inc/aurei/artifacts/contracts/Aurei.sol/Aurei.json";
import TellerABI from "@trustline-inc/aurei/artifacts/contracts/Teller.sol/Teller.json";
import TreasuryABI from "@trustline-inc/aurei/artifacts/contracts/Treasury.sol/Treasury.json";
import VaultABI from "@trustline-inc/aurei/artifacts/contracts/Vault.sol/Vault.json";
import TcnTokenABI from "@trustline-inc/aurei/artifacts/contracts/TcnToken.sol/TcnToken.json";
import { utils } from "ethers";
import fetcher from "../../fetcher";
import numeral from "numeral";
import { AUREI_ADDRESS, TCNTOKEN_ADDRESS, TELLER_ADDRESS, TREASURY_ADDRESS, VAULT_ADDRESS } from "../../constants";
import './index.css';

function Balances() {
  const { account, library } = useWeb3React<Web3Provider>()
  const { data: vault, mutate: mutateVault } = useSWR([VAULT_ADDRESS, 'balanceOf', account], {
    fetcher: fetcher(library, VaultABI.abi),
  })
  const { data: totalLoanCollateral, mutate: mutateTotalLoanCollateral } = useSWR([VAULT_ADDRESS, 'totalLoanCollateral'], {
    fetcher: fetcher(library, VaultABI.abi),
  })
  const { data: totalStakedCollateral, mutate: mutateTotalStakedCollateral } = useSWR([VAULT_ADDRESS, 'totalStakedCollateral'], {
    fetcher: fetcher(library, VaultABI.abi),
  })
  const { data: interestBalance, mutate: mutateInterestBalance } = useSWR([TREASURY_ADDRESS, 'interestOf', account], {
    fetcher: fetcher(library, TreasuryABI.abi),
  })
  const { data: debtBalance, mutate: mutateDebt } = useSWR([TELLER_ADDRESS, 'balanceOf', account], {
    fetcher: fetcher(library, TellerABI.abi),
  })
  const { data: capitalBalance, mutate: mutateCapital } = useSWR([TREASURY_ADDRESS, 'capitalOf', account], {
    fetcher: fetcher(library, TreasuryABI.abi),
  })
  const { data: tcnBalance, mutate: mutateTcnBalance } = useSWR([TCNTOKEN_ADDRESS, 'balanceOf', account], {
    fetcher: fetcher(library, TcnTokenABI.abi),
  })
  const { data: aureiBalance, mutate: mutateAurei } = useSWR([AUREI_ADDRESS, 'balanceOf', account], {
    fetcher: fetcher(library, AureiABI.abi),
  })
  const { data: totalAurei, mutate: mutateTotalAurei } = useSWR([AUREI_ADDRESS, 'totalSupply'], {
    fetcher: fetcher(library, AureiABI.abi),
  })
  const { data: totalDebt, mutate: mutateTotalDebt } = useSWR([TELLER_ADDRESS, 'totalDebt'], {
    fetcher: fetcher(library, TellerABI.abi),
  })
  const { data: totalSupply, mutate: mutateTotalSupply } = useSWR([TREASURY_ADDRESS, 'totalSupply'], {
    fetcher: fetcher(library, TreasuryABI.abi),
  })

  React.useEffect(() => {
    if (library) {
      library.on("block", () => {
        mutateVault(undefined, true);
        mutateDebt(undefined, true);
        mutateCapital(undefined, true);
        mutateAurei(undefined, true);
        mutateTotalAurei(undefined, true);
        mutateTotalDebt(undefined, true);
        mutateTcnBalance(undefined, true);
        mutateTotalSupply(undefined, true);
        mutateInterestBalance(undefined, true);
        mutateTotalLoanCollateral(undefined, true);
        mutateTotalStakedCollateral(undefined, true);
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
        <h3>Individual</h3>
        <hr />
        <h5>Collateral</h5>
        <div className="row my-2">
          <div className="col-12">
            <h6>Loan Collateral</h6>
            <span className="text-truncate">{numeral(utils.formatEther(vault[0])).format('0,0.0[00000000000000000]')} FLR</span>
          </div>
        </div>
        <div className="row my-2 text-truncate">
          <div className="col-12">
            <h6>Staked Collateral</h6>
            <span className="text-truncate">{numeral(utils.formatEther(vault[1])).format('0,0.0[00000000000000000]')} FLR</span>
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
            <span className="text-truncate">{debtBalance ? numeral(utils.formatEther(debtBalance.toString())).format('0,0.0[00000000000000000]') : null} AUR</span>
          </div>
        </div>
        <div className="row my-2 text-truncate">
          <div className="col-12">
            <h6>Capital</h6>
            <span className="text-truncate">{capitalBalance ? numeral(utils.formatEther(capitalBalance.toString())).format('0,0.0[00000000000000000]') : null} AUR</span>
          </div>
        </div>
        <div className="row my-2 text-truncate">
          <div className="col-12">
            <h6>Interest</h6>
            <span className="text-truncate">{interestBalance ? utils.formatEther(interestBalance.toString()) : null} TCN</span>
          </div>
        </div>
      </div>

      <div className="border rounded p-4 mt-3 shadow-sm bg-white">
        <h3>Aggregate</h3>
        <hr />
        <h5>Collateral</h5>
        <div className="row my-2 text-truncate">
          <div className="col-12">
            <h6>Loan Collateral</h6>
            <span className="text-truncate">{totalLoanCollateral ? numeral(utils.formatEther(totalLoanCollateral.toString())).format('0,0.0[00000000000000000]') : null} FLR</span>
          </div>
        </div>
        <div className="row my-2 text-truncate">
          <div className="col-12">
            <h6>Staked Collateral</h6>
            <span className="text-truncate">{totalStakedCollateral ? numeral(utils.formatEther(totalStakedCollateral.toString())).format('0,0.0[00000000000000000]') : null} FLR</span>
          </div>
        </div>
        <hr />
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
      </div>
    </>
  )
}

export default Balances;