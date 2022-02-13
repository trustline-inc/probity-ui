import { useWeb3React } from "@web3-react/core"
import React from "react"
import numbro from "numbro"
import NumberFormat from "react-number-format"
import { getStablecoinName, getStablecoinSymbol } from "../../utils"

interface Props {
  amount: number;
  onAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  deposit: (amount: number) => void;
  loading: boolean;
  maxSize: number;
  setMaxSize: (maxSize: number) => void;
}

function DepositActivity({
  amount,
  onAmountChange,
  deposit,
  loading,
  maxSize,
}: Props) {
  const { chainId } = useWeb3React()

  return (
    <>
      <div className="row">
        <div className="col-12 mb-4">
          <label htmlFor="collateralConversionInput" className="form-label">
            Deposit Amount<br/>
            <small className="form-text text-muted">
              Amount of ERC20 {getStablecoinName(chainId!)} to deposit
            </small>
          </label>
          <div className="input-group">
            <NumberFormat
              min={0}
              className="form-control"
              id="amountInput"
              placeholder="0.000000000000000000"
              thousandSeparator={true}
              onChange={onAmountChange}
              value={amount === 0 ? "" : numbro(amount).format({ thousandSeparated: true })}
            />
            <span className="input-group-text font-monospace">{getStablecoinSymbol(chainId!)}</span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4 d-grid">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => { deposit(amount) }}
            disabled={amount === 0 || loading}
          >
            {loading ? <i className="fa fa-spin fa-spinner" /> : "Confirm" }
          </button>
        </div>
      </div>
    </>
  )
}

export default DepositActivity