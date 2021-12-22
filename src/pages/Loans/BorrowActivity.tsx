import React from "react"
import useSWR from 'swr';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import PriceFeed from "../../components/PriceFeed";
import { utils } from "ethers";
import fetcher from "../../fetcher";
import { RAY, VAULT_ENGINE } from '../../constants';
import VaultEngineABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngine.sol/VaultEngine.json";
import { getNativeTokenSymbol, getStablecoinSymbol } from "../../utils";

interface Props {
  collateralRatio: number;
  collateralAmount: number;
  amount: number;
  rate: any;
  borrow: () => void;
  loading: boolean;
  maxSize: number;
  setMaxSize: (maxSize: number) => void;
  onAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCollateralAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function BorrowActivity({
  collateralRatio,
  collateralAmount,
  amount,
  rate,
  loading,
  borrow,
  maxSize,
  setMaxSize,
  onAmountChange,
  onCollateralAmountChange
}: Props) {
  const { library } = useWeb3React<Web3Provider>()
  const [estimatedAPR, setEstimatedAPR] = React.useState(rate)

  const { data: totalDebt } = useSWR([VAULT_ENGINE, "totalDebt"], {
    fetcher: fetcher(library, VaultEngineABI.abi),
  })
  const { data: totalCapital } = useSWR([VAULT_ENGINE, "totalCapital"], {
    fetcher: fetcher(library, VaultEngineABI.abi),
  })

  React.useEffect(() => {
    if (totalDebt && totalCapital) {
      try {
        const borrows = Number(utils.formatEther(totalDebt.div(RAY)));
        const supply = Number(utils.formatEther(totalCapital.div(RAY)));
        const newBorrows = borrows + Number(amount);
        const newUtilization = (newBorrows / supply);
        const newAPR = ((1 / (100 * (1 - newUtilization)))) * 100
        setEstimatedAPR((Math.ceil(newAPR / 0.25) * 0.25).toFixed(2))
        setMaxSize(supply - borrows)
      } catch(e) {
        console.log(e)
      }
    }
  }, [rate, amount, totalDebt, totalCapital, setMaxSize])

  const { chainId } = useWeb3React<Web3Provider>()

  return (
    <>
      <label className="form-label">
        Amount<br/>
        <small className="form-text text-muted">
          Size of the loan
        </small>
      </label>
      <div className="input-group">
        <input
          type="number"
          min="0.000000000000000000"
          max={maxSize}
          placeholder="0.000000000000000000"
          className="form-control"
          onChange={onAmountChange} />
        <span className="input-group-text font-monospace">{getStablecoinSymbol(chainId!)}</span>
      </div>
      <div className="row pt-3 pb-1">
        <div className="col-12">
          <div className="h-100 d-flex flex-row align-items-center justify-content-center text-center">
            <div className="m-2">
              <span className="text-muted">Estimated APR</span>
              <br />
              {rate && (
                amount ? (
                  Math.min(estimatedAPR, 100)
                ) : utils.formatEther(rate.div("10000000").toString().slice(2))
              )}%
            </div>
          </div>
        </div>
      </div>
      <label className="form-label">
        Collateral<br/>
        <small className="form-text text-muted">
          Amount of collateral to lock
        </small>
      </label>
      <div className="input-group mb-3">
        <input
          type="number"
          min="0.000000000000000000"
          placeholder="0.000000000000000000"
          className="form-control"
          onChange={(event) => {
            onCollateralAmountChange(event)
          }}
        />
        <span className="input-group-text font-monospace">{getNativeTokenSymbol(chainId!)}</span>
      </div>
      <PriceFeed collateralAmount={collateralAmount} />
      <div className="row">
        <div className="col-12">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
            <div className="m-2"><span>Collateral Ratio:</span><br />{collateralRatio ? `${(collateralRatio * 100).toFixed(2)}%` : <small className="text-muted">N/A</small>}</div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-4 d-grid">
          <button
            className="btn btn-primary btn-lg mt-4"
            onClick={borrow}
            disabled={amount === 0 || collateralAmount === 0 || loading}
          >
            {loading ? <span className="fa fa-spin fa-spinner" /> : "Confirm"}
          </button>
        </div>
      </div>
    </>
  )
}

export default BorrowActivity