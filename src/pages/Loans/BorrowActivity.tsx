import React from "react"
import useSWR from 'swr';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import PriceFeed from "../../components/PriceFeed";
import { utils } from "ethers";
import fetcher from "../../fetcher";
import { TELLER_ADDRESS } from '../../constants';
import TellerABI from "@trustline-inc/aurei/artifacts/contracts/Teller.sol/Teller.json";

interface Props {
  collateralRatio: number;
  collateralAmount: number;
  aureiAmount: number;
  rate: any;
  onAureiAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCollateralAmountChange: (event: React.ChangeEvent<HTMLInputElement>, adjustment: boolean) => void;
}

function BorrowActivity({
  collateralRatio,
  collateralAmount,
  aureiAmount,
  rate,
  onAureiAmountChange,
  onCollateralAmountChange
}: Props) {
  const { library } = useWeb3React<Web3Provider>()
  const [estimatedAPR, setEstimatedAPR] = React.useState(rate)

  const { data: utilization } = useSWR([TELLER_ADDRESS, 'getUtilization'], {
    fetcher: fetcher(library, TellerABI.abi),
  })

  React.useEffect(() => {
    if (utilization) {
      const borrows = Number(utils.formatEther(utilization[0].toString()));
      const supply = Number(utils.formatEther(utilization[1].toString()));
      const newBorrows = borrows + Number(aureiAmount);
      const newUtilization = (newBorrows / supply);
      const newAPR = (((1 / ((1 - newUtilization))) - 1) * 100) + 1
      setEstimatedAPR(newAPR.toFixed(2))
    }
  }, [rate, aureiAmount, utilization])

  return (
    <>
      <label className="form-label">
        Amount<br/>
        <small className="form-text text-muted">
          Size of the loan
        </small>
      </label>
      <div className="input-group">
        <input type="number" min="0.000000000000000000" placeholder="0.000000000000000000" className="form-control" onChange={onAureiAmountChange} />
        <span className="input-group-text font-monospace">{"AUR"}</span>
      </div>
      <div className="row pt-3 pb-1">
        <div className="col-12">
          <div className="h-100 d-flex flex-row align-items-center justify-content-center text-center">
            <div className="m-2">
              <span className="text-muted">Estimated APR</span>
              <br />
              {rate && (
                aureiAmount ? (
                  estimatedAPR
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
        <input type="number" min="0.000000000000000000" placeholder="0.000000000000000000" className="form-control" onChange={(event) => {
           onCollateralAmountChange(event, false) }} />
        <span className="input-group-text font-monospace">{"FLR"}</span>
      </div>
      <PriceFeed collateralAmount={collateralAmount} />
      <div className="row">
        <div className="col-12">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
            <div className="m-2"><span>Collateral Ratio:</span><br />{collateralRatio ? `${(collateralRatio * 100).toFixed(2)}%` : <small className="text-muted">N/A</small>}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BorrowActivity