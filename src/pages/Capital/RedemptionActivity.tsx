import React from "react";

interface Props {
  collateralAmount: number;
  equityAmount: number;
  onCollateralAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEquityAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  redeemEquity: () => void;
}

function RedemptionActivity({
  collateralAmount,
  equityAmount,
  onCollateralAmountChange,
  onEquityAmountChange,
  redeemEquity
}: Props) {
  return (
    <>
      <div className="row">
        <div className="col-12 mb-4">
          <label htmlFor="equityRedemptionAmount" className="form-label">Capital Amount</label>
          <div className="input-group">
            <input
              type="number"
              min={0}
              className="form-control"
              id="equityRedemptionAmount"
              placeholder="0.000000000000000000"
              onChange={onEquityAmountChange}
            />
            <span className="input-group-text font-monospace">{"CAUR"}</span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <label htmlFor="collateralRedemptionAmount" className="form-label">Collateral Amount</label>
          <div className="input-group">
            <input
              type="number"
              min={0}
              className="form-control"
              id="collateralRedemptionAmount"
              placeholder="0.000000000000000000"
              onChange={onCollateralAmountChange}
            />
            <span className="input-group-text font-monospace">{"CFLR"}</span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4 d-grid">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={redeemEquity}
            disabled={equityAmount === 0 || collateralAmount === 0}
          >Confirm</button>
        </div>
      </div>
    </>
  )
}

export default RedemptionActivity