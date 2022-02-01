import React from "react"
import { useWeb3React } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import PriceFeed from "../../components/PriceFeed";
import { getNativeTokenSymbol } from "../../utils";
import AssetSelector from "../../components/AssetSelector";
import AssetContext from "../../contexts/AssetContext"

interface Props {
  collateralAmount: number;
  onCollateralAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  withdraw: () => void;
  loading: boolean;
}

function WithdrawActivity({
  collateralAmount,
  onCollateralAmountChange,
  withdraw,
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
          <label htmlFor="collateralRedemptionAmount" className="form-label">
            Amount<br/>
            <small className="form-text text-muted">
              The amount of {currentAsset} to withdraw
            </small>
          </label>
          <div className="input-group">
            <input
              type="number"
              min={0}
              className="form-control"
              id="collateralRedemptionAmount"
              placeholder="0.000000000000000000"
              onChange={onCollateralAmountChange}
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
      <PriceFeed asset={currentAsset} collateralAmount={collateralAmount} />
      <div className="row">
        <div className="col-12 mt-4 d-grid">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={withdraw}
            disabled={collateralAmount === 0 || loading}
          >
            {loading ? <span className="fa fa-spin fa-spinner" /> : "Confirm"}
          </button>
        </div>
      </div>
    </>
  )
}

export default WithdrawActivity