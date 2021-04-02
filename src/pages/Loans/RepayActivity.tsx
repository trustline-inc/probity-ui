import React from "react"

interface Props {
  debtBalance: number;
  equityBalance: number;
  collateralRatio: number;
  aureiAmount: number;
}

function RepayActivity({
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
            <div className="m-2"><span className="text-muted h6">New Coll. Ratio</span><br />{collateralRatio ? `${(collateralRatio * 100).toFixed(2)}%` : null}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RepayActivity