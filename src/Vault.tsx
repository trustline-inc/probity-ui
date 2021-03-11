import React from 'react';

function Vault() {
  const [collateralAmount, setCollateralAmount] = React.useState(0);
  const [collateralPrice, setCollateralPrice] = React.useState(0.00);
  const [collateralValue, setCollateralValue] = React.useState(0.00);

  React.useEffect(() => {
    const runEffect = async () => {
      // TODO: Fetch live price
      setCollateralPrice(1.00);
    }
    runEffect();
  });

  React.useEffect(() => {
    setCollateralValue((collateralPrice * collateralAmount));
  }, [collateralPrice, collateralAmount]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <header className="py-5">
        <h1>Vault</h1>
        <p className="lead">The Probity vault securely stores crypto collateral.</p>
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          <strong><i className="fas fa-exclamation-circle"></i></strong> Only Ether (ETH) is currently supported.
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      </header>    
      <section className="border rounded p-5 w-50 mb-5">
        {/* Activity Navigation */}
        <div>
          <h3 className="pb-2 text-center">Collateral Management</h3>
          <hr />
          <ul className="nav nav-pills nav-fill">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#/">Deposit</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#/">Withdraw</a>
            </li>
          </ul>
        </div>
        <hr />
        {/* Vault Activity */}
        <div className="container">
          <div className="row">
            <div className="col-6 offset-3">
              <div className="py-3">
                <label htmlFor="depositAmountInput" className="form-label">Amount (ETH)</label>
                <input
                  type="number"
                  min={0}
                  className="form-control"
                  id="depositAmountInput"
                  placeholder="0.000000000000000000"
                  onChange={event => setCollateralAmount(Number(event.target.value))}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6 offset-3">
              <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
                <div className="m-2"><span className="text-muted h6">ETH/USD</span><br />${collateralPrice}</div>
                <div className="m-2"><span className="text-muted h6">Value</span><br />${collateralValue.toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6 offset-3 mt-4">
              <div className="d-grid">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    console.log("Clicked")
                  }}
                >Confirm</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Vault;
