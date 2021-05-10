import React from "react"

interface Props {
  collateralAmount: number;
  equityAmount: number;
  collateralRatio: number;
  onCollateralAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEquityAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  issueEquity: () => void;
}

function IssueActivity({
  collateralAmount,
  equityAmount,
  collateralRatio,
  onCollateralAmountChange,
  onEquityAmountChange,
  issueEquity
}: Props) {
  return (
    <>
      <div className="row">
        <div className="col-12 mb-4">
          <label htmlFor="collateralConversionInput" className="form-label">
            Collateral<br/>
            <small className="form-text text-muted">
              Amount of collateral to lock
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
            <span className="input-group-text font-monospace">{"CFLR"}</span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <label htmlFor="equityIssuanceInput" className="form-label">
            Capital<br/>
            <small className="form-text text-muted">
              Amount of Aurei to mint
            </small>
          </label>
          <div className="input-group">
            <input
              type="number"
              min={0}
              className="form-control"
              id="equityIssuanceInput"
              placeholder="0.000000000000000000"
              onChange={onEquityAmountChange}
            />
            <span className="input-group-text font-monospace">{"AUR"}</span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
            <div className="m-2"><span className="text-muted h6">Coll. Ratio</span><br />{collateralRatio === 0 ? null : `${collateralRatio * 100}%`}</div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4 d-grid">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={issueEquity}
            disabled={equityAmount === 0 || collateralAmount === 0}
          >Confirm</button>
        </div>
      </div>
    </>
  )
}

export default IssueActivity