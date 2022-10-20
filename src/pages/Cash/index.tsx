import axios from "axios";
import classnames from "classnames"
import React from "react";
import { Button, Card, Modal } from "react-bootstrap"
import { Helmet } from "react-helmet";
import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
  PlaidLinkOnSuccessMetadata,
} from "react-plaid-link";

enum TransactionType {
  Deposit, Withdrawal
}

function Cash() {
  const [linkToken, setLinkToken] = React.useState(null);
  const [, setProcessorToken] = React.useState(null);
  const [externalAccounts, setExternalAccounts] = React.useState([]);
  const [selectedAccount, setSelectedAccount] = React.useState<any>(null);
  const [extAccountsLoading, setExtAccountsLoading] = React.useState(true);
  const [txPending, setTxPending] = React.useState(false);
  const [txsLoading, setTxsLoading] = React.useState(false);
  const [balance, setBalance] = React.useState(null);
  const [transactions, setTransactions] = React.useState([]);
  const [amount, setAmount] = React.useState(0);
  const [show, setShow] = React.useState(false);
  const [type, setType] = React.useState<TransactionType>(TransactionType.Deposit);

  const handleClose = () => {
    setAmount(0);
    setSelectedAccount(null);
    setShow(false);
  }
  const handleShow = (txType: TransactionType) => {
    setType(txType)
    setShow(true);
  }

  /**
   * Log and save metadata and exchange public token
   */
  const onSuccess = React.useCallback<PlaidLinkOnSuccess>(
    async (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
      if (!metadata.accounts.length) {
        return alert("Unable to link account.")
      }
      setExtAccountsLoading(true)
      const accountId = metadata.accounts[0].id
      const token = await getProcessorToken(public_token, accountId)
      await getBankDetails(token)
      await getExternalAccounts()
      setExtAccountsLoading(false)
    },
    [],
  );

  const getTransactions = async () => {
    setTxsLoading(true)
    const response = await axios("https://onewypfu44.execute-api.us-east-1.amazonaws.com/dev/accounts/1/transactions", {
      method: "GET",
      headers: {
        "X-API-KEY": "17ubFzR3dj8AAupmXSwYf5bovnKwPjl472eUdjnV"
      },
    })
    setTransactions(response.data.result)
    setTxsLoading(false)
  }

  const getAccountBalance = async () => {
    const response = await axios("https://onewypfu44.execute-api.us-east-1.amazonaws.com/dev/accounts/1/balances", {
      method: "GET",
      headers: {
        "X-API-KEY": "17ubFzR3dj8AAupmXSwYf5bovnKwPjl472eUdjnV"
      },
    })
    setBalance(response.data.result.mt_ledger.USD.available)
  }

  const deposit = async () => {
    try {
      setTxPending(true)
      const response = await axios("https://onewypfu44.execute-api.us-east-1.amazonaws.com/dev/accounts/1/payments", {
        method: "POST",
        headers: {
          "X-API-KEY": "17ubFzR3dj8AAupmXSwYf5bovnKwPjl472eUdjnV"
        },
        data: {
          currency: "USD",
          type: "ach",
          amount,
          externalAccountId: selectedAccount?.sub_id
        }
      })
      console.log(response)
    } catch (error) {
      alert("There was an error.")
    }
    setTxPending(false)
  }

  const withdrawal = async () => {
    try {
      setTxPending(true)
      const response = await axios("https://onewypfu44.execute-api.us-east-1.amazonaws.com/dev/accounts/1/withdrawals", {
        method: "POST",
        headers: {
          "X-API-KEY": "17ubFzR3dj8AAupmXSwYf5bovnKwPjl472eUdjnV"
        },
        data: {
          currency: "USD",
          value: amount
        }
      })
      console.log(response)
    } catch (error) {
      alert("There was an error.")
    }
    setTxPending(false)
  }

  const transfer = async () => {
    if (type === TransactionType.Deposit) await deposit()
    if (type === TransactionType.Withdrawal) await withdrawal()
    await getTransactions()
    await getAccountBalance()
    setShow(false)
  }

  const getBankDetails = async (token: string) => {
    await axios("https://onewypfu44.execute-api.us-east-1.amazonaws.com/dev/accounts/1/bank_details", {
      method: "POST",
      headers: {
        "X-API-KEY": "17ubFzR3dj8AAupmXSwYf5bovnKwPjl472eUdjnV"
      },
      data: {
        name: "John Smith",
        accounts: [{ plaid_processor_token: token }]
      },
    });
  }

  const getProcessorToken = async (public_token: string, accountId: string) => {
    const response = await axios("https://onewypfu44.execute-api.us-east-1.amazonaws.com/dev/plaid_processor_token", {
      method: "POST",
      headers: {
        "X-API-KEY": "17ubFzR3dj8AAupmXSwYf5bovnKwPjl472eUdjnV"
      },
      data: {
        publicToken: public_token,
        accountId
      },
    });
    setProcessorToken(response.data.result.processor_token);
    return response.data.result.processor_token
  }

  const getExternalAccounts = async () => {
    const response = await axios({
      url: "https://onewypfu44.execute-api.us-east-1.amazonaws.com/dev/accounts/1/external_accounts",
      method: "GET",
      headers: {
        "X-API-KEY": "17ubFzR3dj8AAupmXSwYf5bovnKwPjl472eUdjnV"
      }
    })
    setExternalAccounts(response.data.result)
    if (response.data.result.length) setSelectedAccount(response.data.result[0])
  }

  const getLinkToken = async () => {
    const response = await axios({
      url: "https://onewypfu44.execute-api.us-east-1.amazonaws.com/dev/accounts/1/plaid_link_token",
      method: "POST",
      headers: {
        "X-API-KEY": "17ubFzR3dj8AAupmXSwYf5bovnKwPjl472eUdjnV"
      }
    })
    setLinkToken(response.data.result.link_token)
  }

  // Load data
  React.useEffect(() => {
    (async () => {
      setExtAccountsLoading(true)
      await getLinkToken()
      await getExternalAccounts()
      await getAccountBalance()
      await getTransactions()
      setExtAccountsLoading(false)
    })()
  }, [])

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
        <Modal.Body>
          <div className="mb-3">
            {
              type === TransactionType.Deposit ? (
                <>
                  <label htmlFor="depositFrom" className="form-label">Deposit from</label>
                  <select className="form-select">
                    {externalAccounts.map((externalAccount: any, index: number) => {
                      return (
                        <option onSelect={() => setSelectedAccount(externalAccount)} key={index}>
                          {externalAccount.details.account_type.charAt(0).toUpperCase() + externalAccount.details.account_type.slice(1)} {externalAccount.details.account_details[0].account_number.replace(/.(?=.{4,}$)/g, "*")}
                        </option>
                      )
                    })}
                  </select>
                </>
              ) : (
                <>
                  <label htmlFor="withdrawTo" className="form-label">Withdraw to</label>
                  <select className="form-select">
                    {externalAccounts.map((externalAccount: any, index: number) => {
                      return (
                        <option onSelect={() => setSelectedAccount(externalAccount)} key={index}>
                          {externalAccount.details.account_type.charAt(0).toUpperCase() + externalAccount.details.account_type.slice(1)} {externalAccount.details.account_details[0].account_number.replace(/.(?=.{4,}$)/g, "*")}
                        </option>
                      )
                    })}
                  </select>
                </>
              )
            }
          </div>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Amount</label>
            <input type="number" className="form-control" id="amount" onChange={(event) => setAmount(Number(event.target.value))} placeholder="0.00" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={txPending}>
            Cancel
          </Button>
          <Button variant="primary" onClick={transfer} disabled={txPending}>
            {txPending && <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>&nbsp;</>}
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
      <Helmet>
        <title>Probity | Manage Cash</title>
      </Helmet>
      <h1>Cash Management</h1>
      <section className="border rounded p-5 mb-4 shadow-sm bg-white">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between mb-2 align-items-baseline">
              <span>Balance: ${balance}</span>
              <div>
                <Button className="mx-2" size="sm" variant="outline-primary" onClick={() => handleShow(TransactionType.Deposit)}>Deposit</Button>
                <Button size="sm" variant="outline-primary" onClick={() => handleShow(TransactionType.Withdrawal)}>Withdraw</Button>
              </div>
            </div>
            {
              transactions.length && !txsLoading ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">TransactionType</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx: any, index: number) => {
                      return (
                        <tr key={index}>
                          <td>{new Date(tx.created_at).toLocaleString()}</td>
                          <td>{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</td>
                          <td>${Number(tx.amount).toFixed(2)}</td>
                          <td>{tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              ) : txsLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
                  <i className="fas fa-solid fa-spinner fa-spin fa-4x"></i>
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
            <label htmlFor="address" className="form-label">
              Payment Methods<br/>
              <small className="form-text text-muted">
                Link a bank account to fund your investments
              </small>
            </label>
          </div>
        </div>
        {
          externalAccounts.length && !extAccountsLoading ? (
            <pre>
              {externalAccounts.map((externalAccount: any, index) => {
                return (
                  <Card key={index} className="my-2">
                    <Card.Body>
                      <div className="d-flex flex-row justify-content-between">
                        <div>
                          {externalAccount.details.routing_details[0].bank_name}<br/>
                          {externalAccount.details.account_type.charAt(0).toUpperCase() + externalAccount.details.account_type.slice(1)} {externalAccount.details.account_details[0].account_number.replace(/.(?=.{4,}$)/g, "*")}<br/>
                        </div>
                        <button className="btn btn-outline-secondary btn-sm">Remove</button>
                      </div>
                    </Card.Body>
                  </Card>
                )
              })}
              <button className="btn btn-primary mt-4 float-end" disabled={!ready} onClick={() => open()}>Add Bank Account</button>
            </pre>
          ) : (
            extAccountsLoading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: 200 }}>
                <i className="fas fa-solid fa-spinner fa-spin fa-4x"></i>
              </div>
            ) : (
              <button className="btn btn-primary" disabled={!ready} onClick={() => open()}>Add Bank Account</button>
            )
          )
        }
      </section>
    </>
  );
}

export default Cash;
