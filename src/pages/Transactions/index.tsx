import { utils } from "ethers"
import React, { useContext } from "react"
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Info from '../../components/Info';
import EventContext from "../../contexts/TransactionContext"

export default function Transactions() {
  const { active } = useWeb3React<Web3Provider>();
  const ctx = useContext(EventContext)

  const rows = ctx.transactions.map((tx: any, index) => {
    const event = tx.events.find((event: any) => event.event)
    if (event === undefined) return <></>
    return (
      <React.Fragment key={index}>
        <tr className="table-primary" role="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${index}`}>
          <th scope="row">{index + 1}</th>
          <td><span className="badge rounded-pill bg-primary">{event.event}</span></td>
          <td>{tx.blockNumber}</td>
          <td><code>{tx.transactionHash}</code></td>
        </tr>
        {
          event.event === "VaultUpdated" && (
            <tr className="collapse" id={`collapse-${index}`}>
              <td/>
              <td colSpan={3}>
                <table className="table table-borderless mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Collateral</th>
                      <th scope="col">Encumbered</th>
                      <th scope="col">Available</th>
                    </tr>
                  </thead>
                <tbody>
                  <tr>
                    <td>{utils.formatEther(event.args[1]).toString()}</td>
                    <td>{utils.formatEther(event.args[2]).toString()}</td>
                    <td>{utils.formatEther(event.args[3]).toString()}</td>
                  </tr>
                </tbody>
                </table>
              </td>
            </tr>
          )
        }
        {
          event.event === "LoanCreated" && (
            <tr className="collapse" id={`collapse-${index}`}>
              <td/>
              <td colSpan={3}>
                <table className="table table-borderless mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Collateral</th>
                      <th scope="col">Principal</th>
                      <th scope="col">Rate</th>
                      <th scope="col">Timestamp</th>
                    </tr>
                  </thead>
                <tbody>
                  <tr>
                    <td>{utils.formatEther(event.args[1]).toString()}</td>
                    <td>{utils.formatEther(event.args[2]).toString()}</td>
                    <td>{utils.formatEther(event.args[3].toString().substring(1, event.args[3].toString().length-9))}</td>
                    <td>{new Date(event.args[4] * 1000).toLocaleString()}</td>
                  </tr>
                </tbody>
                </table>
              </td>
            </tr>
          )
        }
        {
          event.event === "TreasuryUpdated" && (
            <tr className="collapse" id={`collapse-${index}`}>
              <td/>
              <td colSpan={3}>
                <table className="table table-borderless mb-0">
                  <thead>
                    <tr>
                      <th scope="col">Capital</th>
                    </tr>
                  </thead>
                <tbody>
                  <tr>
                    <td>{utils.formatEther(event.args[1]).toString()}</td>
                  </tr>
                </tbody>
                </table>
              </td>
            </tr>
          )
        }
      </React.Fragment>
    )
  });

  return (
    <>
      <header className="pt-2">
        <h1><i className="fas fa-table" style={{fontSize:'1.8rem'}} /> Transactions</h1>
        <p className="lead">View your transaction history.</p>
        {active && <Info />}
      </header>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Event Type</th>
              <th scope="col">Block</th>
              <th scope="col">Transaction Hash</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    </>
  );
}