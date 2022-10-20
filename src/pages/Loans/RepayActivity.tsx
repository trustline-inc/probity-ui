import React from "react"
import numbro from "numbro"
import NumberFormat from 'react-number-format';
import { RAD } from "../../constants"
import PriceFeed from "../../components/PriceFeed"
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap"
import { getNativeTokenSymbol } from "../../utils"
import { useWeb3React } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import AssetSelector from "../../components/AssetSelector";

interface Props {
  collateralRatio: number;
  collateralAmount: number;
  amount: number;
  rate: number;
  loading: boolean;
  repay: () => void;
  onAmountChange: (value: string) => void;
  onCollateralAmountChange: (value: string) => void;
  collateralInUse: string;
  repayFullAmount: boolean;
  setRepayFullAmount: (value: boolean) => void;
  vault: any;
  debtAccumulator: any;
}

function RepayActivity({
  repay,
  loading,
  amount,
  collateralRatio,
  collateralAmount,
  onAmountChange,
  onCollateralAmountChange,
  collateralInUse,
  repayFullAmount,
  setRepayFullAmount,
  vault,
  debtAccumulator
}: Props) {
  const { chainId } = useWeb3React<Web3Provider>()
  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const onSelect = () => {
    setShow(false)
  }
  const nativeTokenSymbol = getNativeTokenSymbol(chainId!)
  const currentAsset = process.env.REACT_APP_NATIVE_TOKEN!

  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      Feature coming soon
    </Tooltip>
  );

  const handleOnChange = () => {
    if (!repayFullAmount) {
      console.log("onChange:", vault.normDebt.mul(debtAccumulator).div(RAD).toString())
      onAmountChange(vault.normDebt.mul(debtAccumulator).div(RAD).toString())
      console.log("collateralInUse", collateralInUse)
      onCollateralAmountChange(collateralInUse)
    } else {
      onAmountChange("0")
      onCollateralAmountChange("0")
    }
    setRepayFullAmount(!repayFullAmount)
  }

  return (
    <>
      <AssetSelector nativeTokenSymbol={nativeTokenSymbol} show={show} onSelect={onSelect} handleClose={handleClose} />
      {!repayFullAmount && (
        <>
          <label className="form-label">
            Amount<br/>
            <small className="form-text text-muted">
              Size of the repayment
            </small>
          </label>
          <div className="input-group">
            <NumberFormat
              disabled={repayFullAmount}
              min="0.000000000000000000"
              className="form-control"
              placeholder="0.000000000000000000"
              thousandSeparator={true}
              onChange={(event: any) => onAmountChange(event.target.value)}
              value={amount === 0 ? "" : numbro(amount).format({ thousandSeparated: true })}
            />
            <span className="input-group-text font-monospace">USD</span>
          </div>
          <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
          >
            <Form.Group controlId="repay-full-amount" className="mt-2">
              <Form.Check type="checkbox" label="Repay Full Amount" checked={repayFullAmount} onChange={handleOnChange} disabled />
            </Form.Group>
          </OverlayTrigger>
          <br/>
          <label className="form-label">
            Collateral<br/>
            <small className="form-text text-muted">
              Amount of collateral to recover
            </small>
          </label>
          <div className="input-group mb-3">
            <NumberFormat
              disabled={repayFullAmount}
              min="0.000000000000000000"
              className="form-control"
              placeholder="0.000000000000000000"
              thousandSeparator={true}
              onChange={(event: any) => onCollateralAmountChange(event.target.value)}
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
          <PriceFeed asset={currentAsset} amount={collateralAmount} />
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
      )}
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