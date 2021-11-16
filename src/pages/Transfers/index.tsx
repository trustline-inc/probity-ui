import React, { useContext } from "react";
import { Alert, Button, Form, Modal, Row, Col, Container } from "react-bootstrap"
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import QRCodeModal from "@walletconnect/qrcode-modal";
import { ERROR, getAppMetadata } from "@walletconnect/utils";
import Web3 from "web3"
import * as solaris from "@trustline/solaris"
import Info from '../../components/Info';
import { BigNumber, Contract, utils } from "ethers";
import {
  BRIDGE,
  DEFAULT_APP_METADATA,
  DEFAULT_LOGGER,
  DEFAULT_METHODS,
  DEFAULT_RELAY_PROVIDER,
  STATE_CONNECTOR,
  WAD,
  INTERFACES
} from '../../constants';
import EventContext from "../../contexts/TransactionContext"
import { Activity as ActivityType } from "../../types";
import Activity from "../../containers/Activity";
import WalletConnectClient, { CLIENT_EVENTS } from "@walletconnect/client";
import { PairingTypes, SessionTypes } from "@walletconnect/types";
import { getStablecoinAddress, getStablecoinName, getStablecoinSymbol } from "../../utils";

export default function Transfers() {
  const [transfer, setTransfer] = React.useState<any>()
  const [transferData, setTransferData] = React.useState<any>(localStorage.getItem('probity-transfer'));
  const [verifiedIssuers, setVerifiedIssuers] = React.useState<any>()
  const [session, setSession] = React.useState<SessionTypes.Settled|undefined>()
  const [pairings, setPairings] = React.useState<string[]|undefined>()
  const [transferInProgress, setTransferInProgress] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [username, setUsername] = React.useState("");
  const [issuerAddress, setIssuerAddress] = React.useState("");
  const [receiverAddress, setReceiverAddress] = React.useState("");
  const [transactionID, setTransactionID] = React.useState("");
  const [domain, setDomain] = React.useState("")
  const [transferAmount, setTransferAmount] = React.useState(0);
  const [error, setError] = React.useState<any|null>(null);
  const [transferStage, setTransferStage] = React.useState(transferData?.stage || "")
  const [showTransferModal, setShowTransferModal] = React.useState(false);
  const [transferModalBody, setTransferModalBody] = React.useState<any>();
  const { account, active, library, chainId } = useWeb3React<Web3Provider>()
  const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:9650/ext/bc/C/rpc");
  const client = React.useRef<WalletConnectClient>()
  const ctx = useContext(EventContext)

  // Transfer modal
  const handleCloseTransferModal = () => { setShowTransferModal(false); setLoading(false) };

  /**
   * Initializes the WalletConnect client and subscribe to events
   */
  React.useEffect(() => {
    (async () => {
      try {
        if (!client.current) {
          client.current = await WalletConnectClient.init({
            controller: false,
            logger: DEFAULT_LOGGER,
            relayProvider: DEFAULT_RELAY_PROVIDER,
          });

          client.current.on(
            CLIENT_EVENTS.pairing.proposal,
            async (proposal: PairingTypes.Proposal) => {
              const { uri } = proposal.signal.params;
              console.log("EVENT", "QR Code Modal open");
              QRCodeModal.open(uri, () => {
                console.log("EVENT", "QR Code Modal closed");
              });
            },
          );

          client.current.on(CLIENT_EVENTS.pairing.created, async (proposal: PairingTypes.Settled) => {
            if (typeof client.current === "undefined") return;
            setPairings(client.current.pairing.topics);
          });

          client.current.on(CLIENT_EVENTS.session.deleted, (session: SessionTypes.Settled) => {
            if (session.topic !== session?.topic) return;
            console.log("EVENT", "session_deleted");
          });
        }

        if (pairings) console.log("pairings", pairings)
      } catch (error) {
        console.log("connection error")
        alert(JSON.stringify(error))
        console.error(error)
      }
    })()

    return () => {
      if (client.current && session) {
        client.current.disconnect({
          topic: session.topic,
          reason: ERROR.USER_DISCONNECTED.format(),
        });
      }
    }
  }, [session, pairings])

  /**
   * Save every update to the current transfer
   */
  React.useEffect(() => {
    if (transferData === null) return localStorage.removeItem("probity-transfer")
    localStorage.setItem("probity-transfer", JSON.stringify(transferData));
    console.log("transferData updated:", transferData)
  }, [transferData]);

  /**
   * Only triggers on page load. Gets redemption reservations and valid issuers.
   */
  React.useEffect(() => {
    // Get redemption reservations
    const _transfer = localStorage.getItem("probity-transfer")
    if (_transfer && JSON.parse(_transfer)?.reservation) {
      console.log("reservation found", JSON.parse(_transfer)?.reservation)
    }

    (async () => {
      // Get verified issuers
      const bridge = new Contract(BRIDGE, INTERFACES[BRIDGE].abi, library)
      const _verifiedIssuers = await bridge.getVerifiedIssuers()
      setVerifiedIssuers(_verifiedIssuers)
    })()
  }, [])

  /**
   * Input event handlers
   */

  const onTransferAmountChange = (event: any) => {
    const amount = event.target.value;
    setTransferAmount(amount);
  }

  const onUsernameChange = (event: any) => {
    const username = event.target.value.replace(/[^a-zA-Z\d]/ig, "");
    setUsername(username);
  }

  const onDomainChange = (event: any) => {
    const domain = event.target.value.replace(/[^a-zA-Z\d].[^a-zA-Z]/ig, "");
    setDomain(domain);
  }

  /**
   * @function connect
   * @param pairing 
   * Connects to relay server and awaits for session establishment.
   */
  const connect = async (pairing?: { topic: string }) => {
    console.log("connecting to relay server")
    if (typeof client.current === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }

    try {
      const methods: string[] = DEFAULT_METHODS.flat()
      const session = await client.current.connect({
        metadata: getAppMetadata() || DEFAULT_APP_METADATA,
        pairing,
        permissions: {
          blockchain: {
            chains: ["xrpl:2"],
          },
          jsonrpc: {
            methods,
          },
        },
      });
      console.log("session", session)

      onSessionConnected(session);
    } catch (e) {
      // ignore rejection
      console.log(e)
    }

    // close modal in case it was open
    QRCodeModal.close();
  };

  /**
   * @function disconnect
   * Ends session and disconnects from the relay server.
   */
  const disconnect = async () => {
    if (typeof client.current === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    if (typeof session === "undefined") {
      throw new Error("Session is not connected");
    }
    await client.current.disconnect({
      topic: session.topic,
      reason: ERROR.USER_DISCONNECTED.format(),
    });
    console.log("disconnected")
  };

  /**
   * @function onSessionConnected
   * @param _session
   * Runs when WalletConnect session is created. Called in `connect`.
   */
  const onSessionConnected = async (_session: SessionTypes.Settled) => {
    setSession(_session)
    onSessionUpdate(_session.state.accounts, _session.permissions.blockchain.chains);

    // Make RPC request
    const success: boolean = await client.current!.request({
      topic: _session.topic,
      chainId: "xrpl:2",
      request: {
        method: "createTrustLine",
        params: [
          issuerAddress,
          "AUR"
        ],
      },
    });

    // If success is true, then the trust line was created
    if (success) {
      // Display modal for token issuance
      setShowTransferModal(true)
      setTransferStage("OUTBOUND_TOKEN_ISSUANCE")
      setTransferModalBody(
        <>
          <p>
            Issue precisely {transferAmount} {getStablecoinSymbol(chainId!)} from the issuing account to the receiving account.
          </p>
          <div>
            From: <code>{issuerAddress}</code><br/>
            To:   <code>{receiverAddress}</code>
          </div>
          <p className="mt-3">
            We recommend you use <a href="https://graph.trustline.co" target="blank">XRPL Composer</a> to issue the tokens from the <i>Validate</i> tab.
          </p>
        </>
      )
    } else {
      // TODO: Handle request failure.
      console.error("Session request failed.")
    }

  };

  const onSessionUpdate = async (accounts: string[], chains: string[]) => {
    console.log("accounts", accounts)
    console.log("chains", chains)
  };

  /**
   * @function openOutboundTransferModal
   * Opens the transfer modal at the current stage
   */
  const openOutboundTransferModal = async () => {
    switch (transferStage) {
      case "OUTBOUND_PENDING":
        await prepareTransfer()
        break;
      case "OUTBOUND_IN_PROGRESS":
        await verifyIssuance()
        break;
      default:
        await prepareTransfer()
        break;
    }
  }

  /**
   * @function openInboundTransferModal
   * Opens the transfer modal at the current stage
   */
     const openInboundTransferModal = async () => {
      switch (transferStage) {
        case "INBOUND_REDEMPTION_RESERVATION":
          await prepareRedemption()
          break;
        case "INBOUND_REDEMPTION_TRANSACTION":
          await requestXrplRedemptionTransaction()
          break;
        default:
          await prepareRedemption()
          break;
      }
    }

  /**
   * @function getStageReadableName
   * Returns a human-readable string for the stage
   */
  const getStageReadableName = () => {
    switch (transferStage) {
      case "OUTBOUND_PERMIT":
        return "Outbound Transfer Approval"
      case "OUTBOUND_PENDING":
        return "Outbound Transfer Pending"
      case "OUTBOUND_IN_PROGRESS":
        return "Outbound Transfer In-Progress"
      case "OUTBOUND_COMPLETE":
        return "Outbound Transfer Complete"
      case "INBOUND_REDEMPTION_RESERVATION":
        return "Inbound Transfer Reservation"
      case "INBOUND_REDEMPTION_TRANSACTION":
        return "Inbound Transfer Transaction"
      default:
        return "Loading..."
    }
  }

  /**
   * @function prepareTransfer
   * Creates Bridge allowance and funds issuing account.
   */
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
        const address = json.addresses[0].addressDetails.address;
        setReceiverAddress(address)

        if (library && account) {
          const _transfer = new solaris.Transfer({
            direction: {
              source: "LOCAL",
              destination: "XRPL_TESTNET"
            },
            amount: BigNumber.from(transferAmount).mul(WAD),
            tokenAddress: getStablecoinAddress(chainId!),
            bridgeAddress: BRIDGE,
            provider: library,
            signer: library.getSigner() as any
          })
          setTransfer(_transfer)
          setTransferData({
            stage: "OUTBOUND_PERMIT",
            amount: transferAmount.toString()
          })

          // First check the allowance
          const stablecoin = new Contract(getStablecoinAddress(chainId!), INTERFACES[getStablecoinAddress(chainId!)].abi, library.getSigner())
          const allowance = await stablecoin.allowance(account, BRIDGE)

          if (Number(utils.formatEther(allowance)) < Number(transferAmount)) {
            setTransferStage("OUTBOUND_PERMIT")
            setTransferModalBody(`Permit the Bridge contract to spend your ${getStablecoinSymbol(chainId!)} for the transfer.`)
            let data = await _transfer.approve()
            const transactionObject = {
              to: getStablecoinAddress(chainId!),
              from: account,
              data
            };
            const result = await web3.eth.sendTransaction((transactionObject as any))
            setTransferModalBody(`Bridge contract allowance created successfully.`)
            ctx.updateTransactions(result);
          }
          setTransferStage("OUTBOUND_PENDING")
          setTransferModalBody(
            <>
              <p>
                The <a href="https://graph.trustline.co/" target="blank">XRPL Composer</a> app is recommended for creating a new issuing account.
              </p>
              <p>To get started, go to <i>Build</i> and create a new node under <i>Actions</i>. Provide an account identifier and enable the default ripple flag. Upon creation, select the new node. Copy the address under <code>account.address</code> below.</p>
            </>
          )
        }
      }
    } catch (error) {
      setError(error);
      setLoading(false)
      setShowTransferModal(false)
    }
  }

  /**
   * @function initiateTransfer
   * Initiates the transfer after approval.
   */
  const initiateTransfer = async () => {
    try {
      if (library) {
        setTransferInProgress(true)
        let data = await transfer!.createIssuer(issuerAddress)
        const transactionObject = {
          to: BRIDGE,
          from: account,
          data
        };
        const result = await web3.eth.sendTransaction((transactionObject as any))
        ctx.updateTransactions(result);
        setTransferData({
          stage: "OUTBOUND_IN_PROGRESS",
          issuerAddress: issuerAddress,
          ...transferData
        })
        setTransferStage("OUTBOUND_IN_PROGRESS")
        setTransferModalBody(
          <>
            <Alert variant="info">
              If you used XRPL Composer in the last step, you do not need to use the transaction sender tool.
            </Alert>
            <p>Use the <a href="https://xrpl.org/tx-sender.html" target="blank">Transaction Sender</a> to fund the account with the base reserve. Enter <code>{issuerAddress}</code> as the destination address. Enter <code>10000012</code> drops of XRP (10 XRP for the account reserve and 12 drops for the transaction fee). Press "Send XRP Payment" to activate the issuing account.</p>
            <p>The next step will display a QR code. You can use any wallet that supports the WalletConnect protocol. The <a href="https://trustline.co" target="blank">Trustline</a> app is recommended. From the home screen, go to the <i>Wallet</i> tab, press <i>AUR</i>, then press <i>Inbound Transfer</i> at the bottom.</p>
          </>
        )
      }
    } catch (error) {
      setTransferInProgress(false)
      setLoading(false)
      setShowTransferModal(false)
      console.error(error)
    }
  }

  /**
   * @function createTrustLine
   * Creates a trust line with the issuing address via WalletConnect
   */
  const createTrustLine = async () => {
    setShowTransferModal(false)
    setLoading(false)
    if (typeof client.current === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }

    connect();
  }

  /**
   * @function verifyIssuance
   * Called after issuance transaction / blackholing issuer account
   */
    const verifyIssuance = async () => {
    try {
      if (library) {
        await disconnect()
        setLoading(true)
        const stateConnector = new Contract(STATE_CONNECTOR, INTERFACES[STATE_CONNECTOR].abi, library.getSigner())
        let result = await stateConnector.setFinality(true);
        await result.wait()
        setTransferModalBody(`Verifying issuance, please wait...`)
        let data = await transfer!.verifyIssuance(transactionID, issuerAddress)
        const transactionObject = {
          to: BRIDGE,
          from: account,
          data
        };
        result = await web3.eth.sendTransaction((transactionObject as any))
        ctx.updateTransactions(result);
        setTransferData(null)
        setTransferStage("OUTBOUND_COMPLETED")
        setTransferModalBody(
          <div className="d-flex justify-content-center align-items-center my-5">
            Done.
          </div>
        )
      }
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  /**
   * @function prepareRedemption
   * Prompts the user for the issuing address
   */
  const prepareRedemption = async () => {
    try {
      setLoading(true)
      const _transfer = new solaris.Transfer({
        direction: {
          source: "XRPL",
          destination: "FLARE"
        },
        tokenAddress: getStablecoinAddress(chainId!),
        bridgeAddress: BRIDGE,
        provider: library,
        signer: library!.getSigner() as any
      })
      setTransfer(_transfer)
      setTransferStage("INBOUND_REDEMPTION_RESERVATION")
      setTransferModalBody(
        <div className="d-flex flex-column justify-content-center align-items-center">
          {
            verifiedIssuers.length ? (
              <>
                <p>First, please enter a verified issuer.</p>
                <ul>
                  {verifiedIssuers.map((issuer: string, index: number) => <li key={index}>{issuer}</li>)}
                </ul>
              </>
            ) : (
              <Alert variant="danger">
                There are no verified issuers yet. To create a verified issuer, please complete the outbound transfer flow.
              </Alert>
            )
          }
        </div>
      )
      setShowTransferModal(true);
    } catch (error) {
      console.log("error", error)
    }
    setLoading(false)
  }

  /**
   * @function createRedemptionReservation
   * Creates a window for the initiator to prove a redemption transaction
   */
  const createRedemptionReservation = async () => {
    try {
      setLoading(true)
      let data = await transfer!.createRedemptionReservation(account!, issuerAddress)
      const transactionObject = {
        to: BRIDGE,
        from: account,
        data
      };
      const result = await web3.eth.sendTransaction((transactionObject as any))
      ctx.updateTransactions(result);
      setTransferData({
        stage: "INBOUND_REDEMPTION_TRANSACTION",
        reservation: {
          source: account!,
          issuer: issuerAddress
        }
      })
      setTransferStage("INBOUND_REDEMPTION_TRANSACTION")
    } catch (error) {
      console.log("error", error)
    }
    setLoading(false)
  }

  /**
   * @function requestXrplRedemptionTransaction
   * Displays info about the QR code on the next screen
   */
  const requestXrplRedemptionTransaction = async () => {
    try {
      setShowTransferModal(true)
      setTransferStage("INBOUND_REDEMPTION_TRANSACTION")
      console.log("Testing XRPL redemption transaction")
      setTransferModalBody(
        <div className="d-flex flex-column justify-content-center align-items-center my-5">
          <p>The next screen will display a QR code that establishes a WalletConnect session with a supported smartphone wallet.</p>
          <p>To scan the QR code from the <a href="https://trustline.co" target="blank">Trustline</a> wallet, go to the Wallet tab → AUR → Outbound Transfer. Enter the amount, and scan the code on the next dialog screen.</p>
          <button className="btn btn-primary my-4" onClick={() => { console.log("test") }}>Continue</button>
        </div>
      )
    } catch (error) {
      console.log("error", error)
    }
  }

  const completeRedemption = async () => {}

  return (
    <>
      {
        <Modal show={showTransferModal} onHide={handleCloseTransferModal}>
          <Modal.Header>
            <Modal.Title>{getStageReadableName()}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ minHeight: 150 }}>
            {/* TODO: can we put the modal body text in the elements below? */}
            {transferModalBody}
            {/* Forms */}
            {
              transferStage === "OUTBOUND_PERMIT" && (
                <Form className="py-3">
                  <Form.Group className="mb-3">
                    <Form.Label>Bridge Address</Form.Label>
                    <Form.Control type="text" readOnly value={BRIDGE} />
                    <Form.Text className="text-muted">
                      This is the address of the Bridge contract.
                    </Form.Text>
                  </Form.Group>
                </Form>
              )
            }
            {
              transferStage === "OUTBOUND_PENDING" && (
                <Form className="py-3">
                  <Form.Group className="mb-3">
                    <Form.Label>Issuing Address</Form.Label>
                    <Form.Control type="text" placeholder="Enter issuing address" onChange={(event: any) => { setIssuerAddress(event.target.value) }} />
                    <Form.Text className="text-muted">
                      This is an XRP Ledger account that you control.
                    </Form.Text>
                  </Form.Group>
                  <Container className="mt-3">
                    <Row>
                      <Col />
                      <Col className="d-grid">
                        <Button variant="primary" onClick={initiateTransfer} disabled={transferInProgress}>
                          { transferInProgress ? "Waiting..." : "Submit" }
                        </Button>
                      </Col>
                      <Col />
                    </Row>
                  </Container>
                </Form>
              )
            }
            {
              transferStage === "OUTBOUND_IN_PROGRESS" && (
                <Container className="mt-4">
                  <Row>
                    <Col />
                    <Col className="d-grid">
                      <Button variant="primary" onClick={createTrustLine}>
                        Done
                      </Button>
                    </Col>
                    <Col />
                  </Row>
                </Container>
              )
            }
            {
              transferStage === "OUTBOUND_TOKEN_ISSUANCE" && (
                <Form className="py-3">
                  <Form.Group className="mb-3">
                    <Form.Label>Transaction ID</Form.Label>
                    <Form.Control type="text" placeholder="Enter transaction ID" onChange={(event: any) => { setTransactionID(event.target.value) }} />
                    <Form.Text className="text-muted">
                      The transaction ID of the issuance.
                    </Form.Text>
                  </Form.Group>
                  <Container className="mt-4">
                    <Row>
                      <Col />
                      <Col className="d-grid">
                        <Button variant="primary" onClick={verifyIssuance}>
                          Done
                        </Button>
                      </Col>
                      <Col />
                    </Row>
                  </Container>
                </Form>
              )
            }
            {
              transferStage === "INBOUND_REDEMPTION_RESERVATION" && (
                <Form className="py-3">
                  <Form.Group className="mb-3">
                  <Form.Label>Issuer Address</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Issuing account address (temporary)"
                      onChange={(event: any) => { setIssuerAddress(event.target.value) }}
                    />
                    <Form.Text className="text-muted">
                      The address of an issuing account.
                    </Form.Text>
                  </Form.Group>
                  <Container className="mt-3">
                    <Row>
                      <Col />
                      <Col className="d-grid">
                        <Button variant="primary" disabled={verifiedIssuers.length === 0 || transferInProgress} onClick={createRedemptionReservation}>
                          { transferInProgress ? "Waiting..." : "Submit" }
                        </Button>
                      </Col>
                      <Col />
                    </Row>
                  </Container>
                </Form>
              )
            }
            {
              transferStage === "INBOUND_REDEMPTION_TRANSACTION" && (
                <Form className="py-3">
                  <Form.Group className="mb-3">
                  <Form.Label>Transaction ID</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter transaction ID"
                      onChange={(event: any) => { console.log(event.target.value) }}
                    />
                    <Form.Text className="text-muted">
                      The redemption transaction ID.
                    </Form.Text>
                  </Form.Group>
                  <Container className="mt-3">
                    <Row>
                      <Col />
                      <Col className="d-grid">
                        <Button variant="primary" disabled={transferInProgress} onClick={() => { console.log("not implemented") }}>
                          { transferInProgress ? "Waiting..." : "Submit" }
                        </Button>
                      </Col>
                      <Col />
                    </Row>
                  </Container>
                </Form>
              )
            }
          </Modal.Body>
        </Modal>
      }
      <header className="pt-2">
        <h1>Network Transfers</h1>
        {active && <Info />}
      </header>
      <div className="text-secondary d-flex mb-3">
        <div className="d-flex align-items-center me-2">
          <span className="fa fa-info-circle"></span>
        </div>
        <p className="mb-0">This feature uses the <a href="https://walletconnect.com" target="blank">WalletConnect</a> and <a href="https://paystring.org/" target="blank">PayString</a> protocols to transfer {getStablecoinName(chainId!)} between Songbird and the XRP Ledger networks via <a href="https://trustline.co/solaris" target="blank">Solaris</a>. Only recommended for advanced users.</p>
      </div>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <h4 className="text-center">Send {getStablecoinName(chainId!)}</h4>
        <Activity active={active} activity={ActivityType.Transfer} error={error}>
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <label className="form-label">Amount</label>
              <div className="input-group">
                <input type="number" min="0.000000000000000000" placeholder="0.000000000000000000" className="form-control" value={transferAmount ? transferAmount : ""} onChange={onTransferAmountChange} />
                <span className="input-group-text font-monospace">{getStablecoinSymbol(chainId!)}</span>
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
                onClick={openOutboundTransferModal}
                disabled={transferAmount === 0 || username === "" || domain === "" || loading}
              >
                {loading ? <i className="fa fa-spin fa-spinner" /> : "Confirm"}
              </button>
            </div>
          </div>
        </Activity>
      </section>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <h4 className="text-center">Receive {getStablecoinName(chainId!)}</h4>
        <Activity active={active} activity={ActivityType.Transfer} error={null}>
          <div className="row">
            <div className="col-md-8 offset-md-2 my-4 d-grid">
              <button
                className="btn btn-primary btn-lg"
                onClick={openInboundTransferModal}
              ><i className="fa fa-qrcode"/> Press for QR Code</button>
            </div>
          </div>
        </Activity>
      </section>
    </>
  )
}