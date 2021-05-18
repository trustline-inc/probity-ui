import React from "react"
import PriceFeed from "../../components/PriceFeed"

interface Props {
  collateralRatio: number;
  collateralAmount: number;
  aureiAmount: number;
  onAureiAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCollateralAmountChange: (event: React.ChangeEvent<HTMLInputElement>, adjustment: boolean) => void;
}

function RepayActivity({
  collateralRatio,
  collateralAmount,
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
        <input type="number" min="0.000000000000000000" placeholder="0.000000000000000000" className="form-control" onChange={(event) => { onCollateralAmountChange(event, true) }} />
        <span className="input-group-text font-monospace">{"FLR"}</span>
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
    </>
  )
}

export default RepayActivity