import React from "react"
import numbro from "numbro"
import NumberFormat from 'react-number-format';
import PriceFeed from "../../components/PriceFeed"
import { getNativeTokenSymbol, getStablecoinSymbol } from "../../utils"
import { useWeb3React } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import AssetSelector from "../../components/AssetSelector";
import AssetContext from "../../contexts/AssetContext"

interface Props {
  collateralRatio: number;
  collateralAmount: number;
  amount: number;
  rate: number;
  loading: boolean;
  repay: () => void;
  onAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCollateralAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function RepayActivity({
  repay,
  loading,
  amount,
  collateralRatio,
  collateralAmount,
  onAmountChange,
  onCollateralAmountChange
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
      <label className="form-label">
        Amount<br/>
        <small className="form-text text-muted">
          Size of the repayment
        </small>
      </label>
      <div className="input-group">
        <NumberFormat
          min="0.000000000000000000"
          className="form-control"
          placeholder="0.000000000000000000"
          thousandSeparator={true}
          onChange={onAmountChange}
          value={amount === 0 ? "" : numbro(amount).format({ thousandSeparated: true })}
        />
        <span className="input-group-text font-monospace">{getStablecoinSymbol(chainId!)}</span>
      </div>
      <br/>
      <label className="form-label">
        Collateral<br/>
        <small className="form-text text-muted">
          Amount of collateral to unlock
        </small>
      </label>
      <div className="input-group mb-3">
        <NumberFormat
          min="0.000000000000000000"
          className="form-control"
          placeholder="0.000000000000000000"
          thousandSeparator={true}
          onChange={onCollateralAmountChange}
          value={collateralAmount === 0 ? "" : numbro(collateralAmount).format({ thousandSeparated: true })}
        />
        <button
          onClick={handleShow}
          className="btn btn-outline-secondary font-monospace"
          type="button"
        >
          {currentAsset}
        </button>
      </div>
      <PriceFeed asset={currentAsset} collateralAmount={collateralAmount} />
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
      <div className="row">
        <div className="col-12 mt-4 d-grid">
          <button
            className="btn btn-primary btn-lg mt-4"
            onClick={repay}
            disabled={(amount === 0 && collateralAmount === 0) || loading}
          >
            {loading ? <span className="fa fa-spin fa-spinner" /> : "Confirm"}
          </button>
        </div>
      </div>
    </>
  )
}

export default RepayActivity