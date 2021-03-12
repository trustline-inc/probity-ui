import React from 'react';
import useLocalStorageState from "use-local-storage-state";

function Exchange() {
  const [displayInfoAlert, setDisplayInfoAlert] = useLocalStorageState("displayInfoAlert", true);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <header className="pt-5">
        <h1>Exchange</h1>
        <p className="lead">The Probity Exchange securely stores crypto collateral.</p>
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
      <section className="border rounded p-5 w-50 mb-5">
        {/* Activity Navigation */}
        <div>
          <h3 className="pb-2 text-center">Market Selector</h3>
          TODO
        </div>
        <hr />
        {/* Exchange Activity */}
        <div className="container">
          <div className="row">
            <div className="col-6 offset-3">
              <div className="py-3">
                Exchange Details (TODO)
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Exchange;
