import React from 'react';
import useSWR from 'swr';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import AureiABI from "@trustline/aurei/artifacts/contracts/Aurei.sol/Aurei.json";
import TellerABI from "@trustline/aurei/artifacts/contracts/Teller.sol/Teller.json";
import TreasuryABI from "@trustline/aurei/artifacts/contracts/Treasury.sol/Treasury.json";
import VaultABI from "@trustline/aurei/artifacts/contracts/Vault.sol/Vault.json";
import { utils } from "ethers";
import fetcher from "../../fetcher";
import { AUREI_ADDRESS, TELLER_ADDRESS, TREASURY_ADDRESS, VAULT_ADDRESS } from "../../constants";

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
  const { data: aureiBalance } = useSWR([AUREI_ADDRESS, 'balanceOf', account], {
    fetcher: fetcher(library, AureiABI.abi),
  })
  const { data: totalDebt } = useSWR([TELLER_ADDRESS, 'totalDebt'], {
    fetcher: fetcher(library, TellerABI.abi),
  })
  const { data: totalEquity } = useSWR([TREASURY_ADDRESS, 'totalEquity'], {
    fetcher: fetcher(library, TreasuryABI.abi),
  })

  if (!vault) return null;
  return (
    <>
      <header className="pt-2">
        <h1>Balances</h1>
        <p className="lead">Assets, Debts, and Equity balances.</p>
      </header>
      <div className="border rounded p-4">
        <h3>Indivudual</h3>
        <hr />
        <h5>Collateral</h5>
        <div className="row my-2">
          <div className="col-3">
            Total Coll:
          </div>
          <div className="col-9">
            {utils.formatEther(vault[0])} FLR
          </div>
        </div>
        <div className="row my-2">
          <div className="col-3">
            Encumbered:
          </div>
          <div className="col-9">
            {utils.formatEther(vault[1])} FLR
          </div>
        </div>
        <div className="row my-2">
          <div className="col-3">
            Available:
          </div>
          <div className="col-9">
            {utils.formatEther(vault[2])} FLR
          </div>
        </div>
        <hr />
        <h5>Balance Sheet</h5>
        <div className="row my-2">
          <div className="col-3">
            Assets:
          </div>
          <div className="col-9">
          {aureiBalance ? utils.formatEther(aureiBalance.toString()) : null} AUR
          </div>
        </div>
        <div className="row my-2">
          <div className="col-3">
            Debt:
          </div>
          <div className="col-9">
          {debtBalance ? utils.formatEther(debtBalance.toString()) : null} AUR
          </div>
        </div>
        <div className="row my-2">
          <div className="col-3">
            Equity:
          </div>
          <div className="col-9">
            {equityBalance ? utils.formatEther(equityBalance.toString()) : null} AUR
          </div>
        </div>
      </div>
      <div className="border rounded p-4 mt-3">
        <h3>Aggregate</h3>
        <hr />
        <h5>Collateral</h5>
        <div className="row my-2">
          <div className="col-3">
            Total Coll:
          </div>
          <div className="col-9">
          </div>
        </div>
        <div className="row my-2">
          <div className="col-3">
            Encumbered:
          </div>
          <div className="col-9">
          </div>
        </div>
        <div className="row my-2">
          <div className="col-3">
            Available:
          </div>
          <div className="col-9">
          </div>
        </div>
        <hr />
        <h5>Balance Sheet</h5>
        <div className="row my-2">
          <div className="col-3">
            Assets:
          </div>
          <div className="col-9">
          </div>
        </div>
        <div className="row my-2">
          <div className="col-3">
            Debt:
          </div>
          <div className="col-9">
          {totalDebt ? utils.formatEther(totalDebt.toString()) : null} AUR
          </div>
        </div>
        <div className="row my-2">
          <div className="col-3">
            Equity:
          </div>
          <div className="col-9">
          {totalEquity ? utils.formatEther(totalEquity.toString()) : null} AUR
          </div>
        </div>
      </div>
    </>
  )
}

export default Balances;