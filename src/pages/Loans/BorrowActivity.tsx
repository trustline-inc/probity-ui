import React from "react"
import { utils } from "ethers";

interface Props {
  debtBalance: number;
  equityBalance: number;
  collateralRatio: number;
  aureiAmount: number;
}

function BorrowActivity({
  debtBalance,
  equityBalance,
  collateralRatio,
  aureiAmount
}: Props) {
  return (
    <>
      <div className="row">
        <div className="col-6 offset-3">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center">
            <div className="m-2"><span className="text-muted h6">Coll. Ratio</span><br />{collateralRatio ? `${(collateralRatio * 100).toFixed(2)}%` : null}</div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-6 offset-3">
          <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center">
            <div className="m-2"><span className="text-muted h6">Current APR</span><br />
            {
              debtBalance && equityBalance ? (
                1 / (1 - ((Number(aureiAmount) + Number(utils.formatEther(debtBalance.toString()))) / Number(utils.formatEther(equityBalance.toString()))))
              ) : null
            }
            %</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BorrowActivity