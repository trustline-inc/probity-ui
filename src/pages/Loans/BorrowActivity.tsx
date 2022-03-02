import React from "react"
import useSWR from 'swr';
import numbro from "numbro";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import PriceFeed from "../../components/PriceFeed";
import { utils } from "ethers";
import fetcher from "../../fetcher";
import { RAY, VAULT_ENGINE } from '../../constants';
import VaultEngineABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngine.sol/VaultEngine.json";
import { getNativeTokenSymbol, getStablecoinSymbol } from "../../utils";
import AssetSelector from "../../components/AssetSelector";
import AssetContext from "../../contexts/AssetContext"
import NumberFormat from "react-number-format";

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
  const ctx = React.useContext(AssetContext)
  const { library, chainId } = useWeb3React<Web3Provider>()
  const [estimatedAPR, setEstimatedAPR] = React.useState(rate)

  const { data: totalDebt } = useSWR([VAULT_ENGINE, "totalDebt"], {
    fetcher: fetcher(library, VaultEngineABI.abi),
  })
  const { data: totalEquity } = useSWR([VAULT_ENGINE, "totalEquity"], {
    fetcher: fetcher(library, VaultEngineABI.abi),
  })

  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const onSelect = () => {
    setShow(false)
  }
  const nativeTokenSymbol = getNativeTokenSymbol(chainId!)
  const currentAsset = ctx.asset || nativeTokenSymbol

  React.useEffect(() => {
    if (totalDebt && totalEquity) {
      try {
        const borrows = Number(utils.formatEther(totalDebt.div(RAY)));
        const supply = Number(utils.formatEther(totalEquity.div(RAY)));
        const newBorrows = borrows + Number(amount);
        const newUtilization = (newBorrows / supply);
        if (newUtilization >= 1) setEstimatedAPR(100)
        else {
          const newAPR = ((1 / (100 * (1 - newUtilization)))) * 100
          setEstimatedAPR((Math.ceil(newAPR / 0.25) * 0.25).toFixed(2))
        }
        setMaxSize(supply - borrows)
      } catch(e) {
        console.log(e)
      }
    }
  }, [rate, amount, totalDebt, totalEquity, setMaxSize])

  return (
    <>
      <AssetSelector nativeTokenSymbol={nativeTokenSymbol} show={show} onSelect={onSelect} handleClose={handleClose} />
      <label className="form-label">
        Amount<br/>
        <small className="form-text text-muted">
          Size of the loan
        </small>
      </label>
      <div className="input-group">
        <NumberFormat
          min="0.000000000000000000"
          className="form-control"
          placeholder="0.000000000000000000"
          thousandSeparator={true}
          max={maxSize}
          onChange={onAmountChange}
          value={amount === 0 ? "" : numbro(amount).format({ thousandSeparated: true })}
        />
        <span className="input-group-text font-monospace">{getStablecoinSymbol(chainId!)}</span>
      </div>
      <div className="row pt-3 pb-1">
        <div className="col-12">
          <div className="h-100 d-flex flex-row align-items-center justify-content-center text-center">
            <div className="m-2">
              <span className="text-muted">Estimated APR</span>
              <br />
              {rate && (amount ? estimatedAPR : utils.formatEther(rate.div("10000000").toString().slice(2)))}%
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
      <PriceFeed asset={currentAsset} amount={collateralAmount} />
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
            disabled={(amount === 0 && collateralAmount === 0) || loading}
          >
            {loading ? <span className="fa fa-spin fa-spinner" /> : "Confirm"}
          </button>
        </div>
      </div>
    </>
  )
}

export default BorrowActivity