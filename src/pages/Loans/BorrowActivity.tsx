import React from "react"
import { utils } from "ethers";

interface Props {
  collateralRatio: number;
  rate: any;
}

function BorrowActivity({ collateralRatio, rate }: Props) {
  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
            <div className="m-2"><span className="text-muted h6">Coll. Ratio</span><br />{collateralRatio ? `${(collateralRatio * 100).toFixed(2)}%` : null}</div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center">
            <div className="m-2"><span className="text-muted h6">Current APR</span><br />{rate && utils.formatEther(rate.div("10000000").toString().slice(2))}%</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BorrowActivity