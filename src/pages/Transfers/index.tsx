import React, { useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap"
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import QRCode from "react-qr-code";
import * as solaris from "@trustline/solaris"
import Info from '../../components/Info';
import { BigNumber, Contract } from "ethers";
import { AUREI_ADDRESS, BRIDGE_ADDRESS, STATE_CONNECTOR_ADDRESS, WAD } from '../../constants';
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
  const [aureiAmount, setAureiAmount] = React.useState(0);
  const [error, setError] = React.useState<any|null>(null);
  const [transferStage, setTransferStage] = React.useState("Pending Transfer")
  const ctx = useContext(EventContext)
  const [showTransferModal, setShowTransferModal] = React.useState(false);
  const [transferModalText, setTransferModalText] = React.useState("");
  const [showQRCodeModal, setShowQRCodeModal] = React.useState(false);

  const handleClose = () => setShowTransferModal(false);
  const handleShow = () => setShowTransferModal(true);

  React.useEffect(() => {
    (async () => {
      try {
        const client = await WalletConnectClient.init({
          apiKey: "28f4820aced00becb7371afffb64bd15",
          relayProvider: "wss://relay.walletconnect.com",
          metadata: {
            name: "Probity",
            description: "Probity",
            url: "#",
            icons: ["https://walletconnect.com/walletconnect-logo.png"],
          },
        });

        client.on(
          CLIENT_EVENTS.pairing.proposal,
          async (proposal: PairingTypes.Proposal) => {
            // uri should be shared with the Wallet either through QR Code scanning or mobile deep linking
            const { uri } = proposal.signal.params;
            console.log("uri", uri)
          }
        );

        const session = await client.connect({
          permissions: {
            blockchain: {
              chains: ["eip155:1"],
            },
            jsonrpc: {
              methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData"],
            },
          },
        });
        console.log("session", session)
      } catch (error) {
        console.log(error)
      }
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

  const initiateTransfer = async () => {
    try {
      setLoading(true)
      setShowTransferModal(true)
      const headers = new Headers()
      headers.append('Accept', 'application/xrpl-testnet+json')
      headers.append('PayID-Version', '1.0')

      const response = await fetch(new Request(`https://trustline.app/${username}`), {
        method: 'GET',
        headers
      })

      const json = await response.json()

      if (json.addresses.length > 0) {
        // Take the first one for now.
        // TODO: Prompt for signing via Xumm or other means
        const address = json.addresses[0].addressDetails.address;

        if (library && account) {
          const bridge = new Contract(BRIDGE_ADDRESS, BridgeABI.abi, library.getSigner())
          const stateConnector = new Contract(STATE_CONNECTOR_ADDRESS, StateConnectorABI.abi, library.getSigner())

          try {
            const issuer = {
              address: "rp1wKYNjcXn6i5J1HsttmCWtgYHNCL2Nh9",
              secret: "shPUTM1oGgARNy1NqfJLFWh75RYqP"
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
              amount: BigNumber.from(aureiAmount).mul(WAD),
              token: AUREI_ADDRESS,
              bridge: BRIDGE_ADDRESS,
              signer: library.getSigner()
            })

            setTransferStage("Pre-Transfer")
            setTransferModalText(`Permit the Bridge contract to spend your AUR for the transfer.`)
            let tx = await transfer.approve()
            setTransferModalText(`Permit tx sent, please wait for a block confirmation.`)
            await tx.wait()
            setTransferStage("Pending Transfer")
            setTransferModalText(`Initiate the transfer with issuer address ${issuer.address}.`)
            tx = await transfer.initiate(issuer.address)
            setTransferModalText(`Transfer initiated with issuer address ${issuer.address}, please wait.`)
            await tx.wait()
            setTransferStage("In-Progress Transfer")
            setTransferModalText(`Issue tokens on the XRP Ledger as ${issuer.address}.`)
            await transfer.issueTokens("XRPL_TESTNET", issuer, receiver)
            setTransferModalText(`Tokens issued.`)
            await stateConnector.setFinality(true);
            setTransferModalText(`Finality set to true. Please verify the issuance.`)
            tx = await transfer.verifyIssuance()
            setTransferModalText(`Verifying issuance, please wait.`)
            await tx.wait()
            setTransferStage("Completed Transfer")
            setTransferModalText(`Done.`)
            const status = await bridge.getIssuerStatus(issuer.address);
            setTransferModalText(`Issuer status: ${status}`)
            setLoading(false)
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

  return (
    <>
      {
        <Modal show={showTransferModal} onHide={handleClose}>
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
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
              )
            }
          </Modal.Body>
          {
            !loading && (
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            )
          }
        </Modal>
      }
      {
        <Modal show={showQRCodeModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Scan QR Code</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex justify-content-center">
            <QRCode value={account!} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      }
      <header className="pt-2">
        <h1>Transfers</h1>
        {active && <Info />}
      </header>
      <p className="lead">Send Aurei to the Trustline App</p>
      <p className="text-secondary"><span className="fa fa-info-circle"></span> This action will ask you to sign an <code>approve</code>, <code>createIssuer</code>, <code>issueTokens</code>, and a <code>verifyIssuance</code> transaction.</p>
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
                onClick={() => handleShow() }
              ><i className="fa fa-qrcode"/> Press for QR Code</button>
            </div>
          </div>
        </Activity>
      </section>
    </>
  )
}