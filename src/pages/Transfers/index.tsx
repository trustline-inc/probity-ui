import React, { useContext } from "react";
import axios from "axios"
import { NavLink, useLocation } from "react-router-dom";
import { Alert, Button, Form, Modal, Row, Col, Container } from "react-bootstrap"
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import Web3 from "web3"
import * as solaris from "@trustline-inc/solaris"
import Info from '../../components/Info';
import { BigNumber, Contract, utils } from "ethers";
import {
  PROJECT_ID,
  DEFAULT_APP_METADATA,
  DEFAULT_LOGGER,
  DEFAULT_METHODS,
  DEFAULT_RELAY_PROVIDER,
  CONTRACTS,
  WAD,
} from '../../constants';
import EventContext from "../../contexts/TransactionContext"
import { Activity as ActivityType } from "../../types";
import Activity from "../../containers/Activity";
import Client from "@walletconnect/sign-client";
import { PairingTypes, SessionTypes } from "@walletconnect/types";

export default function Transfers() {
  const location = useLocation();
  const storage = localStorage.getItem('probity-transfer')
  const [transfer, setTransfer] = React.useState<any>()
  const [transferData, setTransferData] = React.useState<any>(
    storage ? JSON.parse(storage) : null
  );
  const [activity, setActivity] = React.useState<ActivityType|null>(null);
  const [verifiedIssuers, setVerifiedIssuers] = React.useState<any>([])
  const [session, setSession] = React.useState<any|undefined>()
  const [pairings, setPairings] = React.useState<any|string[]|undefined>()
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
  const [usePayStringProtocol, setUsePayStringProtocol] = React.useState(true)
  const [xrpAddress, setXrpAddress] = React.useState("")
  const { account, active, library, chainId } = useWeb3React<Web3Provider>()
  const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:9650/ext/bc/C/rpc");
  const [client, setClient] = React.useState<Client>()
  const ctx = useContext(EventContext)

  // Transfer modal
  const handleCloseTransferModal = () => { setShowTransferModal(false); setTransferInProgress(false) };

  // Set activity by the path
  React.useEffect(() => {
    if (location.pathname === "/transfer/outbound") setActivity(ActivityType.OutboundTransfer);
    if (location.pathname === "/transfer/inbound") setActivity(ActivityType.InboundTransfer);
  }, [location])

  /**
   * Initializes the WalletConnect client and subscribe to events
   */
  React.useEffect(() => {
    (async () => {
      try {
        if (!client) {
          console.log("Intializing client")
          // const _client = await Client.init({
          //   projectId: "<YOUR_PROJECT_ID>",
          //   metadata: {
          //     name: "Example Dapp",
          //     description: "Example Dapp",
          //     url: "#",
          //     icons: ["https://walletconnect.com/walletconnect-logo.png"],
          //   },
          // });

          // _client.on("session_event", (args: any) => {
          //   console.log(args)
          //   // Handle session events, such as "chainChanged", "accountsChanged", etc.
          // });
          
          // _client.on("session_update", ({ topic, params }: any) => {
          //   const { namespaces } = params;
          //   const _session = _client.session.get(topic);
          //   // Overwrite the `namespaces` of the existing session with the incoming one.
          //   const updatedSession = { ..._session, namespaces };
          //   // Integrate the updated session state into your dapp state.
          //   onSessionUpdate(updatedSession);
          // });
          
          // _client.on("session_delete", () => {
          //   // Session was deleted -> reset the dapp state, clean up from user session, etc.
          // });

          // setClient(_client)
        }
      } catch (error) {
        console.log("connection error")
        alert(JSON.stringify(error))
        console.error(error)
      }
    })()

    return () => {
      console.log("cleaning up")
      if (client && session) {
        console.log("attempting disconnect")
        // client.disconnect({
        //   topic: (session as any).topic,
        //   reason: ERROR.USER_DISCONNECTED.format(),
        // });
      }
    }
  }, [session, pairings, client])

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
      // try {
      //   const solaris = new Contract(CONTRACTS[chainId!].BRIDGE.address, CONTRACTS[chainId!].BRIDGE.abi, library)
      //   const _verifiedIssuers = await solaris.getVerifiedIssuers()
      //   setVerifiedIssuers(_verifiedIssuers)
      // } catch (error) {
      //   console.error(error)
      // }
    })()
  }, [library])

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
    let domain = event.target.value
    if (process.env.NODE_ENV === "production") {
      domain = domain.replace(/[^a-zA-Z\d].[^a-zA-Z]/ig, "");
    }
    setDomain(domain);
  }

  const onXrpAddressChange = (event: any) => {
    let address = event.target.value
    setXrpAddress(address)
  }

  /**
   * @function connect
   * @param pairing 
   * Connects to relay server and awaits for session establishment.
   */
  const connect = async (pairing?: { topic: string }) => {
    console.log("Connecting to relay server")
    if (typeof client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }

    try {
      const methods: string[] = DEFAULT_METHODS.flat()
      const requiredNamespaces = {
        chains: ["xrpl:1, xrpl:2"],
        methods,
        events: []
      }
      const session = await client.connect({
        requiredNamespaces: {
          "xrpl": requiredNamespaces
        }
        // metadata: getAppMetadata() || DEFAULT_APP_METADATA,
        // pairing,
        // permissions: {
        //   blockchain: {
        //     chains: ["xrpl:2"],
        //   },
        //   jsonrpc: {
        //     methods,
        //   },
        // },
      });
      console.log("session", session)

      onSessionConnected(session);
    } catch (e) {
      // ignore rejection
      console.log(e)
    }

    // close modal in case it was open
    // QRCodeModal.close();
  };

  /**
   * @function disconnect
   * Ends session and disconnects from the relay server.
   */
  const disconnect = async () => {
    if (typeof client === "undefined") {
      throw new Error("WalletConnect is not initialized");
    }
    if (typeof session === "undefined") {
      throw new Error("Session is not connected");
    }
    // await client.disconnect({
    //   topic: (session as any).topic,
    //   reason: ERROR.USER_DISCONNECTED.format(),
    // });
    console.log("disconnected")
  };

  /**
   * @function onSessionConnected
   * @param _session
   * Runs when WalletConnect session is created. Called in `connect`.
   */
  const onSessionConnected = async (_session: any) => {
    console.log("Connected to session", _session)
    setSession(_session)
    onSessionUpdate(_session);

    // Make RPC request
    const success = await client?.request({
      topic: _session.topic,
      chainId: "xrpl:2",
      request: {
        method: "createTrustLine",
        params: [
          issuerAddress,
          "USD"
        ],
      },
    });

    // If success is true, then the trust line was created
    if (success) {
      // Display modal for token issuance
      setShowTransferModal(true)
      setTransferStage("OUTBOUND_TOKEN_ISSUANCE")
      setTransferData({
        ...transferData,
        stage: "OUTBOUND_TOKEN_ISSUANCE"
      })
      setTransferModalBody(
        <>
          <p>
            Issue precisely {transferAmount} USD from the issuing account to the receiving account.
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

  const onSessionUpdate = async (sessionUpdate: any) => {
    console.log("sessionUpdate", sessionUpdate)
  };

  /**
   * @function openOutboundTransferModal
   * Opens the transfer modal at the current stage
   */
  const openOutboundTransferModal = async () => {
    switch (transferStage) {
      case "OUTBOUND_PENDING":
        await permitBridgeSpending()
        break;
      case "OUTBOUND_IN_PROGRESS":
        await createTrustLine()
        break;
      default:
        await permitBridgeSpending()
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
      case "OUTBOUND_TOKEN_ISSUANCE":
        return "Token Issuance"
      case "OUTBOUND_COMPLETED":
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
   * @function permitBridgeSpending
   * Creates Bridge ERC20 allowance
   */
  const permitBridgeSpending = async () => {
    try {
      setTransferInProgress(true)
      setShowTransferModal(true)
      setReceiverAddress(xrpAddress)

      if (library && account) {
        console.log("Creating Transfer object")
        const _transfer = new solaris.Transfer({
          direction: {
            source: "LOCAL",
            destination: "XRPL_TESTNET"
          },
          amount: BigNumber.from(transferAmount).mul(WAD),
          tokenAddress: CONTRACTS[chainId!].USD.address,
          bridgeAddress: CONTRACTS[chainId!].BRIDGE.address,
          provider: library,
          signer: library.getSigner() as any
        })
        setTransfer(_transfer)
        setTransferData({
          stage: "OUTBOUND_PERMIT",
          amount: transferAmount.toString(),
          username
        })

        // First check the allowance
        if (!CONTRACTS[chainId!].BRIDGE.address) {
          setTransferInProgress(false)
          setShowTransferModal(false)
          return alert("Bridge address is not set")
        }
        const stablecoin = new Contract(CONTRACTS[chainId!].USD.address, CONTRACTS[chainId!].USD.abi, library.getSigner())
        const allowance = await stablecoin.allowance(account, CONTRACTS[chainId!].BRIDGE.address)

        if (Number(utils.formatEther(allowance)) < Number(transferAmount)) {
          setTransferStage("OUTBOUND_PERMIT")
          setTransferModalBody(`Permit the Bridge contract to spend your USD for the transfer.`)
          let data = await _transfer.approve()
          const transactionObject = {
            to: CONTRACTS[chainId!].USD.address,
            from: account,
            data
          };
          const result = await web3.eth.sendTransaction((transactionObject as any))
          setTransferModalBody(`Bridge contract allowance created successfully.`)
          ctx.updateTransactions(result);
        }
        setTransferStage("OUTBOUND_PENDING")
        setTransferData({
          ...transferData,
          stage: "OUTBOUND_PENDING"
        })
        setTransferModalBody(
          <>
            <p>
              The <a href="https://graph.trustline.co/" target="blank">XRPL Composer</a> app is recommended for creating a new issuing account.
            </p>
            <p>To get started, go to <i>Build</i> and create a new node under <i>Actions</i>. Provide an account identifier and enable the default ripple flag. Upon creation, select the new account. Copy the address under <code>account.address</code> below.</p>
          </>
        )
      }
    } catch (error) {
      setError(error);
      setTransferInProgress(false)
      setShowTransferModal(false)
    }
  }

  /**
   * @function createIssuer
   * Creates an issuer in the Bridge contract
   */
  const createIssuer = async () => {
    try {
      if (library) {
        setTransferInProgress(true)
        setLoading(true)
        let data = await transfer!.createIssuer(issuerAddress)
        const transactionObject = {
          to: CONTRACTS[chainId!].BRIDGE.address,
          from: account,
          data
        };
        const result = await web3.eth.sendTransaction((transactionObject as any))
        ctx.updateTransactions(result);
        setTransferStage("OUTBOUND_IN_PROGRESS")
        setTransferData({
          ...transferData,
          stage: "OUTBOUND_IN_PROGRESS",
          issuerAddress: issuerAddress
        })
        setTransferModalBody(
          <>
            <p>The next step will display a QR code. You can use any wallet that supports the WalletConnect protocol. The <a href="https://trustline.co" target="blank">Trustline</a> app is recommended. From the home screen, go to the <i>Wallet</i> tab, press <i>USD</i>, then press <i>Inbound Transfer</i> at the bottom.</p>
          </>
        )
      }
    } catch (error) {
      setLoading(false)
      setTransferInProgress(false)
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
    if (typeof client === "undefined") {
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
        setLoading(true)
        const stateConnector = new Contract(CONTRACTS[chainId!].STATE_CONNECTOR.address, CONTRACTS[chainId!].STATE_CONNECTOR.abi, library.getSigner())
        let result = await stateConnector.setFinality(true);
        await result.wait()
        setTransferModalBody(`Verifying issuance, please wait...`)
        let data = await transfer!.verifyIssuance(transactionID, issuerAddress)
        const transactionObject = {
          to: CONTRACTS[chainId!].BRIDGE.address,
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
        tokenAddress: CONTRACTS[chainId!].USD.address,
        bridgeAddress: CONTRACTS[chainId!].BRIDGE.address,
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
        to: CONTRACTS[chainId!].BRIDGE.address,
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
      setTransferModalBody(<></>)
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
      setTransferModalBody(
        <div className="d-flex flex-column justify-content-center align-items-center my-5">
          <p>The next screen will display a QR code that establishes a WalletConnect session with a supported smartphone wallet.</p>
          <p>To scan the QR code from the <a href="https://trustline.co" target="blank">Trustline</a> wallet, go to the Wallet tab → USD → Outbound Transfer. Enter the amount, and scan the code on the next dialog screen.</p>
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
                    <Form.Control type="text" readOnly value={CONTRACTS[chainId!].BRIDGE.address} />
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
                        <Button variant="primary" onClick={createIssuer} disabled={loading}>
                          { loading ? "Waiting..." : "Submit" }
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
                        Continue
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
                        <Button variant="primary" onClick={verifyIssuance} disabled={loading}>
                        { loading ? "Waiting..." : "Done" }
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
                        <Button variant="primary" disabled={verifiedIssuers.length === 0 || loading} onClick={createRedemptionReservation}>
                          { loading ? "Waiting..." : "Submit" }
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
                  <p>Create the redemption transaction to <code>{issuerAddress}</code>.</p>
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
                        <Button variant="primary" disabled={loading} onClick={() => { console.log("not implemented") }}>
                          { loading ? "Waiting..." : "Submit" }
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
      <header>
        <h1>Network Transfers</h1>
        {active && <Info />}
      </header>
      <div className="text-secondary d-flex mb-3">
        <div className="d-flex align-items-center me-2">
          <span className="fa fa-info-circle"></span>
        </div>
        <p className="mb-0">This feature uses the <a href="https://walletconnect.com" target="blank">WalletConnect</a> and <a href="https://paystring.org/" target="blank">PayString</a> protocols to transfer USD between Songbird and the XRP Ledger networks via Trustline's <a href="https://trustline.co/bridge" target="blank">non-custodial bridge</a>. Only recommended for advanced users.</p>
      </div>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        {/* Activity Navigation */}
        <div>
          <ul className="nav nav-pills nav-justified">
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" to={"/transfers/outbound"} onClick={() => setActivity(ActivityType.OutboundTransfer)}>Outbound</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" to={"/transfers/inbound"} onClick={() => setActivity(ActivityType.InboundTransfer)}>Inbound</NavLink>
            </li>
          </ul>
        </div>
        <hr className="mb-4" />
        <Activity active={active} activity={activity} error={error}>
          {
            activity === ActivityType.OutboundTransfer && (
              <>
                <h4 className="text-center">Send USD</h4>
                <div className="row">
                  <div className="col-xl-8 offset-xl-2 col-lg-12 col-md-12">
                    <label className="form-label">Amount</label>
                    <div className="input-group">
                      <input type="number" min="0.000000000000000000" placeholder="0.000000000000000000" className="form-control" value={transferAmount ? transferAmount : ""} onChange={onTransferAmountChange} />
                      <span className="input-group-text font-monospace">USD</span>
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-xl-8 offset-xl-2 col-lg-12 col-md-12">
                    <label className="form-label">XRP Address</label>
                    <div className="input-group mb-3">
                      <input type="text" className="form-control" value={xrpAddress} minLength={25} maxLength={35} onChange={onXrpAddressChange} placeholder="rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh" aria-label="address" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-8 offset-xl-2 col-lg-12 col-md-12 mt-4 d-grid">
                    <button
                      className="btn btn-primary btn-lg mt-4"
                      onClick={openOutboundTransferModal}
                      disabled={transferAmount === 0 || xrpAddress === "" || transferInProgress}
                    >
                      {transferInProgress ? <i className="fa fa-spin fa-spinner" /> : "Confirm"}
                    </button>
                  </div>
                </div>
              </>
            )
          }
          {
            activity === ActivityType.InboundTransfer && (
              <>
                <h4 className="text-center">Receive USD</h4>
                <div className="row">
                  <div className="col-xl-8 offset-xl-2 col-lg-12 col-md-12 my-4 d-grid">
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={openInboundTransferModal}
                    ><i className="fa fa-qrcode"/> Press for QR Code</button>
                  </div>
                </div>
              </>
            )
          }
        </Activity>
      </section>
    </>
  )
}