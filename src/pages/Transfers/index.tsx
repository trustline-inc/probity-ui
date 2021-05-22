import React, { useContext } from "react";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import Info from '../../components/Info';
import { Contract } from "ethers";
import { BRIDGE_ADDRESS } from '../../constants';
import BridgeABI from "@trustline-inc/aurei/artifacts/contracts/Bridge.sol/Bridge.json";
import EventContext from "../../contexts/TransactionContext"
import { Activity as ActivityType } from "../../types";
import Activity from "../../containers/Activity";

export default function Transfers() {
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

  const onClick = async () => {
    const response = await fetch(`http://127.0.0.1:8082/${username}`, {
      method: "get",
      headers: {
        'Accept': 'application/xrpl-testnet+json',
        'PayID-Version': '1.0'
      }
    })
    const json = await response.json()

    if (json.addresses.length > 0) {
      // Take the first one for now
      const address = json.addresses[0].addressDetails.address;

      if (library && account) {
        const bridge = new Contract(BRIDGE_ADDRESS, BridgeABI.abi, library.getSigner())

        try {
          const nonce = 1;
          const result = await bridge.transferAureiToXRP(address, aureiAmount, nonce);
          const data = await result.wait();
          ctx.updateTransactions(data);
        } catch (error) {
          console.log(error);
          setError(error);
        }
      }

    }
  }

  return (
    <>
      <header className="pt-2">
        <h1>Transfers</h1>
        <p className="lead">Transfer Aurei to the Trustline app.</p>
        {active && <Info />}
      </header>
      <section className="border rounded p-5 mb-5 shadow-sm bg-white">
        <Activity active={active} activity={ActivityType.Transfer} error={error}>
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <label className="form-label">Amount</label>
              <div className="input-group">
                <input type="number" min="0.000000000000000000" placeholder="0.000000000000000000" className="form-control" value={aureiAmount ? aureiAmount : ""} onChange={onAureiAmountChange} />
                <span className="input-group-text font-monospace">{"AUR"}</span>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-6 offset-md-3">
              <label className="form-label">PayString</label>
              <div className="input-group">
                <input type="text" className="form-control" value={username} onChange={onUsernameChange} />
                <span className="input-group-text font-monospace">{"$trustline.app"}</span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 offset-md-3 mt-4 d-grid">
              <button
                className="btn btn-primary btn-lg mt-4"
                onClick={onClick}
                disabled={aureiAmount === 0}
              >Confirm</button>
            </div>
          </div>
        </Activity>
      </section>
    </>
  )
}