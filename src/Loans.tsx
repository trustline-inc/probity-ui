import React from 'react';
import useLocalStorageState from "use-local-storage-state";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';

function Loans() {
  const { active } = useWeb3React<Web3Provider>()
  const [displayInfoAlert, setDisplayInfoAlert] = useLocalStorageState("displayInfoAlert", true);
  const [baseToken, setBaseToken] = React.useState("FLR");
  const [baseTokenAmount, setBaseTokenAmount] = React.useState(0);
  const [counterToken, setCounterToken] = React.useState("AUR");
  const [counterTokenAmount, setCounterTokenAmount] = React.useState(0);
  const [collateralPrice, setCollateralPrice] = React.useState(0.00);
  const [collateralizationRatio, setCollateralizationRatio] = React.useState(0);

  const onClick = () => {
    const temp = baseToken;
    setBaseToken(counterToken);
    setCounterToken(temp);
  }

  const onBaseTokenAmountChange = (event: any) => {
    const amount = event.target.value;
    setBaseTokenAmount(amount);
  }

  const onCounterTokenAmountChange = (event: any) => {
    const amount = event.target.value;
    setCounterTokenAmount(amount);
  }

  // Start listening to price feed
  React.useEffect(() => {
    const runEffect = async () => {
      // TODO: Fetch live price
      setCollateralPrice(1.00);
    }
    runEffect();
  }, []);

  // Dynamically calculate the collateralization ratio
  React.useEffect(() => {
    setCollateralizationRatio((baseTokenAmount * collateralPrice) / counterTokenAmount);
  }, [baseTokenAmount, collateralPrice, counterTokenAmount]);

  return (
    <>
      <header className="pt-5">
        <h1>Loan Exchange</h1>
        <p className="lead">Borrow Aurei and repay debt using collateral.</p>
        {
          displayInfoAlert ? (
            <div className="alert alert-info alert-dismissible fade show" role="alert">
              <strong><i className="fas fa-exclamation-circle"></i></strong> Only Spark (FLR) is currently supported as collateral.
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => {
                setDisplayInfoAlert(false);
              }}></button>
            </div>
          ) : (null)
        }
      </header>    
      <section className="border rounded p-5 mb-5">
        {/* Exchange Activity */}
        {
          active && (
            <>
              <div className="p-5 border rounded">
                <label className="form-label">From</label>
                <div className="input-group input-group-lg mb-3">
                  <input type="number" min="0.000000000000000000" placeholder="0.000000000000000000" className="form-control" onChange={onBaseTokenAmountChange} />
                  <span className="input-group-text font-monospace">{baseToken}</span>
                </div>
                <br/>
                <div className="text-center">
                  <button className="btn btn-lg" onClick={onClick}><i className="fa fa-exchange"/></button>
                </div>
                <br/>
                <label className="form-label">To</label>
                <div className="input-group input-group-lg">
                  <input type="number" min="0.000000000000000000" placeholder="0.000000000000000000" className="form-control" onChange={onCounterTokenAmountChange} />
                  <span className="input-group-text font-monospace">{counterToken}</span>
                </div>
              </div>
              <div className="row">
                <div className="col-6 offset-3">
                  <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
                    <div className="m-2"><span className="text-muted h6">Coll. Ratio</span><br />{(collateralizationRatio * 100).toFixed(2)}%</div>
                  </div>
                </div>
              </div>
            </>
          )
        }
        {
          !active && (
            <div className="py-5 text-center">Please connect your wallet to manage borrower activity.</div>
          )
        }
      </section>
    </>
  );
}

export default Loans;
