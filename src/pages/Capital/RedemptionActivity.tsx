import React from "react";

interface Props {
  collateralAmount: number;
  equityAmount: number;
  onCollateralAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEquityAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  redeem: () => void;
}

function RedemptionActivity({
  collateralAmount,
  equityAmount,
  onCollateralAmountChange,
  onEquityAmountChange,
  redeem
}: Props) {
  return (
    <>
      <div className="row">
        <div className="col-12 mb-4">
          <label htmlFor="collateralRedemptionAmount" className="form-label">
            Collateral<br/>
            <small className="form-text text-muted">
              Amount of collateral to unlock
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
        <div className="col-12">
          <label htmlFor="equityRedemptionAmount" className="form-label">
            Capital<br/>
            <small className="form-text text-muted">
              Amount of Aurei to burn
            </small>
          </label>
          <div className="input-group">
            <input
              type="number"
              min={0}
              className="form-control"
              id="equityRedemptionAmount"
              placeholder="0.000000000000000000"
              onChange={onEquityAmountChange}
            />
            <span className="input-group-text font-monospace">{"AUR"}</span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4 d-grid">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={redeem}
            disabled={equityAmount === 0 || collateralAmount === 0}
          >Confirm</button>
        </div>
      </div>
    </>
  )
}

export default RedemptionActivity