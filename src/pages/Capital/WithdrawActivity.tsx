import React from "react"

interface Props {
  interestAmount: number;
  onInterestAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  withdraw: (amount: number) => void;
  setInterestType: (type: string) => void;
  interestType: string;
}

function WithdrawActivity({
  interestAmount,
  onInterestAmountChange,
  withdraw,
  setInterestType,
  interestType
}: Props) {
  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
            <div className="m-2">
              <span>Token Type</span><br/>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="interestType" id="TCN" value="TCN" checked={interestType === "TCN"} onClick={() => { setInterestType("TCN") }} />
                <label className="form-check-label" htmlFor="TCN">TCN</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="interestType" id="AUR" value="AUR" checked={interestType === "AUR"} onClick={() => { setInterestType("AUR") }} />
                <label className="form-check-label" htmlFor="AUR">AUR</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mb-4">
          <label htmlFor="collateralConversionInput" className="form-label">
            Interest<br/>
            <small className="form-text text-muted">
              Amount of interest to withdraw
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
            <span className="input-group-text font-monospace">{"TCN"}</span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4 d-grid">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => { withdraw(interestAmount) }}
            disabled={interestAmount === 0}
          >Confirm</button>
        </div>
      </div>
    </>
  )
}

export default WithdrawActivity