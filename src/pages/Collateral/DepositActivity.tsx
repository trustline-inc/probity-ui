import React from "react"
import PriceFeed from "../../components/PriceFeed";

interface Props {
  collateralAmount: number;
  collateralRatio: number;
  onCollateralAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  deposit: () => void;
}

function DepositActivity({
  collateralAmount,
  collateralRatio,
  onCollateralAmountChange,
  loading,
  deposit
}: Props) {
  return (
    <>
      <div className="row mb-4">
        <div className="col-12">
          <label htmlFor="collateralConversionInput" className="form-label">
            Collateral<br/>
            <small className="form-text text-muted">
              Amount of collateral to deposit
            </small>
          </label>
          <div className="input-group">
            <input
              type="number"
              min={0}
              className="form-control"
              id="collateralConversionInput"
              placeholder="0.000000000000000000"
              onChange={onCollateralAmountChange}
            />
            <span className="input-group-text font-monospace">{"FLR"}</span>
          </div>
        </div>
      </div>
      <PriceFeed collateralAmount={collateralAmount} />
      <div className="row">
        <div className="col-12">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
            <div className="m-2"><span>Collateral Ratio:</span><br />{collateralRatio ? `${(collateralRatio * 100).toFixed(2)}%` : <small className="text-muted">N/A</small>}</div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4 d-grid">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={deposit}
            disabled={collateralAmount === 0 || loading}
          >
            {loading ? <span className="fa fa-spin fa-spinner" /> : "Confirm"}
          </button>
        </div>
      </div>
    </>
  )
}

export default DepositActivity