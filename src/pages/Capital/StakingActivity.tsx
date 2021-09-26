import React from "react"
import PriceFeed from "../../components/PriceFeed";

interface Props {
  collateralAmount: number;
  supplyAmount: number;
  collateralRatio: number;
  onCollateralAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSupplyAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  stake: () => void;
}

function StakingActivity({
  collateralAmount,
  supplyAmount,
  collateralRatio,
  onCollateralAmountChange,
  onSupplyAmountChange,
  stake
}: Props) {
  return (
    <>
      <div className="row mb-4">
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
              onChange={onSupplyAmountChange}
            />
            <span className="input-group-text font-monospace">{"AUR"}</span>
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
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
            <span className="input-group-text font-monospace">{"FLR"}</span>
          </div>
        </div>
      </div>
      <PriceFeed collateralAmount={collateralAmount} />
      <div className="row">
        <div className="col-12">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
            <div className="m-2"><span>Collateral Ratio:</span><br />{collateralRatio ? `${(collateralRatio * 100).toFixed(2)}%` : <small className="text-muted">N/A</small>}</div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4 d-grid">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={stake}
            disabled={supplyAmount === 0 || collateralAmount === 0}
          >Confirm</button>
        </div>
      </div>
    </>
  )
}

export default StakingActivity