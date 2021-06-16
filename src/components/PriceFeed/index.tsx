import React from "react";
import useSWR from 'swr';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import FtsoABI from "@trustline-inc/aurei/artifacts/contracts/Ftso.sol/Ftso.json";
import { FTSO_ADDRESS } from '../../constants';
import fetcher from "../../fetcher";

function PriceFeed({ collateralAmount }: { collateralAmount: number; }) {
  const { library } = useWeb3React<Web3Provider>()
  const [collateralPrice, setCollateralPrice] = React.useState(0.00);
  const [collateralValue, setCollateralValue] = React.useState(0.00);

  const { data: price, mutate: mutatePrice } = useSWR([FTSO_ADDRESS, 'getPrice'], {
    fetcher: fetcher(library, FtsoABI.abi),
  })

  // Start listening to price feed
  React.useEffect(() => {
    const runEffect = async () => {
      if (price !== undefined) {
        setCollateralPrice(price.toNumber() / 100);
      }
    }
    runEffect();
  }, [price]);

  React.useEffect(() => {
    if (library) {
      library.on("block", () => {
        mutatePrice(undefined, true);
      });

      return () => {
        library.removeAllListeners("block");
      };
    }
  });

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
