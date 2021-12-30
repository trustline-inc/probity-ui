import React from "react"
import { useWeb3React } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import PriceFeed from "../../components/PriceFeed";
import { getNativeTokenSymbol, getStablecoinSymbol } from "../../utils";

interface Props {
  collateralAmount: number;
  supplyAmount: number;
  collateralRatio: number;
  onCollateralAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSupplyAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  supply: () => void;
  loading: boolean;
}

function InvestingActivity({
  collateralAmount,
  supplyAmount,
  collateralRatio,
  onCollateralAmountChange,
  onSupplyAmountChange,
  supply,
  loading
}: Props) {
  const { chainId } = useWeb3React<Web3Provider>()

  return (
    <>
      <div className="row mb-4">
        <div className="col-12">
          <p className="text-muted">Your investment must actively maintain a mimumum 1.5 ratio to loan capital to avoid penalties.</p>
        </div>
        <div className="col-12">
          <label htmlFor="collateralConversionInput" className="form-label">
            Amount<br/>
            <small className="form-text text-muted">
              The amount of asset to invest
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
            <span className="input-group-text font-monospace">{getNativeTokenSymbol(chainId!)}</span>
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <label htmlFor="supplyAmount" className="form-label">
            Loan Capital<br/>
            <small className="form-text text-muted">
              The amount of loan capital to create
            </small>
          </label>
          <div className="input-group">
            <input
              type="number"
              min={0}
              className="form-control"
              id="supplyAmount"
              placeholder="0.000000000000000000"
              onChange={onSupplyAmountChange}
            />
            <span className="input-group-text font-monospace">{getStablecoinSymbol(chainId!)}</span>
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
            onClick={supply}
            disabled={supplyAmount === 0 || collateralAmount === 0 || loading}
          >
            {loading ? <span className="fa fa-spin fa-spinner" /> : "Confirm"}
          </button>
        </div>
      </div>
    </>
  )
}

export default InvestingActivity