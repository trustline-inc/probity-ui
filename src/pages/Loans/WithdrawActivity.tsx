import React from "react"

interface Props {
  aureiAmount: number;
  onAureiAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  withdraw: (amount: number) => void;
  loading: boolean;
  maxSize: number;
  setMaxSize: (maxSize: number) => void;
}

function WithdrawActivity({
  aureiAmount,
  onAureiAmountChange,
  withdraw,
  loading,
  maxSize,
}: Props) {
  return (
    <>
      <div className="row">
        <div className="col-12 mb-4">
          <label htmlFor="collateralConversionInput" className="form-label">
            Aurei<br/>
            <small className="form-text text-muted">
              Amount of Aurei to withdraw
            </small>
          </label>
          <div className="input-group">
            <input
              type="number"
              min={0}
              className="form-control"
              id="aureiAmountInput"
              max={maxSize}
              placeholder="0.000000000000000000"
              onChange={onAureiAmountChange}
            />
            <span className="input-group-text font-monospace">AUR</span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4 d-grid">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => { withdraw(aureiAmount) }}
            disabled={aureiAmount === 0 || loading}
          >
            {loading ? <i className="fa fa-spin fa-spinner" /> : "Confirm" }
          </button>
        </div>
      </div>
    </>
  )
}

export default WithdrawActivity