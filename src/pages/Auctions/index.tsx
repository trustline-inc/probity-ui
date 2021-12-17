import { useEffect, useState, useContext } from "react";
import { utils } from "ethers";
import Activity from "../../containers/Activity";
import { AUCTIONEER, INTERFACES, RESERVE_POOL } from '../../constants';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from "ethers";
import { Activity as ActivityType } from "../../types";
import numeral from "numeral";
import web3 from "web3";
import EventContext from "../../contexts/TransactionContext"
import { getCollateralId } from "../../utils";

function Auctions({ collateralPrice }: { collateralPrice: number }) {
  const [loading, setLoading] = useState(false);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [auctionCount, setAuctionCount] = useState(0)
  const { library, active, chainId } = useWeb3React<Web3Provider>()
  const [error, setError] = useState<any|null>(null);
  const ctx = useContext(EventContext)

  useEffect(() => {
    if (library) {
      (async () => {
        const auctioneer = new Contract(AUCTIONEER, INTERFACES[AUCTIONEER].abi, library.getSigner())
        const _auctionCount = await auctioneer.auctionCount()
        console.log("_auctionCount", _auctionCount.toString())
        setAuctionCount(_auctionCount);
      })()
    }
  }, [library])

  useEffect(() => {
    if (library && auctionCount) {
      (async () => {
        const auctioneer = new Contract(AUCTIONEER, INTERFACES[AUCTIONEER].abi, library.getSigner())
        const _auctions = []
        for (let i = 0; i < auctionCount; i++) {
          const auction: any = await auctioneer.auctions(i)
          _auctions.push(auction)
        }
        console.log(_auctions)
        setAuctions(_auctions);
      })()
    }
  }, [library, auctionCount])

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
        ) : 
          <>
            <div className="alert alert-info">
              <code>{RESERVE_POOL}</code> is the Reserve Pool's address.
            </div>
            {auctions.map((auction: any) => {
              return (
                <pre>
                  {
                    JSON.stringify({
                      beneficiary: auction?.beneficiary,
                      collId: getCollateralId(auction?.collId),
                      debt: auction?.debt?.toString(),
                      isOver: auction?.isOver,
                      lot: auction?.lot?.toString(),
                      owner: auction?.owner,
                      startPrice: auction?.startPrice?.toString(),
                      startTime: auction?.startTime?.toString()
                    }, null, 2)
                  }
                </pre>
              )
            })}
        </>
      }
    </Activity>
  )
}

export default Auctions;