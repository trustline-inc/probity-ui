import React, { useContext, useRef } from "react";
import web3 from "web3";
import { Modal } from "bootstrap";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import QRCode from "react-qr-code";
import Info from '../../components/Info';
import { Contract, utils } from "ethers";
import { AUREI_ADDRESS, BRIDGE_ADDRESS } from '../../constants';
import AureiABI from "@trustline-inc/aurei/artifacts/contracts/Aurei.sol/Aurei.json";
import BridgeABI from "@trustline-inc/aurei/artifacts/contracts/Bridge.sol/Bridge.json";
import EventContext from "../../contexts/TransactionContext"
import { Activity as ActivityType } from "../../types";
import Activity from "../../containers/Activity";

export default function Transfers() {
  const modalRef = useRef(null);
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
    const username = event.target.value;
    setUsername(username);
  }

  const initiateTransfer = async () => {
    try {
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
            var result, data;
            result = await aurei.approve(
              BRIDGE_ADDRESS,
              utils.parseUnits(aureiAmount.toString(), "ether").toString()
            );
            data = await result.wait();
            ctx.updateTransactions(data);
            result = await bridge.transferAureiToXRP(
              address,
              utils.parseUnits(aureiAmount.toString(), "ether").toString(),
              (Date.now() / 1000).toFixed(0),
              {
                gasPrice: web3.utils.toWei('225', 'Gwei'),
                gasLimit: 300000
              });
            data = await result.wait();
            ctx.updateTransactions(data);
          } catch (error) {
            console.log(error);
            setError(error);
          }
        }
      }
    } catch (error) {
      console.log(error)
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
              <label className="form-label">PayString</label>
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
                disabled={aureiAmount === 0}
              >Confirm</button>
            </div>
          </div>
        </Activity>
      </section>
      <p className="lead">Receive Aurei from the Trustline App</p>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <Activity active={active} activity={ActivityType.Transfer} error={error}>
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