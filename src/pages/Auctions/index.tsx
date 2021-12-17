import { useEffect, useState, useContext } from "react";
import { utils } from "ethers";
import Activity from "../../containers/Activity";
import { FTSO, LIQUIDATOR, VAULT_ENGINE, INTERFACES, RAY } from '../../constants';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from "ethers";
import { Activity as ActivityType } from "../../types";
import numeral from "numeral";
import web3 from "web3";
import EventContext from "../../contexts/TransactionContext"
import { getNativeTokenSymbol, getStablecoinSymbol } from "../../utils";

function Auctions({ collateralPrice }: { collateralPrice: number }) {
  const [loading, setLoading] = useState(false);
  const [auctions, setAuctions] = useState([]);
  const { library, active, chainId } = useWeb3React<Web3Provider>()
  const [error, setError] = useState<any|null>(null);
  const ctx = useContext(EventContext)

  return (
    <Activity active={active} activity={ActivityType.Liquidate} error={error}>
      <h4>Auctions</h4>
      {
        loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            Loading...
          </div>
        ) : auctions.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            No auctions running
          </div>
        ) : auctions
      }
    </Activity>
  )
}

export default Auctions;