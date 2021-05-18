import React from "react"
import PriceFeed from "../../components/PriceFeed";
import { utils } from "ethers";

interface Props {
  collateralRatio: number;
  collateralAmount: number;
  rate: any;
  onAureiAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCollateralAmountChange: (event: React.ChangeEvent<HTMLInputElement>, adjustment: boolean) => void;
}

function BorrowActivity({
  collateralRatio,
  collateralAmount,
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
      <div className="row pt-3 pb-1">
        <div className="col-12">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center">
            <div className="m-2"><span className="text-muted h6">Current APR</span><br />{rate && utils.formatEther(rate.div("10000000").toString().slice(2))}%</div>
          </div>
        </div>
      </div>
      <label className="form-label">
        Collateral<br/>
        <small className="form-text text-muted">
          Amount of collateral to lock
        </small>
      </label>
      <div className="input-group mb-3">
        <input type="number" min="0.000000000000000000" placeholder="0.000000000000000000" className="form-control" onChange={(event) => {
           onCollateralAmountChange(event, false) }} />
        <span className="input-group-text font-monospace">{"FLR"}</span>
      </div>
      <PriceFeed collateralAmount={collateralAmount} />
      <div className="row">
        <div className="col-12">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
            <div className="m-2"><span>Collateral Ratio:</span><br />{collateralRatio ? `${(collateralRatio * 100).toFixed(2)}%` : <small className="text-muted">N/A</small>}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BorrowActivity