import web3 from "web3"
import { BigNumber, Contract, utils } from "ethers"
import React, { useContext } from "react"
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Info from '../../components/Info';
import EventContext from "../../contexts/TransactionContext"
import numeral from "numeral";
import { INTERFACES } from "../../constants";

export default function Transactions() {
  const { active, library } = useWeb3React<Web3Provider>();
  const ctx = useContext(EventContext)
  const rows = ctx.transactions.map((tx: any, index) => {
    const contract = new Contract(tx.to, INTERFACES[tx.to].abi, library?.getSigner())
    const event = tx.events.find((event: any) => event.event)
    console.log("event:", event)
    if (event) {
      const parsedEvent = contract.interface.parseLog(event);
      console.log("parsed:", parsedEvent)
      if (parsedEvent) {
        console.log(web3.utils.toAscii(parsedEvent.args[0]))
      }
    }
    if (event === undefined) return null;
    return (
      <React.Fragment key={index}>
        <tr className="table-primary d-flex text-center" role="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${index}`}>
          <th className="col-1" scope="row">{index + 1}</th>
          <td className="col-3"><span className="badge rounded-pill bg-primary">{event.event}</span></td>
          <td className="col-1">{tx.blockNumber}</td>
          <td className="col-7 text-truncate"><code>{tx.transactionHash}</code></td>
        </tr>
        {
          event.event === "VaultUpdated" && (
            <tr className="collapse" id={`collapse-${index}`}>
              <td colSpan={4}>
                <table className="table table-borderless mb-0">
                  <thead>
                    <tr className="d-flex">
                      <th className="col-3" scope="col">Collateral</th>
                      <th className="col-3" scope="col">Encumbered</th>
                      <th className="col-3" scope="col">Available</th>
                      <th className="col-3"/>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="d-flex">
                      <td className="col-3">{utils.formatEther(event.args[1]).toString()}</td>
                      <td className="col-3">{utils.formatEther(event.args[2]).toString()}</td>
                      <td className="col-3">{utils.formatEther(event.args[3]).toString()}</td>
                      <td className="col-3"/>
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
              <td colSpan={4}>
                <table className="table table-borderless mb-0 table-responsive">
                  <thead>
                    <tr className="d-flex">
                      <th className="col-3" scope="col">Principal</th>
                      <th className="col-3" scope="col">Collateral</th>
                      <th className="col-3" scope="col">Timestamp</th>
                      <th className="col-3" scope="col">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="d-flex">
                      <td className="col-3">{utils.formatEther(event.args[0]).toString()}</td>
                      <td className="col-3">{utils.formatEther(event.args[1]).toString()}</td>
                      <td className="col-3">{new Date(BigNumber.from(event.args[2]).toNumber() * 1000).toLocaleString()}</td>
                      <td className="col-3">{utils.formatEther(BigNumber.from(event.args[3]).toString().substring(1, BigNumber.from(event.args[3]).toString().length-9))}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          )
        }
        {
          event.event === "Stake" && (
            <tr className="collapse" id={`collapse-${index}`}>
              <td colSpan={4}>
                <table className="table table-borderless mb-0 table-responsive">
                  <thead>
                    <tr className="d-flex">
                      <th className="col-3" scope="col">Capital</th>
                      <th className="col-3" scope="col">Collateral</th>
                      <th className="col-3" scope="col">Timestamp</th>
                      <th className="col-3"/>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="d-flex">
                      <td className="col-3">{utils.formatEther(event.args[0]).toString()} AUR</td>
                      <td className="col-3">{utils.formatEther(event.args[1]).toString()} FLR</td>
                      <td className="col-3">{new Date(BigNumber.from(event.args[2]).toNumber() * 1000).toLocaleString()}</td>
                      <td className="col-3"/>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          )
        }
        {
          event.event === "Redemption" && (
            <tr className="collapse" id={`collapse-${index}`}>
              <td colSpan={4}>
                <table className="table table-borderless mb-0 table-responsive">
                  <thead>
                    <tr className="d-flex">
                      <th className="col-3" scope="col">Capital</th>
                      <th className="col-3" scope="col">Collateral</th>
                      <th className="col-3" scope="col">Timestamp</th>
                      <th className="col-3"/>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="d-flex">
                      <td className="col-3">{utils.formatEther(event.args[0]).toString()} AUR</td>
                      <td className="col-3">{utils.formatEther(event.args[1]).toString()} FLR</td>
                      <td className="col-3">{new Date(BigNumber.from(event.args[2]).toNumber() * 1000).toLocaleString()}</td>
                      <td className="col-3"/>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          )
        }
        {
          event.event === "Withdrawal" && (
            <tr className="collapse" id={`collapse-${index}`}>
              <td colSpan={4}>
                <table className="table table-borderless mb-0 table-responsive">
                  <thead>
                    <tr className="d-flex">
                      <th className="col-3" scope="col">Capital</th>
                      <th className="col-3" scope="col">Collateral</th>
                      <th className="col-3" scope="col">Timestamp</th>
                      <th className="col-3"/>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="d-flex">
                      <td className="col-3">{utils.formatEther(event.args.capital).toString()}</td>
                      <td className="col-3">{utils.formatEther(event.args.collateral).toString()} FLR</td>
                      <td className="col-3">{new Date(BigNumber.from(event.args.timestamp).toNumber() * 1000).toLocaleString()}</td>
                      <td className="col-3"/>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          )
        }
        {
          event.event === "Repayment" && (
            <tr className="collapse" id={`collapse-${index}`}>
              <td colSpan={4}>
                <table className="table table-borderless mb-0">
                  <thead>
                    <tr className="d-flex">
                      <th className="col-3" scope="col">Amount</th>
                      <th className="col-3" scope="col">Collateral</th>
                      <th className="col-3" scope="col">Timestamp</th>
                      <th className="col-3"/>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="d-flex">
                      <td className="col-3">{utils.formatEther(event.args[0]).toString()}</td>
                      <td className="col-3">{utils.formatEther(event.args[1]).toString()}</td>
                      <td className="col-3">{new Date(BigNumber.from(event.args[2]).toNumber() * 1000).toLocaleString()}</td>
                      <td className="col-3"/>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          )
        }
        {
          event.event === "Approval" && (
            <tr className="collapse" id={`collapse-${index}`}>
              <td colSpan={4}>
                <table className="table table-borderless mb-0">
                  <thead>
                    <tr className="d-flex">
                      <th className="col-3" scope="col">Value</th>
                      <th className="col-3" scope="col">Spender</th>
                    </tr>
                  </thead>
                <tbody>
                  <tr className="d-flex">
                    <td className="col-3">{utils.formatEther(event.args.value).toString()}</td>
                    <td className="col-3">{event.args.spender}</td>
                  </tr>
                </tbody>
                </table>
              </td>
            </tr>
          )
        }
        {
          event.event === "Liquidation" && (
            <tr className="collapse" id={`collapse-${index}`}>
              <td colSpan={4}>
                <table className="table table-borderless mb-0">
                  <thead>
                    <tr className="d-flex">
                      <th className="col-3" scope="col">Owner</th>
                      <th className="col-3" scope="col">Coll. Amt.</th>
                      <th className="col-3" scope="col">Coll. Val.</th>
                      {/* <th className="col-3" scope="col">Keeper</th> */}
                      <th className="col-3" scope="col">Timestamp</th>
                    </tr>
                  </thead>
                <tbody>
                  <tr className="d-flex">
                    <td className="col-3 text-truncate">{event.args.borrower}</td>
                    <td className="col-3">{numeral(utils.formatEther(event.args.collateralAmount)).format('0,0.0[00000000000000000]')}</td>
                    <td className="col-3">{numeral(utils.formatEther(event.args.collateralValue)).format('$0,0.00')}</td>
                    {/* <td className="col-3">{event.args.liquidator}</td> */}
                    <td className="col-3">{new Date(BigNumber.from(event.args.timestamp).toNumber() * 1000).toLocaleString()}</td>
                  </tr>
                </tbody>
                </table>
              </td>
            </tr>
          )
        }
        {
          event.event === "NewPendingTransferToXRP" && (
            <tr className="collapse" id={`collapse-${index}`}>
              <td colSpan={4}>
                <table className="table table-borderless mb-0">
                  <thead>
                    <tr className="d-flex">
                      <th className="col-9" scope="col">ID</th>
                      <th className="col-3" scope="col">Amount</th>
                    </tr>
                  </thead>
                <tbody>
                  <tr className="d-flex">
                    <td className="col-9 text-truncate"><code>{event.args.txHash}</code></td>
                    <td className="col-3">{numeral(utils.formatEther(event.args.amount)).format('0,0.0[00000000000000000]')}</td>
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
        <h1>Transaction History</h1>
        <p className="lead">View your transaction history.</p>
        {active && <Info />}
      </header>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <div className="table-responsive">
          {rows.length === 0 ? (
            <div className="py-5">
              <span className="d-flex justify-content-center align-items-center">
                No transactions to display
              </span>
            </div>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr className="d-flex text-center">
                  <th className="col-1" scope="col">#</th>
                  <th className="col-3" scope="col">Event Type</th>
                  <th className="col-1" scope="col">Block</th>
                  <th className="col-7" scope="col">Transaction Hash</th>
                </tr>
              </thead>
              <tbody>
                {rows}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
}