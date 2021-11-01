import React, { useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap"
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import Web3 from "web3"
import axios from "axios"
import { RippleAPI } from "ripple-lib"
import QRCode from "react-qr-code";
import * as solaris from "@trustline/solaris"
import Info from '../../components/Info';
import { BigNumber, Contract, utils } from "ethers";
import { AUREI_ADDRESS, BRIDGE_ADDRESS, STATE_CONNECTOR_ADDRESS, WAD } from '../../constants';
import AureiABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/Aurei.sol/Aurei.json";
import BridgeABI from "@trustline/solaris/artifacts/contracts/Bridge.sol/Bridge.json";
import StateConnectorABI from "@trustline/solaris/artifacts/contracts/test/StateConnector.sol/StateConnector.json"
import EventContext from "../../contexts/TransactionContext"
import { Activity as ActivityType } from "../../types";
import Activity from "../../containers/Activity";
import WalletConnectClient, { CLIENT_EVENTS } from "@walletconnect/client";
import { PairingTypes } from "@walletconnect/types";

export default function Transfers() {
  const [loading, setLoading] = React.useState(false)
  const { account, active, library } = useWeb3React<Web3Provider>()
  const [username, setUsername] = React.useState("");
  const [issuerAddress, setIssuerAddress] = React.useState("");
  const [domain, setDomain] = React.useState("")
  const [aureiAmount, setAureiAmount] = React.useState(0);
  const [error, setError] = React.useState<any|null>(null);
  const [transferStage, setTransferStage] = React.useState("Pending Transfer")
  const [transferObj, setTransferObj] = React.useState<solaris.Transfer|null>(null)
  const [showTransferModal, setShowTransferModal] = React.useState(false);
  const [transferModalText, setTransferModalText] = React.useState("");
  const [showQRCodeModal, setShowQRCodeModal] = React.useState(false);
  const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:9650/ext/bc/C/rpc");
  const ctx = useContext(EventContext)

  const handleCloseTransferModal = () => { setShowTransferModal(false); setLoading(false) };

  React.useEffect(() => {
    (async () => {

    })()
  }, [])

  const onAureiAmountChange = (event: any) => {
    const amount = event.target.value;
    setAureiAmount(amount);
  }

  const onUsernameChange = (event: any) => {
    const username = event.target.value.replace(/[^a-zA-Z\d]/ig, "");
    setUsername(username);
  }

  const onDomainChange = (event: any) => {
    const domain = event.target.value.replace(/[^a-zA-Z\d].[^a-zA-Z]/ig, "");
    setDomain(domain);
  }

  const prepareTransfer = async () => {
    try {
      setLoading(true)
      setShowTransferModal(true)
      const headers = new Headers()
      headers.append('Accept', 'application/xrpl-testnet+json')
      headers.append('PayID-Version', '1.0')

      const response = await fetch(new Request(`https://${domain}/${username}`), {
        method: 'GET',
        headers
      })

      const json = await response.json()

      if (json.addresses.length > 0) {
        // Take the first one for now.
        // TODO: Prompt for signing via Xumm or other means
        const address = json.addresses[0].addressDetails.address;

        if (library && account) {
          const transfer = new solaris.Transfer({
            direction: {
              source: "LOCAL",
              destination: "XRPL_TESTNET"
            },
            amount: BigNumber.from(aureiAmount).mul(WAD),
            tokenAddress: AUREI_ADDRESS,
            bridgeAddress: BRIDGE_ADDRESS,
            provider: library
          })
          setTransferObj(transfer)

          try {
            // First check the allowance
            const aurei = new Contract(AUREI_ADDRESS, AureiABI.abi, library.getSigner())
            const allowance = await aurei.allowance(account, BRIDGE_ADDRESS)

            if (Number(utils.formatEther(allowance)) < Number(aureiAmount)) {
              setTransferStage("Pre-Transfer")
              setTransferModalText(`Permit the Bridge contract to spend your AUR for the transfer.`)
              let data = await transfer.approve()
              const transactionObject = {
                to: AUREI_ADDRESS,
                from: account,
                data
              };
              await web3.eth.sendTransaction((transactionObject as any))
              setTransferModalText(`Bridge contract allowance created successfully.`)
              // TODO: Create tx event in context
            }
            const api = new RippleAPI({ server: "wss://s.altnet.rippletest.net" })
            const issuer = api.generateXAddress({ includeClassicAddress: true });
            await axios({
              url: "https://faucet.altnet.rippletest.net/accounts",
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              data: {
                destination: issuer.address,
                amount: 1000
              }
            })
            setTransferStage("Pending Transfer")
            setTransferModalText(`Initiate the transfer with address ${issuer.address}.`)
            setIssuerAddress(issuer.address!)
          } catch (error) {
            console.log(error);
            setError(error);
            setLoading(false)
            setShowTransferModal(false)
          }
        }
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const initiateTransfer = async () => {
    if (library) {
      const bridge = new Contract(BRIDGE_ADDRESS, BridgeABI.abi, library.getSigner())
      const stateConnector = new Contract(STATE_CONNECTOR_ADDRESS, StateConnectorABI.abi, library.getSigner())

      let data = await transferObj!.createIssuer(issuerAddress)
      const transactionObject = {
        to: BRIDGE_ADDRESS,
        from: account,
        data
      };
      await web3.eth.sendTransaction((transactionObject as any))
      setTransferStage("In-Progress Transfer")
      setTransferModalText(`Issue tokens on the XRP Ledger as ${issuerAddress}.`)
      // await transferObj!.issueTokens("XRPL_TESTNET", issuer, receiver)
      // setTransferModalText(`Tokens issued.`)
      // await stateConnector.setFinality(true);
      // setTransferModalText(`Finality set to true. Please verify the issuance.`)
      // let transactionResponse = await transferObj!.verifyIssuance()
      // setTransferModalText(`Verifying issuance, please wait.`)
      // await tx.wait()
      // setTransferStage("Completed Transfer")
      // setTransferModalText(`Done.`)
      // const status = await bridge.getIssuerStatus(issuer.address);
      // setTransferModalText(`Issuer status: ${status}`)
      setLoading(false)
    }
  }

  return (
    <>
      {
        <Modal show={showTransferModal} onHide={handleCloseTransferModal}>
          <Modal.Header>
            <Modal.Title>{transferStage}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ minHeight: 150 }}>
            {transferModalText}
            {
              transferStage === "Pre-Transfer" && (
                <Form className="py-3">
                  <Form.Group className="mb-3">
                    <Form.Label>Bridge Address</Form.Label>
                    <Form.Control type="text" readOnly value={BRIDGE_ADDRESS} />
                    <Form.Text className="text-muted">
                      This is the address of the Bridge contract.
                    </Form.Text>
                  </Form.Group>
                </Form>
              )
            }
            {
              transferStage === "Pending Transfer" && (
                <Form className="py-3">
                  <Form.Group className="mb-3">
                    <Form.Label>Issuer Address</Form.Label>
                    <Form.Control type="text" placeholder="Enter issuing address" />
                    <Form.Text className="text-muted">
                      This is an XRP Ledger account that you control.
                    </Form.Text>
                  </Form.Group>
                  <Button variant="primary" onClick={initiateTransfer}>
                    Submit
                  </Button>
                </Form>
              )
            }
          </Modal.Body>
          {
            !loading && (
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseTransferModal}>
                  Close
                </Button>
              </Modal.Footer>
            )
          }
        </Modal>
      }
      {
        <Modal show={showQRCodeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Scan QR Code</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex justify-content-center">
            <QRCode value={account!} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowQRCodeModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      }
      <header className="pt-2">
        <h1>Transfers</h1>
        {active && <Info />}
      </header>
      <div className="text-secondary d-flex mb-3">
        <div className="d-flex align-items-center me-2">
          <span className="fa fa-info-circle"></span>
        </div>
        <p className="mb-0">This feature uses the <a href="https://walletconnect.com" target="blank">WalletConnect</a> and <a href="https://paystring.org/" target="blank">PayString</a> protocols to transfer Aurei between Songbird and the XRP Ledger via <a href="https://trustline.co/solaris" target="blank">Solaris</a>.</p>
      </div>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <h4 className="text-center">Send Aurei</h4>
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
              <label className="form-label">PayString Address</label>
              <div className="input-group mb-3">
                <input type="text" className="form-control" value={username} onChange={onUsernameChange} placeholder="username" aria-label="username" />
                <span className="input-group-text">$</span>
                <input type="text" className="form-control" value={domain} onChange={onDomainChange} placeholder="trustline.app" aria-label="domain" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8 offset-md-2 mt-4 d-grid">
              <button
                className="btn btn-primary btn-lg mt-4"
                onClick={prepareTransfer}
                disabled={aureiAmount === 0 || username === "" || domain === "" || loading}
              >
                {loading ? <i className="fa fa-spin fa-spinner" /> : "Confirm"}
              </button>
            </div>
          </div>
        </Activity>
      </section>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <h4 className="text-center">Receive Aurei</h4>
        <Activity active={active} activity={ActivityType.Transfer} error={null}>
          <div className="row">
            <div className="col-md-8 offset-md-2 my-4 d-grid">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setShowQRCodeModal(true) }
              ><i className="fa fa-qrcode"/> Press for QR Code</button>
            </div>
          </div>
        </Activity>
      </section>
    </>
  )
}