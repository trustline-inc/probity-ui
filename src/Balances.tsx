import React from 'react';
import useSWR from 'swr';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import TellerABI from "@trustline/probity/artifacts/contracts/Teller.sol/Teller.json";
import TreasuryABI from "@trustline/probity/artifacts/contracts/Treasury.sol/Treasury.json";
import VaultABI from "@trustline/probity/artifacts/contracts/Vault.sol/Vault.json";
import { utils } from "ethers";
import fetcher from "./fetcher";
import { TELLER_ADDRESS, TREASURY_ADDRESS, VAULT_ADDRESS } from "./constants";

function Balances() {
  const { account, library } = useWeb3React<Web3Provider>()
  const { data: vault } = useSWR([VAULT_ADDRESS, 'get', account], {
    fetcher: fetcher(library, VaultABI.abi),
  })
  const { data: debtBalance } = useSWR([TELLER_ADDRESS, 'balanceOf', account], {
    fetcher: fetcher(library, TellerABI.abi),
  })
  const { data: equityBalance } = useSWR([TREASURY_ADDRESS, 'balanceOf', account], {
    fetcher: fetcher(library, TreasuryABI.abi),
  })

  if (!vault) return null;
  return (
    <>
      <header className="pt-5">
        <h1>Balances</h1>
        <p className="lead">Assets, Debts, and Equity balances.</p>
      </header>
      <div className="border rounded p-4">
        <div className="row my-2">
          <div className="col-3">
            Total Coll:
          </div>
          <div className="col-4">
            {utils.formatEther(vault[0])} FLR
          </div>
        </div>
        <div className="row my-2">
          <div className="col-3">
            Encumbered:
          </div>
          <div className="col-4">
            {utils.formatEther(vault[1])} FLR
          </div>
        </div>
        <div className="row my-2">
          <div className="col-3">
            Available:
          </div>
          <div className="col-4">
            {utils.formatEther(vault[2])} FLR
          </div>
        </div>
        <div className="row my-2">
          <div className="col-3">
            Total Debt:
          </div>
          <div className="col-4">
            0 AUR
          </div>
        </div>
        <div className="row my-2">
          <div className="col-3">
            Total Equity:
          </div>
          <div className="col-4">
            {equityBalance ? utils.formatEther(equityBalance.toString()) : null} AUR
          </div>
        </div>
      </div>
    </>
  )
}

export default Balances;