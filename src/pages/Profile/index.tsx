import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import React from 'react';
import { Helmet } from "react-helmet";
import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
} from 'react-plaid-link';

function Profile({ globalId, auth }: { globalId: string, auth: any }) {
  const [address, setAddress] = React.useState("")
  const [proposedAddress, setProposedAddress] = React.useState("")
  const { account } = useWeb3React()
  const [token, setToken] = React.useState(null);

  // Get Plaid Link token
  React.useEffect(() => {
    (async () => {
      const response = await axios({
        url: "https://onewypfu44.execute-api.us-east-1.amazonaws.com/dev/accounts/1/plaid_link_token",
        method: "POST",
        headers: {
          "X-API-KEY": "17ubFzR3dj8AAupmXSwYf5bovnKwPjl472eUdjnV"
        }
      })
      setToken(response.data.result.link_token)
    })()
  }, [])

  // The usePlaidLink hook manages Plaid Link creation
  // It does not return a destroy function;
  // instead, on unmount it automatically destroys the Link instance
  const config: PlaidLinkOptions = {
    onSuccess: (public_token, metadata) => {
      console.log("public_token", public_token)
      console.log("metadata", metadata)
    },
    onExit: (err, metadata) => {
      console.log("err", err)
      console.log("metadata", metadata)
    },
    onEvent: (eventName, metadata) => {
      console.log("eventName", eventName)
      console.log("metadata", metadata)
    },
    token: token,
  };
  const { open, exit, ready } = usePlaidLink(config);

  React.useEffect(() => {
    (async () => {
      if (process.env.REACT_APP_REQUIRE_AUTH) {
        try {
          let url;
          if (process.env.NODE_ENV === "production")
            url = `https://api.trustline.co/v1/auth/${globalId}`
          else
            url = `http://localhost:8080/v1/auth/${globalId}`
          const response = await axios({
            method: "GET",
            url
          })
          if (response.status === 200) {
            setAddress(response.data.result.address)
          }
        } catch (error) {
          console.error(error)
        }
      }
    })()
  }, [globalId])

  const onSubmit = async () => {
    try {
      let url;
      if (process.env.NODE_ENV === "production")
        url = `https://api.trustline.co/v1/users`
      else
        url = `http://localhost:8080/v1/users`
      const response = await axios({
        method: "POST",
        url,
        data: { address: proposedAddress, id: globalId, token: auth.accessToken },
        headers: {
          "Content-Type": "application/json"
        }
      })
      console.log(response)
      if (response.status === 201) {
        setAddress(proposedAddress)
      }
    } catch (error) {
      console.error(error)
      const message = (error as any)?.response.data.error.message
      if (message) alert(message)
    }
  }

  return (
    <>       
      <Helmet>
        <title>Probity | User Profile</title>
      </Helmet>
      <h1>Profile</h1>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <div className="row mb-4">
          <div className="col-12">
            <label htmlFor="address" className="form-label">
              Authorized Address<br/>
              <small className="form-text text-muted">
                This address is allowed to use Probity (cannot be modified)
              </small>
            </label>
            {
              address ? (
                <input className="form-control" value={address} readOnly />
              ) : (
                <input className="form-control" placeholder={account?.toString()} onChange={(event) => setProposedAddress(event.target.value) } />
              )
            }
          </div>
        </div>
        {
          address ? (null) : (
            <div className="row">
              <div className="col-12">
                <button
                  onClick={onSubmit}
                  className="btn btn-outline-secondary"
                  type="button"
                >
                  Submit
                </button>
              </div>
            </div>
          )
        }
      </section>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <div className="row mb-4">
          <div className="col-12">
            <label htmlFor="address" className="form-label">
              Bank Account<br/>
              <small className="form-text text-muted">
                Link a bank account to fund your investments.
              </small>
            </label>
          </div>
        </div>
        <button className="btn btn-primary" disabled={!ready} onClick={() => open()}>Add Bank Account</button>
      </section>
    </>
  );
}

export default Profile;
