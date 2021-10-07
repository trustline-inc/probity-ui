import React, { useContext, useRef } from "react";
import { Modal } from "bootstrap";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import QRCode from "react-qr-code";
import * as solaris from "@trustline/solaris"
import Info from '../../components/Info';
import { Contract } from "ethers";
import { AUREI_ADDRESS, BRIDGE_ADDRESS } from '../../constants';
import AureiABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/Aurei.sol/Aurei.json";
import BridgeABI from "@trustline-inc/probity/artifacts/contracts/Bridge.sol/Bridge.json";
import EventContext from "../../contexts/TransactionContext"
import { Activity as ActivityType } from "../../types";
import Activity from "../../containers/Activity";

export default function Transfers() {
  const modalRef = useRef(null);
  const [loading, setLoading] = React.useState(false)
  const { account, active, library } = useWeb3React<Web3Provider>()
  const [username, setUsername] = React.useState("");
  const [aureiAmount, setAureiAmount] = React.useState(0);
  const [error, setError] = React.useState<any|null>(null);
  const ctx = useContext(EventContext)

  const onAureiAmountChange = (event: any) => {
    const amount = event.target.value;
    setAureiAmount(amount);
  }

  const onUsernameChange = (event: any) => {
    const username = event.target.value.replace(/[^a-zA-Z\d]/ig, "");
    setUsername(username);
  }

  const initiateTransfer = async () => {
    try {
      setLoading(true)
      const headers = new Headers()
      headers.append('Accept', 'application/xrpl-testnet+json')
      headers.append('PayID-Version', '1.0')

      const response = await fetch(new Request(`https://trustline.app/${username}`), {
        method: 'GET',
        headers
      })

      const json = await response.json()

      if (json.addresses.length > 0) {
        // Take the first one for now
        const address = json.addresses[0].addressDetails.address;

        if (library && account) {
          const aurei = new Contract(AUREI_ADDRESS, AureiABI.abi, library.getSigner())
          const bridge = new Contract(BRIDGE_ADDRESS, BridgeABI.abi, library.getSigner())

          try {
            const issuer = {
              address: "rpWNDcbPe9PZndvWFLK1w1DuNhzbsgtPqG",
              secret: "shnYUmJcLFZWAAaUg7vDNSrSEQx5F"
            }
            const receiver = {
              address: "rDkNWp5gYs4mSt8pXYD6GVF85YK9XxmRKW",
              secret: "sptH3HxFUVghwQJHWnADnQwPY457o"
            }
            const transfer = new solaris.Transfer({
              direction: {
                source: "LOCAL",
                destination: "XRPL_TESTNET"
              },
              amount: aureiAmount,
              token: AUREI_ADDRESS,
              signer: library.getSigner()
            })

            const balance = await aurei.balanceOf(account)
            console.log("balance:", balance.toString())

            let tx = await transfer.approve()
            await tx.wait()
            console.log("approved")

            tx = await transfer.initiate(issuer.address)
            await tx.wait()
            console.log("initiated")

            let status = await bridge.getIssuerStatus(issuer.address);
            console.log("status:", status)

            await transfer.issueTokens("XRPL_TESTNET", issuer, receiver)

            tx = await transfer.verifyIssuance()
            await tx.wait()

            status = await bridge.getIssuerStatus(issuer.address);
            console.log("status:", status)
            setLoading(false)
          } catch (error) {
            console.log(error);
            setError(error);
            setLoading(false)
          }
        }
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const closeModal = () => {
    const modal = new Modal(modalRef.current!, {})
    modal.hide();
  }

  return (
    <>
      {
        <div className="modal" ref={modalRef} id="qr_code" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Scan QR Code</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body d-flex justify-content-center">
                <QRCode value={account!} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      }
      <header className="pt-2">
        <h1>Transfers</h1>
        {active && <Info />}
      </header>
      <p className="lead">Send Aurei to the Trustline App</p>
      <p className="text-secondary"><span className="fa fa-info-circle"></span> This action will ask you to sign an <code>Approve</code> and a <code>transferAureiToXRPL</code> transaction.</p>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <Activity active={active} activity={ActivityType.Transfer} error={error}>
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <label className="form-label">Amount</label>
              <div className="input-group">
                <input type="number" min="0.000000000000000000" placeholder="0.000000000000000000" className="form-control" value={aureiAmount ? aureiAmount : ""} onChange={onAureiAmountChange} />
                <span className="input-group-text font-monospace">{"AUR"}</span>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-8 offset-md-2">
              <label className="form-label">PayString Username</label>
              <div className="input-group">
                <input type="text" className="form-control" value={username} onChange={onUsernameChange} />
                <span className="input-group-text font-monospace">{"$trustline.app"}</span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8 offset-md-2 mt-4 d-grid">
              <button
                className="btn btn-primary btn-lg mt-4"
                onClick={initiateTransfer}
                disabled={aureiAmount === 0 || username === "" || loading}
              >
                {loading ? <i className="fa fa-spin fa-spinner" /> : "Confirm"}
              </button>
            </div>
          </div>
        </Activity>
      </section>
      <p className="lead">Receive Aurei from the Trustline App</p>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <Activity active={active} activity={ActivityType.Transfer} error={null}>
          <div className="row">
            <div className="col-md-8 offset-md-2 my-4 d-grid">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  const modal = new Modal(modalRef.current!, {})
                  modal.show();
                }}
              ><i className="fa fa-qrcode"/> Press for QR Code</button>
            </div>
          </div>
        </Activity>
      </section>
    </>
  )
}