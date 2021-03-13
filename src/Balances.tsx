import React from 'react';
import useSWR from 'swr';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import ProbityABI from "@trustline/probity/artifacts/contracts/Probity.sol/Probity.json";
import TreasuryABI from "@trustline/probity/artifacts/contracts/Treasury.sol/Treasury.json";
import { utils } from "ethers";
import fetcher from "./fetcher";
import { PROBITY_ADDRESS, TREASURY_ADDRESS } from "./constants";

function Balances() {
  const { account, library } = useWeb3React<Web3Provider>()
  const { data: vault } = useSWR([PROBITY_ADDRESS, 'getVault'], {
    fetcher: fetcher(library, ProbityABI.abi),
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
            Vault ID:
          </div>
          <div className="col-4">
            {vault[0].toString()}<br/>
          </div>
        </div>
        <div className="row my-2">
          <div className="col-3">
            Total Coll:
          </div>
          <div className="col-4">
            {utils.formatEther(vault[1])} FLR
          </div>
        </div>
        <div className="row my-2">
          <div className="col-3">
            Coll. Utilized:
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