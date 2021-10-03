import React from "react";
import PriceFeed from "../../components/PriceFeed"

interface Props {
  collateralAmount: number;
  collateralRatio: number;
  onCollateralAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  withdraw: () => void;
  loading: boolean;
}

function WithdrawActivity({
  collateralAmount,
  collateralRatio,
  onCollateralAmountChange,
  withdraw,
  loading
}: Props) {
  return (
    <>
      <div className="row mb-4">
        <div className="col-12">
          <label htmlFor="collateralRedemptionAmount" className="form-label">
            Collateral<br/>
            <small className="form-text text-muted">
              Amount of collateral to withdraw
            </small>
          </label>
          <div className="input-group">
            <input
              type="number"
              min={0}
              className="form-control"
              id="collateralRedemptionAmount"
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
            <div className="m-2">
              <span>Collateral Ratio:</span>
              <br />
              <small className="text-muted">
                {collateralAmount ? (
                  collateralRatio ? `${(collateralRatio * 100).toFixed(2)}%` : <small className="text-muted">N/A</small>
                ) : (
                  <span>N/A</span>
                )}
              </small>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4 d-grid">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={withdraw}
            disabled={collateralAmount === 0 || loading}
          >
            {loading ? <span className="fa fa-spin fa-spinner" /> : "Confirm"}
          </button>
        </div>
      </div>
    </>
  )
}

export default WithdrawActivity