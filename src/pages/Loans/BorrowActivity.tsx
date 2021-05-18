import React from "react"
import { utils } from "ethers";

interface Props {
  collateralRatio: number;
  rate: any;
  onAureiAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCollateralAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function BorrowActivity({
  collateralRatio,
  rate,
  onAureiAmountChange,
  onCollateralAmountChange
}: Props) {
  return (
    <>
      <label className="form-label">
        Amount<br/>
        <small className="form-text text-muted">
          Size of the loan
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
          Amount of collateral to lock
        </small>
      </label>
      <div className="input-group mb-3">
        <input type="number" min="0.000000000000000000" placeholder="0.000000000000000000" className="form-control" onChange={onCollateralAmountChange} />
        <span className="input-group-text font-monospace">{"FLR"}</span>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
            <div className="m-2"><span className="text-muted h6">Coll. Ratio</span><br />{collateralRatio ? `${(collateralRatio * 100).toFixed(2)}%` : null}</div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center">
            <div className="m-2"><span className="text-muted h6">Current APR</span><br />{rate && utils.formatEther(rate.div("10000000").toString().slice(2))}%</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BorrowActivity