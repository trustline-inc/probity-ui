import React from "react";
import useSWR from 'swr';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import PriceFeedABI from "@trustline-inc/probity/artifacts/contracts/mocks/MockPriceFeed.sol/MockPriceFeed.json";
import { utils } from "ethers";
import numbro from "numbro";
import { PRICE_FEED } from '../../constants';
import fetcher from "../../fetcher";

function PriceFeed({ asset, amount }: { asset: string, amount: number; }) {
  const { library } = useWeb3React<Web3Provider>()
  const [price, setPrice] = React.useState(0.00);
  const [value, setValue] = React.useState(0.00);

  const { data: _price, mutate: mutatePrice } = useSWR([PRICE_FEED, 'getPrice', utils.id(asset)], {
    fetcher: fetcher(library, PriceFeedABI.abi),
  })

  // Start listening to price feed
  React.useEffect(() => {
    const runEffect = async () => {
      if (_price !== undefined) {
        setPrice((Number(utils.formatUnits(String(_price), 27))));
      }
    }
    runEffect();
  }, [_price]);

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
    setValue((price * amount));
  }, [price, amount]);


  return (
    <div className="row">
      <div className="col-12">
        <div className="py-2 h-100 d-flex flex-row align-items-center justify-content-center text-center">
          <div className="mx-4"><span className="text-muted">{asset}/USD</span><br />${price}</div>
          <div className="mx-4">
            <span className="text-muted">Value</span>
            <br />
            ${numbro(Math.abs(value).toFixed(2)).format({ thousandSeparated: true })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceFeed;
