import React from "react";

function PriceFeed({ collateralAmount }: { collateralAmount: number; }) {
  const [collateralPrice, setCollateralPrice] = React.useState(0.00);
  const [collateralValue, setCollateralValue] = React.useState(0.00);

  // Start listening to price feed
  React.useEffect(() => {
    const runEffect = async () => {
      // TODO: Fetch live price
      setCollateralPrice(1.00);
    }
    runEffect();
  }, []);

  // Set collateral value when collateral price changes
  React.useEffect(() => {
    setCollateralValue((collateralPrice * collateralAmount));
  }, [collateralPrice, collateralAmount]);


  return (
    <div className="row">
      <div className="col-12">
        <div className="py-2 h-100 d-flex flex-row align-items-center justify-content-center text-center">
          <div className="mx-4"><span className="text-muted">FLR/USD</span><br />${collateralPrice}</div>
          <div className="mx-4"><span className="text-muted">Value</span><br />${Math.abs(collateralValue).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

export default PriceFeed;
