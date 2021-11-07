import React from "react";
import useSWR from 'swr';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import FtsoABI from "@trustline/probity/artifacts/contracts/mocks/MockFtso.sol/MockFtso.json";
import { utils } from "ethers";
import { FTSO } from '../../constants';
import fetcher from "../../fetcher";
import { getNativeTokenSymbol } from "../../utils";

function PriceFeed({ collateralAmount }: { collateralAmount: number; }) {
  const { library, chainId } = useWeb3React<Web3Provider>()
  const [collateralPrice, setCollateralPrice] = React.useState(0.00);
  const [collateralValue, setCollateralValue] = React.useState(0.00);

  const { data, mutate: mutatePrice } = useSWR([FTSO, 'getCurrentPrice'], {
    fetcher: fetcher(library, FtsoABI.abi),
  })

  // Start listening to price feed
  React.useEffect(() => {
    const runEffect = async () => {
      if (data !== undefined) {
        setCollateralPrice((Number(utils.formatEther(data._price.toString()).toString()) / 1e9));
      }
    }
    runEffect();
  }, [data]);

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
          <div className="mx-4"><span className="text-muted">{getNativeTokenSymbol(chainId!)}/USD</span><br />${collateralPrice}</div>
          <div className="mx-4"><span className="text-muted">Value</span><br />${Math.abs(collateralValue).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

export default PriceFeed;
