import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import React from 'react';

function Address({ globalId, auth }: { globalId: string, auth: any }) {
  const [address, setAddress] = React.useState("")
  const [proposedAddress, setProposedAddress] = React.useState("")
  const { account } = useWeb3React()

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
      <h1>Address</h1>
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
    </>
  );
}

export default Address;
