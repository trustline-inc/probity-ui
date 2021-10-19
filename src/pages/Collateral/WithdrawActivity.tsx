import React from "react";

interface Props {
  collateralAmount: number;
  onCollateralAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  withdraw: () => void;
  loading: boolean;
}

function WithdrawActivity({
  collateralAmount,
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