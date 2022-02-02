import React from "react";
import { useWeb3React } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import PriceFeed from "../../components/PriceFeed"
import { getNativeTokenSymbol, getStablecoinSymbol } from "../../utils";
import AssetSelector from "../../components/AssetSelector";
import AssetContext from "../../contexts/AssetContext"

interface Props {
  underlyingAmount: number;
  equityAmount: number;
  underlyingRatio: number;
  onUnderlyingAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEquityAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  redeem: () => void;
  loading: boolean;
}

function RedemptionActivity({
  underlyingAmount,
  equityAmount,
  underlyingRatio,
  onUnderlyingAmountChange,
  onEquityAmountChange,
  redeem,
  loading
}: Props) {
  const ctx = React.useContext(AssetContext)
  const { chainId } = useWeb3React<Web3Provider>()
  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const onSelect = () => {
    setShow(false)
  }
  const nativeTokenSymbol = getNativeTokenSymbol(chainId!)
  const currentAsset = ctx.asset || nativeTokenSymbol
  return (
    <>
      <AssetSelector nativeTokenSymbol={nativeTokenSymbol} show={show} onSelect={onSelect} handleClose={handleClose} />
      <div className="row mb-4">
        <div className="col-12">
          <p className="text-muted">Your investment must actively maintain a mimumum 1.5 ratio to loan capital to avoid penalties.</p>
        </div>
        <div className="col-12">
          <label htmlFor="redemptionAmount" className="form-label">
            Underlying<br/>
            <small className="form-text text-muted">
              The amount of underlying asset to redeem
            </small>
          </label>
          <div className="input-group">
            <input
              type="number"
              min={0}
              className="form-control"
              id="redemptionAmount"
              placeholder="0.000000000000000000"
              onChange={onUnderlyingAmountChange}
            />
            <button
              onClick={handleShow}
              className="btn btn-outline-secondary font-monospace"
              type="button"
            >
              {currentAsset}
            </button>
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <label htmlFor="equityAmount" className="form-label">
            Shares<br/>
            <small className="form-text text-muted">
              The amount of shares to destroy
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
          </div>
        </div>
      </div>
      <PriceFeed asset={currentAsset} collateralAmount={underlyingAmount} />
      <div className="row">
        <div className="col-12">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
            <div className="m-2">
              <span>Underlying Ratio:</span>
              <br />
              <small className="text-muted">
                {underlyingAmount ? (
                  underlyingRatio ? `${(underlyingRatio * 100).toFixed(2)}%` : <small className="text-muted">N/A</small>
                ) : (
                  <span>N/A</span>
                )}
              </small>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4 d-grid">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={redeem}
            disabled={underlyingAmount === 0 || loading}
          >
            {loading ? <span className="fa fa-spin fa-spinner" /> : "Confirm"}
          </button>
        </div>
      </div>
    </>
  )
}

export default RedemptionActivity