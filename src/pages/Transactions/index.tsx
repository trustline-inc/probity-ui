import { Contract, utils } from "ethers"
import Web3 from "web3"
import React, { useContext } from "react"
import numbro from "numbro"
import { Accordion, useAccordionButton } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Info from '../../components/Info';
import EventContext from "../../contexts/TransactionContext"
import { CONTRACTS, RAY, WAD } from "../../constants";
import { getAssetId } from "../../utils";
import { formatOptions } from "../../constants";

function RowToggle({ eventKey, name, tx }: any) {
  const decoratedOnClick = useAccordionButton(eventKey);

  return (
    <div className="container-fluid border bg-light py-2">
      <div
        className="row d-flex text-center"
        role="button"
        onClick={decoratedOnClick}
      >
        <div className="col-3"><span className="badge rounded-pill bg-primary">{name}</span></div>
        <div className="col-1">{tx.blockNumber}</div>
        <div className="col-8 text-truncate">
          <a href={`https://coston-explorer.flare.network/tx/${tx.transactionHash}`} target="blank">
            <code>{tx.transactionHash}</code>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Transactions() {
  const web3 = new Web3(Web3.givenProvider || "http://localhost:9560/ext/bc/C/rpc");
  const { active, library, chainId } = useWeb3React<Web3Provider>();
  const ctx = useContext(EventContext)

  let rows = ctx.transactions.map((tx: any, index) => {
    return tx.logs.map((element: any, idx: number) => {
      try {
        const checksumAddress = web3.utils.toChecksumAddress(element.address)
        const contract = new Contract(element.address, CONTRACTS[chainId!].INTERFACES[checksumAddress].abi, library?.getSigner())
        let log = contract.interface.parseLog(element);
        const name = log.name
        const key = `${index}${idx}`
        return (
          <React.Fragment key={(key)}>
            <RowToggle eventKey={(key).toString()} name={name} tx={tx} />
            {
              (name === "DepositNativeCrypto" || name === "WithdrawNativeCrypto") && (
                <Accordion.Collapse eventKey={(key).toString()} className="border">
                  <div className="d-flex justify-content-around p-4">
                    <div>Amount: {numbro(utils.formatEther(log.args.amount).toString()).format(formatOptions)}</div>
                  </div>
                </Accordion.Collapse>
              )
            }
            {
              (name === "DepositToken") && (
                <Accordion.Collapse eventKey={(key).toString()} className="border">
                  <div className="d-flex justify-content-around p-4">
                    <div>Token: {log.args.token}</div>
                    <div>Amount: {numbro(utils.formatEther(log.args.amount).toString()).format(formatOptions)}</div>
                  </div>
                </Accordion.Collapse>
              )
            }
            {
              (name === "EquityModified") && (
                <Accordion.Collapse eventKey={(key).toString()} className="border">
                  <div className="d-flex justify-content-around p-4">
                    <div>ΔEquity: {numbro(utils.formatEther(log.args.equityAmount.div(RAY)).toString()).format(formatOptions)}</div>
                    <div>ΔUnderlying: {numbro(utils.formatEther(log.args.underlyingAmount).toString()).format(formatOptions)}</div>
                  </div>
                </Accordion.Collapse>
              )
            }
            {
              (name === "DebtModified") && (
                <Accordion.Collapse eventKey={(key).toString()} className="border">
                  <div className="d-flex justify-content-around p-4">
                    <div>ΔDebt: {numbro(utils.formatEther(log.args.debtAmount.div(RAY)).toString()).format(formatOptions)}</div>
                    <div>ΔCollateral: {numbro(utils.formatEther(log.args.collAmount).toString()).format(formatOptions)}</div>
                  </div>
                </Accordion.Collapse>
              )
            }
            {
              (name === "WithdrawSystemCurrency") && (
                <Accordion.Collapse eventKey={(key).toString()} className="border">
                  <div className="d-flex justify-content-around p-4">
                    <div>Amount: {numbro(utils.formatEther(log.args.amount).toString()).format(formatOptions)} USD</div>
                  </div>
                </Accordion.Collapse>
              )
            }
            {
              (name === "Approval") && (
                <Accordion.Collapse eventKey={(key).toString()} className="border">
                  <div className="d-flex justify-content-around p-4">
                    <div>Spender: {log.args.spender}</div>
                    <div>Value: {numbro(log.args.value.div(WAD).toString()).format(formatOptions)}</div>
                  </div>
                </Accordion.Collapse>
              )
            }
            {
              (name === "Transfer") && (
                <Accordion.Collapse eventKey={(key).toString()} className="border">
                  <div className="p-4">
                    <div>From: {log.args.from}</div>
                    <div>To: {log.args.to}</div>
                    <div>Amount: {numbro(utils.formatEther(log.args.value.toString()).toString()).format(formatOptions)}</div>
                  </div>
                </Accordion.Collapse>
              )
            }
            {
              (name === "IssuancePending") && (
                <Accordion.Collapse eventKey={(key).toString()} className="border">
                  <div className="d-flex justify-content-around p-4">
                    <div>Issuer: {log.args.issuer}</div>
                    <div>Amount: {numbro(utils.formatEther(log.args.amount).toString()).format(formatOptions)}</div>
                  </div>
                </Accordion.Collapse>
              )
            }
            {
              (name === "IssuanceCompleted") && (
                <Accordion.Collapse eventKey={(key).toString()} className="border">
                  <div className="d-flex justify-content-around p-4">
                    <div>Issuer: {log.args.issuer}</div>
                    <div>Amount: {numbro(utils.formatEther(log.args.amount).toString()).format(formatOptions)}</div>
                  </div>
                </Accordion.Collapse>
              )
            }
            {
              (name === "IssuanceCanceled") && (
                <Accordion.Collapse eventKey={(key).toString()} className="border">
                  <div className="d-flex justify-content-around p-4">
                    <div>Issuer: {log.args.issuer}</div>
                  </div>
                </Accordion.Collapse>
              )
            }
            {
              (name === "ReservationCreated") && (
                <Accordion.Collapse eventKey={(key).toString()} className="border">
                  <div className="p-4">
                    <div>Issuer: {log.args.issuer}</div>
                    <div>Source: {log.args.source}</div>
                  </div>
                </Accordion.Collapse>
              )
            }
            {
              (name === "RedemptionCompleted") && (
                <Accordion.Collapse eventKey={(key).toString()} className="border">
                  <div className="p-4"></div>
                </Accordion.Collapse>
              )
            }
            {
              (name === "WithdrawPbt") && (
                <Accordion.Collapse eventKey={(key).toString()} className="border">
                  <div className="d-flex justify-content-around p-4">
                    <div>Amount: {numbro(utils.formatEther(log.args.amount).toString()).format(formatOptions)} PBT</div>
                  </div>
                </Accordion.Collapse>
              )
            }
            {
              (name === "InterestCollected") && (
                <Accordion.Collapse eventKey={(key).toString()} className="border">
                  <div className="d-flex justify-content-around p-4">
                    <div>Amount: {numbro(utils.formatEther(log.args.interestAmount).toString()).format(formatOptions)}</div>
                  </div>
                </Accordion.Collapse>
              )
            }
            {
              (name === "AuctionStarted") && (
                <Accordion.Collapse eventKey={(key).toString()} className="border">
                  <div className="d-flex justify-content-around p-4">
                    <div>ID: {log.args.auctionId.toString()}</div>
                    <div>Lot Size: {numbro(utils.formatEther(log.args.lotSize).toString()).format(formatOptions)} {getAssetId(log.args.collId.toString())}</div>
                  </div>
                </Accordion.Collapse>
              )
            }
            {
              (name === "SupplyModified") && (
                <Accordion.Collapse eventKey={(key).toString()} className="border">
                  <div className="d-flex justify-content-around p-4">
                    <div>Issuer: {log.args.issuer}</div>
                    <div>Beneficiary: {log.args.holder}</div>
                    <div>Amount: {numbro(log.args.amount.toString()).format(formatOptions)}</div>
                  </div>
                </Accordion.Collapse>
              )
            }
            {
              (name === "Log") && (
                <Accordion.Collapse eventKey={(key).toString()} className="border">
                  <div className="p-4">
                    <pre>{JSON.stringify(log.args, null, 2)}</pre>
                  </div>
                </Accordion.Collapse>
              )
            }
          </React.Fragment>
        )
      } catch (error) {
        console.error(error)
        return []
      }
    });
  })

  return (
    <>
      <header>
        <h1>Transaction History</h1>
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
              <div className="border container-fluid p-3">
                <div className="row d-flex text-center">
                  <div className="col-3">Event Type</div>
                  <div className="col-1">Block</div>
                  <div className="col-8">Transaction Hash</div>
                </div>
              </div>
              {rows}
            </Accordion>
          )}
        </div>
      </section>
    </>
  );
}