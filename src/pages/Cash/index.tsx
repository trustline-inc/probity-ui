import axios from "axios";
import numbro from "numbro";
import classnames from "classnames"
import { Link, Route, Switch, useLocation, useHistory } from "react-router-dom"
import React from "react";
import { Alert, Button, Card, Modal, Nav } from "react-bootstrap"
import { Helmet } from "react-helmet-async";
import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
  PlaidLinkOnSuccessMetadata,
} from "react-plaid-link";

enum TransactionType {
  Deposit, Withdrawal
}

function Cash({ user, auth }: any) {
  const [linkToken, setLinkToken] = React.useState(null);
  const [externalAccounts, setExternalAccounts] = React.useState([]);
  const [selectedAccount, setSelectedAccount] = React.useState<any>(null);
  const [externalAccountsLoading, setExternalAccountsLoading] = React.useState(true);
  const [transactionInProgress, setTransactionInProgress] = React.useState(false);
  const [transactionsLoading, setTransactionsLoading] = React.useState(true);
  const [, setBalance] = React.useState(null);
  const [transactions, setTransactions] = React.useState([]);
  const [amount, setAmount] = React.useState(0);
  const [show, setShow] = React.useState(false);
  const [type, setType] = React.useState<TransactionType>(TransactionType.Deposit);
  const location = useLocation()
  const history = useHistory()

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value)
  }

  const handleClose = () => {
    setAmount(0);
    setSelectedAccount(null);
    history.push("/cash-management")
    setShow(false);
  }
  const handleShow = (txType: TransactionType) => {
    if (txType === 0) history.push(`/cash-management/deposit/ach`)
    else history.push(`/cash-management/withdrawal`)
    setType(txType)
    setShow(true);
  }

  const createExternalAccount = React.useCallback(async (accountId: string) => {
    await axios(`http://localhost:8080/v1/accounts/${user?.ledger_account_id}/external_accounts`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${auth.token}`
      },
      data: {
        accountId
      },
    });
  }, [auth, user])

  const createPlaidAccessToken = React.useCallback(async (publicToken) => {
    await axios({
      url: `http://localhost:8080/v1/accounts/${user?.ledger_account_id}/plaid/access_token`,
      method: "POST",
      headers: {
        "Authorization": `Bearer ${auth.token}`
      },
      data: {
        publicToken
      }
    })
  }, [auth, user])

  const getExternalAccounts = React.useCallback(async () => {
    const response = await axios({
      url: `http://localhost:8080/v1/accounts/${user?.ledger_account_id}/external_accounts`,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${auth.token}`
      },
    })
    setExternalAccounts(response.data.items)
    if (response.data.items.length) setSelectedAccount(response.data.items[0])
  }, [auth, user])

  /**
   * Log and save metadata and exchange public token
   */
  const onSuccess = React.useCallback<PlaidLinkOnSuccess>(
    async (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
      if (!metadata.accounts.length) {
        return alert("Unable to link account.")
      }
      setExternalAccountsLoading(true)
      await createPlaidAccessToken(public_token)
      await createExternalAccount(metadata.accounts[0].id)
      await getExternalAccounts()
      setExternalAccountsLoading(false)
    },
    [createPlaidAccessToken, createExternalAccount, getExternalAccounts, setExternalAccountsLoading],
  );

  const getTransactions = React.useCallback(async () => {
    setTransactionsLoading(true)
    const response = await axios(`http://localhost:8080/v1/accounts/${user?.ledger_account_id}/transactions`, {
      headers: {
        "Authorization": `Bearer ${auth.token}`
      },
      method: "GET"
    })
    setTransactions(response.data.items)
    setTransactionsLoading(false)
  }, [auth, user])

  const getAccountBalance = React.useCallback(async () => {
    const response = await axios(`http://localhost:8080/v1/accounts/${user?.ledger_account_id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${auth.token}`
      },
    })
    setBalance(response.data.balances.available_balance)
  }, [auth, user])

  const deposit = async () => {
    try {
      setTransactionInProgress(true)
      await axios(`http://localhost:8080/v1/accounts/${user?.ledger_account_id}/deposits`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${auth.token}`
        },
        data: {
          amount,
          external_account_id: selectedAccount.id
        }
      })
      alert("Deposit successfully initiated.")
    } catch (error) {
      console.log(error)
      alert("There was an error.")
    }
    setTransactionInProgress(false)
  }

  const withdrawal = async () => {
    try {
      setTransactionInProgress(true)
      await axios(`http://localhost:8080/v1/accounts/${user?.ledger_account_id}/withdrawals`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${auth.token}`
        },
        data: {
          amount,
          external_account_id: selectedAccount.id
        }
      })
      alert("Withdraw successfully initiated.")
    } catch (error) {
      alert("There was an error.")
    }
    setTransactionInProgress(false)
  }

  const removeExternalAccount = async (id: any) => {
    await axios({
      url: `http://localhost:8080/v1/accounts/${user?.ledger_account_id}/external_accounts/${id}`,
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${auth.token}`
      },
    })
    await getExternalAccounts()
  }

  const transfer = async () => {
    if (type === TransactionType.Deposit) await deposit()
    if (type === TransactionType.Withdrawal) await withdrawal()
    await getTransactions()
    await getAccountBalance()
    setShow(false)
  }

  const getLinkToken = React.useCallback(async () => {
    const response = await axios({
      url: `http://localhost:8080/v1/accounts/${user?.ledger_account_id}/plaid/link_token`,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${auth.token}`
      },
    })
    setLinkToken(response.data.link_token)
  }, [auth, user])

  /**
   * @function getTransactionType
   * @param {any} transaction
   * @returns {string}
   * Determine the transaction type by the ledger entries
   */
  const getTransactionType = (transaction: any) => {
    const entries = transaction.ledger_entries;

    if (entries.length === 2) {
      if (entries[0].ledger_account_id === user?.ledger_account_id) {
        if (entries[0].direction === "credit") {
          return "Deposit"
        } else if (entries[0].direction === "debit") {
          return "Withdrawal"
        }
      }
    }
    return "Unknown"
  }

  // Load data
  React.useEffect(() => {
    (async () => {
      setExternalAccountsLoading(true)
      await getLinkToken()
      await getExternalAccounts()
      await getAccountBalance()
      await getTransactions()
      setExternalAccountsLoading(false)
    })()
  }, [getAccountBalance, getLinkToken, getTransactions, getExternalAccounts])

  // The usePlaidLink hook manages Plaid Link creation
  // It does not return a destroy function;
  // instead, on unmount it automatically destroys the Link instance
  const config: PlaidLinkOptions = {
    onSuccess: onSuccess,
    onExit: (err, metadata) => {},
    onEvent: (eventName, metadata) => {},
    token: linkToken,
  };
  const { open, ready } = usePlaidLink(config);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create {TransactionType[type]}</Modal.Title>
        </Modal.Header>
        {
          type === TransactionType.Deposit && (
            <Modal.Header >
              <Nav variant="pills" defaultActiveKey="ach">
                <Nav.Item>
                  <Nav.Link as={Link} to={`/cash-management/deposit/ach`} eventKey="ach">Online deposit</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to={`/cash-management/deposit/wire`} eventKey="wire">Wire transfer</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Header>
          )
        }
        <Modal.Body>
          <div className="mb-3">
            {
              type === TransactionType.Deposit ? (
                <>
                  <Switch>
                    <Route path={`/cash-management/deposit/ach`}>
                      <label htmlFor="depositFrom" className="form-label">Deposit from</label>
                      <select className="form-select" defaultValue={externalAccounts[0]}>
                        {externalAccounts.map((externalAccount: any, index: number) => {
                          return (
                            <option onSelect={() => setSelectedAccount(externalAccount)} key={index}>
                              {externalAccount.account_type.charAt(0).toUpperCase() + externalAccount.account_type.slice(1)} {externalAccount.account_details[0].account_number.replace(/.(?=.{4,}$)/g, "*")}
                            </option>
                          )
                        })}
                      </select>
                      <div className="my-3">
                        <label htmlFor="amount" className="form-label">Amount</label>
                        <input type="number" className="form-control" id="amount" onChange={(event) => setAmount(Number(event.target.value))} placeholder="0.00" />
                      </div>
                    </Route>
                    <Route path={`/cash-management/deposit/wire`}>
                      <h5>Wire transfer instructions</h5>
                      <p>To add funds, send a wire from your bank to Linqto using the details below. We'll email you when the transfer is complete.</p>
                      <Alert variant="primary">Make sure the name on your bank account exactly matches your name on Linqto.</Alert>
                      <div className="mb-3">
                        <label className="form-label">Recipient name</label>
                        <div className="d-flex">
                          <input readOnly className="form-control-plaintext text-muted" value="Linqto Inc." />
                          <button onClick={() => copyToClipboard("Linqto Inc.")} className="btn btn-link" type="button"><i className="fas fa-copy" /></button>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Recipient address</label>
                        <div className="d-flex">
                          <input readOnly className="form-control-plaintext text-muted" value="101 Metro Drive, Suite 335, San Jose, CA 95110" />
                          <button onClick={() => copyToClipboard("101 Metro Drive, Suite 335, San Jose, CA 95110")} className="btn btn-link" type="button"><i className="fas fa-copy" /></button>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Account number</label>
                        <div className="d-flex">
                          <input readOnly className="form-control-plaintext text-muted" value="############" />
                          <button onClick={() => copyToClipboard("############")} className="btn btn-link" type="button"><i className="fas fa-copy" /></button>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Routing number</label>
                        <div className="d-flex">
                          <input readOnly className="form-control-plaintext text-muted" value="#########" />
                          <button onClick={() => copyToClipboard("#########")} className="btn btn-link" type="button"><i className="fas fa-copy" /></button>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Bank name</label>
                        <div className="d-flex">
                          <input readOnly className="form-control-plaintext text-muted" value="JPMorgan Chase Bank National Association" />
                          <button onClick={() => copyToClipboard("JPMorgan Chase Bank National Association")} className="btn btn-link" type="button"><i className="fas fa-copy" /></button>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Bank address</label>
                        <div className="d-flex">
                          <input readOnly className="form-control-plaintext text-muted" value="270 Park Avenue, 43rd floor New York, NY 10017" />
                          <button onClick={() => copyToClipboard("270 Park Avenue, 43rd floor New York, NY 10017")} className="btn btn-link" type="button"><i className="fas fa-copy" /></button>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Bank country</label>
                        <div className="d-flex">
                          <input readOnly className="form-control-plaintext text-muted" value="United States" />
                          <button onClick={() => copyToClipboard("United States")} className="btn btn-link" type="button"><i className="fas fa-copy" /></button>
                        </div>
                      </div>
                      <Modal.Footer>
                        <small>Please do not send funds via ACH. An actual wire transfer must be submitted. Funds will usually be credited to your Linqto account on the same day if submitted before 1pm PT. Otherwise, funds will be credited on the next business day.</small>
                      </Modal.Footer>
                    </Route>
                  </Switch>
                </>
              ) : (
                <>
                  <label htmlFor="withdrawTo" className="form-label">Withdraw to</label>
                  <select className="form-select" defaultValue={externalAccounts[0]}>
                    {externalAccounts.map((externalAccount: any, index: number) => {
                      return (
                        <option onSelect={() => setSelectedAccount(externalAccount)} key={index}>
                          {externalAccount.account_type.charAt(0).toUpperCase() + externalAccount.account_type.slice(1)} {externalAccount.account_details[0].account_number.replace(/.(?=.{4,}$)/g, "*")}
                        </option>
                      )
                    })}
                  </select>
                  <div className="my-3">
                    <label htmlFor="amount" className="form-label">Amount</label>
                    <input type="number" className="form-control" id="amount" onChange={(event) => setAmount(Number(event.target.value))} placeholder="0.00" />
                  </div>
                </>
              )
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={transactionInProgress}>
            Cancel
          </Button>
          {
            !(new RegExp(".*/wire")).test(location.pathname) && (
              <Button variant="primary" onClick={transfer} disabled={transactionInProgress}>
                {transactionInProgress && <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>&nbsp;</>}
                Continue
              </Button>
            )
          }
        </Modal.Footer>
      </Modal>
      <Helmet>
        <title>Probity | Manage Cash</title>
      </Helmet>
      <h1>Cash Account</h1>
      <section className="border rounded p-5 mb-4 shadow-sm bg-white">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between mb-2 align-items-baseline">
              <label className="form-label">Transaction History</label>
              <div>
                <Button className="mx-2" size="sm" variant="outline-primary" onClick={() => handleShow(TransactionType.Deposit)}>Deposit</Button>
                <Button size="sm" variant="outline-primary" onClick={() => handleShow(TransactionType.Withdrawal)}>Withdraw</Button>
              </div>
            </div>
            {
              transactions.length && !transactionsLoading ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Type</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx: any, index: number) => {
                      return (
                        <tr key={index}>
                          <td>{new Date(tx.created_at).toLocaleString()}</td>
                          <td>{getTransactionType(tx)}</td>
                          <td>${numbro(tx.ledger_entries[0].amount / 100).format({ mantissa: 2, thousandSeparated: true })}</td>
                          <td>{tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              ) : transactionsLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="d-flex justify-content-center py-5 border">
                  <span>No transactions to display</span>
                </div>
              )
            }
          </div>
        </div>
      </section>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <div className={classnames(["row", externalAccounts.length ? "" : "mb-4"])}>
          <div className="col-12">
            <label className="form-label">
              Payment Methods<br/>
              <small className="form-text text-muted">
                Link a bank account to fund your investments
              </small>
            </label>
          </div>
        </div>
        <div>
        {
          externalAccountsLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <pre>
                {externalAccounts.map((externalAccount: any, index) => {
                  return (
                    <Card key={index} className="my-2">
                      <Card.Body>
                        <div className="d-flex flex-row justify-content-between">
                          <div>
                            {externalAccount.routing_details[0].bank_name}<br/>
                            {externalAccount.account_type.charAt(0).toUpperCase() + externalAccount.account_type.slice(1)} {externalAccount.account_details[0].account_number.replace(/.(?=.{4,}$)/g, "*")}<br/>
                          </div>
                          <button className="btn btn-outline-secondary btn-sm" onClick={() => removeExternalAccount(externalAccount.id)}>Remove</button>
                        </div>
                      </Card.Body>
                    </Card>
                  )
                })}
              </pre>
              <button className="btn btn-primary float-end" disabled={!ready} onClick={() => open()}>Add Bank Account</button>
            </div>
          )
        }
        </div>
      </section>
    </>
  );
}

export default Cash;
