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
        <div className="col-6 offset-3">
          <div className="py-3">
            <label htmlFor="equityRedemptionAmount" className="form-label">Capital Amount (CAUR)</label>
            <input
              type="number"
              min={0}
              className="form-control"
              id="equityRedemptionAmount"
              placeholder="0.000000000000000000"
              value={equityAmount}
              onChange={onEquityAmountChange}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-6 offset-3">
          <div className="py-3">
            <label htmlFor="collateralRedemptionAmount" className="form-label">Collateral Amount (CFLR)</label>
            <input
              type="number"
              min={0}
              className="form-control"
              id="collateralRedemptionAmount"
              placeholder="0.000000000000000000"
              value={collateralAmount}
              onChange={onCollateralAmountChange}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-6 offset-3 mt-4">
          <div className="d-grid">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={redeemEquity}
              disabled={equityAmount === 0 || collateralAmount === 0}
            >Confirm</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default RedemptionActivity