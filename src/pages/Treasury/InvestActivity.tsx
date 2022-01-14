import React from "react"
import { useWeb3React } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import PriceFeed from "../../components/PriceFeed";
import { getNativeTokenSymbol, getStablecoinSymbol } from "../../utils";
import AssetSelector from "../../components/AssetSelector";

interface Props {
  underlyingAmount: number;
  equityAmount: number;
  underlyingRatio: number;
  onUnderlyingAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEquityAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  supply: () => void;
  loading: boolean;
}

function InvestingActivity({
  underlyingAmount,
  equityAmount,
  underlyingRatio,
  onUnderlyingAmountChange,
  onEquityAmountChange,
  supply,
  loading
}: Props) {
  const { chainId } = useWeb3React<Web3Provider>()
  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const onSelect = () => {
    setShow(false)
  }
  const nativeTokenSymbol = getNativeTokenSymbol(chainId!)
  return (
    <>
      <AssetSelector nativeTokenSymbol={nativeTokenSymbol} show={show} onSelect={onSelect} handleClose={handleClose} />
      <div className="row mb-4">
        <div className="col-12">
          <p className="text-muted">Your investment must actively maintain a mimumum 1.5 ratio to equity to avoid penalties.</p>
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
              onChange={onUnderlyingAmountChange}
            />
            <button
              onClick={handleShow}
              className="btn btn-outline-secondary font-monospace"
              type="button"
            >
              {nativeTokenSymbol}
            </button>
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <label htmlFor="equityAmount" className="form-label">
            Equity<br/>
            <small className="form-text text-muted">
              The amount of shares to create
            </small>
          </label>
          <div className="input-group">
            <input
              type="number"
              min={0}
              className="form-control"
              id="equityAmount"
              placeholder="0.000000000000000000"
              onChange={onEquityAmountChange}
            />
            <span className="input-group-text font-monospace">{getStablecoinSymbol(chainId!)}</span>
          </div>
        </div>
      </div>
      <PriceFeed collateralAmount={underlyingAmount} />
      <div className="row">
        <div className="col-12">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
            <div className="m-2"><span>Collateral Ratio:</span><br />{underlyingRatio ? `${(underlyingRatio * 100).toFixed(2)}%` : <small className="text-muted">N/A</small>}</div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4 d-grid">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={supply}
            disabled={equityAmount === 0 || underlyingAmount === 0 || loading}
          >
            {loading ? <span className="fa fa-spin fa-spinner" /> : "Confirm"}
          </button>
        </div>
      </div>
    </>
  )
}

export default InvestingActivity