import React from "react"
import numbro from "numbro"
import NumberFormat from "react-number-format"

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
  return (
    <>
      {/* <div className="row">
        <div className="col-12">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
            <div className="m-2">
              <span>Token Type</span><br/>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="interestType" id="PBT" value="PBT" checked={interestType === "PBT"} onChange={() => { setInterestType("PBT") }} />
                <label className="form-check-label" htmlFor="PBT">PBT</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="interestType" id="USD" value="USD" checked={interestType === "USD"} onChange={() => { setInterestType("USD") }} />
                <label className="form-check-label" htmlFor="USD">USD</label>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="row">
        <div className="col-12 mb-4">
          <label htmlFor="collateralConversionInput" className="form-label">
            Amount<br/>
            <small className="form-text text-muted">
              The amount of interest to collect
            </small>
          </label>
          <div className="input-group">
            <NumberFormat
              min={0}
              className="form-control"
              id="interestAmountInput"
              placeholder="0.000000000000000000"
              thousandSeparator={true}
              onChange={onInterestAmountChange}
              value={interestAmount === 0 ? "" : numbro(interestAmount).format({ thousandSeparated: true })}
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