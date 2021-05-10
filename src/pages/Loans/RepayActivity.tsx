import React from "react"

interface Props {
  debtBalance: number;
  equityBalance: number;
  collateralRatio: number;
  aureiAmount: number;
  onAureiAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCollateralAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function RepayActivity({
  debtBalance,
  equityBalance,
  collateralRatio,
  aureiAmount,
  onAureiAmountChange,
  onCollateralAmountChange
}: Props) {
  return (
    <>
      <label className="form-label">
        Amount<br/>
        <small className="form-text text-muted">
          Size of the repayment
        </small>
      </label>
      <div className="input-group">
        <input type="number" min="0.000000000000000000" placeholder="0.000000000000000000" className="form-control" onChange={onAureiAmountChange} />
        <span className="input-group-text font-monospace">{"AUR"}</span>
      </div>
      <br/>
      <label className="form-label">
        Collateral<br/>
        <small className="form-text text-muted">
          Amount of collateral to unlock
        </small>
      </label>
      <div className="input-group mb-3">
        <input type="number" min="0.000000000000000000" placeholder="0.000000000000000000" className="form-control" onChange={onCollateralAmountChange} />
        <span className="input-group-text font-monospace">{"CFLR"}</span>
      </div>
      {/* 
      <div className="row">
        <div className="col-12">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
            <div className="m-2"><span className="text-muted h6">New Coll. Ratio</span><br />{collateralRatio ? `${(collateralRatio * 100).toFixed(2)}%` : null}</div>
          </div>
        </div>
      </div> 
      */}
    </>
  )
}

export default RepayActivity