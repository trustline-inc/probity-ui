import React from "react"
import numbro from "numbro"
import { useWeb3React } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import NumberFormat from "react-number-format"
import PriceFeed from "../../components/PriceFeed";
import { getNativeTokenSymbol } from "../../utils";
import AssetSelector from "../../components/AssetSelector";
import AssetContext from "../../contexts/AssetContext"

interface Props {
  collateralAmount: number;
  onCollateralAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  deposit: () => void;
}

function DepositActivity({
  collateralAmount,
  onCollateralAmountChange,
  loading,
  deposit
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
          <label htmlFor="collateralConversionInput" className="form-label">
            Amount<br/>
            <small className="form-text text-muted">
              The amount of {currentAsset} to deposit
            </small>
          </label>
          <div className="input-group">
            <NumberFormat
              min={0}
              className="form-control"
              id="collateralConversionInput"
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
        </div>
      </div>
      <PriceFeed collateralAmount={collateralAmount} asset={currentAsset} />
      <div className="row">
        <div className="col-12 mt-4 d-grid">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={deposit}
            disabled={collateralAmount === 0 || loading}
          >
            {loading ? <span className="fa fa-spin fa-spinner" /> : "Confirm"}
          </button>
        </div>
      </div>
    </>
  )
}

export default DepositActivity