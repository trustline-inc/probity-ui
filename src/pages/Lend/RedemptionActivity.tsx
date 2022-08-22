import React from "react";
import numbro from "numbro"
import NumberFormat from "react-number-format"
import { useWeb3React } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import PriceFeed from "../../components/PriceFeed"
import { getNativeTokenSymbol } from "../../utils";
import AssetSelector from "../../components/AssetSelector";

interface Props {
  underlyingAmount: number;
  equityAmount: number;
  underlyingRatio: number;
  onUnderlyingAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEquityAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  redeem: () => void;
  loading: boolean;
  currentAsset: string;
  liquidationRatio: string;
}

function RedemptionActivity({
  underlyingAmount,
  equityAmount,
  underlyingRatio,
  onUnderlyingAmountChange,
  onEquityAmountChange,
  redeem,
  loading,
  currentAsset,
  liquidationRatio
}: Props) {
  const { chainId } = useWeb3React<Web3Provider>()
  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const onSelect = () => setShow(false)
  const nativeTokenSymbol = getNativeTokenSymbol(chainId!)
  return (
    <>
      <AssetSelector nativeTokenSymbol={nativeTokenSymbol} show={show} onSelect={onSelect} handleClose={handleClose} />
      <div className="row mb-4">
        {/* <div className="col-12">
          <p className="text-muted">Your investment must actively maintain a mimumum {liquidationRatio} ratio to equity to avoid penalties.</p>
        </div> */}
        {/* <div className="col-12">
          <label htmlFor="redemptionAmount" className="form-label">
            Underlying<br/>
            <small className="form-text text-muted">
              The amount of underlying asset to redeem
            </small>
          </label>
          <div className="input-group">
            <NumberFormat
              min="0.000000000000000000"
              className="form-control"
              id="collateralConversionInput"
              placeholder="0.000000000000000000"
              thousandSeparator={true}
              onChange={onUnderlyingAmountChange}
              value={underlyingAmount === 0 ? "" : numbro(underlyingAmount).format({ thousandSeparated: true })}
            />
            <button
              onClick={handleShow}
              className="btn btn-outline-secondary font-monospace"
              type="button"
            >
              {currentAsset}
            </button>
          </div>
        </div> */}
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <label htmlFor="equityAmount" className="form-label">
            Amount<br/>
            <small className="form-text text-muted">
              The amount funds of to redeem
            </small>
          </label>
          <div className="input-group">
            <NumberFormat
              min="0.000000000000000000"
              className="form-control"
              id="equityAmount"
              placeholder="0.000000000000000000"
              thousandSeparator={true}
              onChange={onEquityAmountChange}
              value={equityAmount === 0 ? "" : numbro(equityAmount).format({ thousandSeparated: true })}
            />
            <span className="input-group-text font-monospace">USD</span>
          </div>
        </div>
      </div>
      {/* <PriceFeed asset={currentAsset} amount={underlyingAmount} />
      <div className="row">
        <div className="col-12">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
            <div className="m-2">
              <span>Supply Ratio:</span>
              <br />
              <small className="text-muted">(Value to Shares)</small>
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
      </div> */}
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