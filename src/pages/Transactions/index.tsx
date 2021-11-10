import { Contract, utils } from "ethers"
import Web3 from "web3"
import React, { useContext } from "react"
import { Accordion, useAccordionButton } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Info from '../../components/Info';
import EventContext from "../../contexts/TransactionContext"
import { INTERFACES, WAD } from "../../constants";

function RowToggle({ eventKey, name, tx }: any) {
  const decoratedOnClick = useAccordionButton(eventKey);

  return (
    <tr
      className="table-primary d-flex text-center"
      role="button"
      onClick={decoratedOnClick}
    >
      <th className="col-1" scope="row">{Number(eventKey) + 1}</th>
      <td className="col-3"><span className="badge rounded-pill bg-primary">{name}</span></td>
      <td className="col-1">{tx.blockNumber}</td>
      <td className="col-7 text-truncate"><code>{tx.transactionHash}</code></td>
    </tr>
  );
}

export default function Transactions() {
  const web3 = new Web3(Web3.givenProvider || "http://localhost:9560/ext/bc/C/rpc");
  const { active, library } = useWeb3React<Web3Provider>();
  const ctx = useContext(EventContext)
  const rows = ctx.transactions.map((tx: any, index) => {
    const checksumAddress = web3.utils.toChecksumAddress(tx.to)
    const contract = new Contract(checksumAddress, INTERFACES[checksumAddress].abi, library?.getSigner())
    const INDEX = tx.logs.length > 1 ? 1: 0 // Change this later
    let log = contract.interface.parseLog(tx.logs[INDEX]);
    const name = log.name

    return (
      <React.Fragment key={index}>
        <RowToggle eventKey={index.toString()} name={name} tx={tx} />
        {
          (name === "DepositNativeCrypto" || name === "WithdrawNativeCrypto") && (
            <Accordion.Collapse eventKey={index.toString()} className="border">
              <div className="d-flex justify-content-around pt-2">
                <p>Amount: {utils.formatEther(log.args.amount).toString()}</p>
              </div>
            </Accordion.Collapse>
          )
        }
        {
          (name === "SupplyModified") && (
            <Accordion.Collapse eventKey={index.toString()} className="border">
              <div className="d-flex justify-content-around pt-2">
                <p>ΔCapital: {utils.formatEther(log.args.capitalAmount).toString()}</p>
                <p>ΔCollateral: {utils.formatEther(log.args.collAmount).toString()}</p>
              </div>
            </Accordion.Collapse>
          )
        }
        {
          (name === "DebtModified") && (
            <Accordion.Collapse eventKey={index.toString()} className="border">
              <div className="d-flex justify-content-around pt-2">
                <p>ΔDebt: {utils.formatEther(log.args.debtAmount).toString()}</p>
                <p>ΔCollateral: {utils.formatEther(log.args.collAmount).toString()}</p>
              </div>
            </Accordion.Collapse>
          )
        }
        {
          (name === "WithdrawAurei") && (
            <Accordion.Collapse eventKey={index.toString()} className="border">
              <div className="d-flex justify-content-around pt-2">
                <p>Amount: {utils.formatEther(log.args.amount).toString()}</p>
              </div>
            </Accordion.Collapse>
          )
        }
        {
          (name === "Approval") && (
            <Accordion.Collapse eventKey={index.toString()} className="border">
              <div className="d-flex justify-content-around pt-2">
                <p>Spender: {log.args.spender}</p>
                <p>Value: {log.args.value.div(WAD).toString()}</p>
              </div>
            </Accordion.Collapse>
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
            <Accordion defaultActiveKey={"0"}>
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
            </Accordion>
          )}
        </div>
      </section>
    </>
  );
}