import React from "react";
import useSWR from 'swr';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import FtsoABI from "@trustline-inc/probity/artifacts/contracts/mocks/MockFtso.sol/MockFtso.json";
import { utils } from "ethers";
import numbro from "numbro";
import { FTSO } from '../../constants';
import fetcher from "../../fetcher";

function PriceFeed({ asset, collateralAmount }: { asset: string, collateralAmount: number; }) {
  const { library } = useWeb3React<Web3Provider>()
  const [collateralPrice, setCollateralPrice] = React.useState(0.00);
  const [collateralValue, setCollateralValue] = React.useState(0.00);

  const { data, mutate: mutatePrice } = useSWR([FTSO, 'getCurrentPrice'], {
    fetcher: fetcher(library, FtsoABI.abi),
  })

  // Start listening to price feed
  React.useEffect(() => {
    const runEffect = async () => {
      if (data !== undefined) {
        setCollateralPrice((Number(utils.formatUnits(String(data._price), 5))));
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
          <div className="mx-4"><span className="text-muted">{asset}/USD</span><br />${collateralPrice}</div>
          <div className="mx-4"><span className="text-muted">Value</span><br />${numbro(Math.abs(collateralValue).toFixed(2)).format({ thousandSeparated: true })}</div>
        </div>
      </div>
    </div>
  );
}

export default PriceFeed;
