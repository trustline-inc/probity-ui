import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import React from 'react';
import { Helmet } from "react-helmet-async";

function Profile({ user, auth }: { user: any, auth: any }) {
  const [address, setAddress] = React.useState("")
  const [proposedAddress, setProposedAddress] = React.useState("")
  const { account } = useWeb3React()

  /**
   * Fetch/set user address
   */
  React.useEffect(() => {
    (async () => {
      if (process.env.REACT_APP_REQUIRE_AUTH) {
        try {
          const response = await axios(`http://localhost:8080/v1/users/${user.id}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${auth.token}`
            }
          })
          if (response.status === 200) {
            if (response.data.address) setAddress(response.data.address)
          }
        } catch (error) {
          console.error(error)
        }
      }
    })()
  }, [user.id, auth, address])

  /**
   * Saves user address
   */
  const onSubmit = async () => {
    try {
      const response = await axios(`http://localhost:8080/v1/users/${user.id}`, {
        method: "PATCH",
        data: {
          address: proposedAddress,
        },
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.token}`
        }
      })
      if (response.status === 201) {
        setAddress(proposedAddress)
      }
    } catch (error) {
      const message = (error as any)?.response.data
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
                <input className="form-control" placeholder={account?.toString()} value={proposedAddress} onChange={(event) => setProposedAddress(event.target.value) } />
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

export default Profile;
