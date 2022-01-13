import { useWeb3React } from "@web3-react/core"
import React from "react"
import { getStablecoinSymbol } from "../../utils"

interface Props {
  interestAmount: number;
  onInterestAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  collect: (amount: number) => void;
  loading: boolean;
  setInterestType: (type: string) => void;
  interestType: string;
}

function CollectActivity({
  interestAmount,
  onInterestAmountChange,
  collect,
  loading,
  setInterestType,
  interestType
}: Props) {
  const { chainId } = useWeb3React()

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
            <div className="m-2">
              <span>Token Type</span><br/>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="interestType" id="PBT" value="PBT" checked={interestType === "PBT"} onChange={() => { setInterestType("PBT") }} />
                <label className="form-check-label" htmlFor="PBT">PBT</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="interestType" id={getStablecoinSymbol(chainId!)} value={getStablecoinSymbol(chainId!)} checked={interestType === getStablecoinSymbol(chainId!)} onChange={() => { setInterestType(getStablecoinSymbol(chainId!)) }} />
                <label className="form-check-label" htmlFor={getStablecoinSymbol(chainId!)}>{getStablecoinSymbol(chainId!)}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mb-4">
          <label htmlFor="collateralConversionInput" className="form-label">
            Amount<br/>
            <small className="form-text text-muted">
              The amount of interest to collect
            </small>
          </label>
          <div className="input-group">
            <input
              type="number"
              min={0}
              className="form-control"
              id="interestAmountInput"
              placeholder="0.000000000000000000"
              onChange={onInterestAmountChange}
            />
            <span className="input-group-text font-monospace">{interestType}</span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4 d-grid">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => { collect(interestAmount) }}
            disabled={interestAmount === 0 || loading}
          >
            {loading ? <span className="fa fa-spin fa-spinner" /> : "Confirm"}
          </button>
        </div>
      </div>
    </>
  )
}

export default CollectActivity