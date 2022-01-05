import { useEffect, useState, useContext } from "react";
import { BigNumber, utils } from "ethers";
import Activity from "../../containers/Activity";
import { AUCTIONEER, INTERFACES, RESERVE_POOL, RAY, WAD } from '../../constants';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from "ethers";
import { Activity as ActivityType } from "../../types";
// import EventContext from "../../contexts/TransactionContext"
import { getCollateralId, getStablecoinSymbol } from "../../utils";

function Auctions({ collateralPrice }: { collateralPrice: number }) {
  const [loading, setLoading] = useState(false);
  const [metamaskLoading, setMetamaskLoading] = useState(false)
  const [bidPrice, setBidPrice] = useState<number>(0.00)
  const [bidLot, setBidLot] = useState<number>(0.00)
  const [lot, setLot] = useState<number>(0.00)
  const [maxPrice, setMaxPrice] = useState<number>(0.00)
  const [auctions, setAuctions] = useState<any[]>([]);
  const [auctionCount, setAuctionCount] = useState(0)
  const { library, active, chainId } = useWeb3React<Web3Provider>()
  const [error, setError] = useState<any|null>(null);
  // const ctx = useContext(EventContext)

  useEffect(() => {
    if (library) {
      (async () => {
        setLoading(true)
        const auctioneer = new Contract(AUCTIONEER, INTERFACES[AUCTIONEER].abi, library.getSigner())
        const _auctionCount = await auctioneer.auctionCount()
        console.log("_auctionCount", _auctionCount.toString())
        setAuctionCount(_auctionCount);
        setLoading(false)
      })()
    }
  }, [library])

  useEffect(() => {
    if (library && auctionCount) {
      (async () => {
        setLoading(true)
        const auctioneer = new Contract(AUCTIONEER, INTERFACES[AUCTIONEER].abi, library.getSigner())
        const _auctions = []
        for (let id = 0; id < auctionCount; id++) {
          let auction: any = await auctioneer.auctions(id)
          const HEAD = "0x0000000000000000000000000000000000000001"
          let _nextHighestBidder = await auctioneer.nextHighestBidder(id, HEAD)
          let highestBid
          if (_nextHighestBidder === "0x0000000000000000000000000000000000000000") {
            highestBid = null
          } else {
            highestBid = await auctioneer.bids(id, _nextHighestBidder)
          }
          console.log("highestBid", highestBid)
          _auctions.push({ ...auction, id, highestBid })
        }
        console.log(_auctions)
        setAuctions(_auctions);
        setLoading(false)
      })()
    }
  }, [library, auctionCount])

  const onChangeBidPrice = (event: any) => {
    const { value } = event.target
    setBidPrice(value)
  }

  const onChangeBidLot = (event: any) => {
    const { value } = event.target
    setBidLot(value)
  }

  const onChangeMaxPrice = (event: any) => {
    const { value } = event.target
    setMaxPrice(value)
  }

  const onChangeLot = (event: any) => {
    const { value } = event.target
    setLot(value)
  }

  const placeBid = async (auctionId: number) => {
    try {
      console.log("placing bid:", bidPrice)
      const auctioneer = new Contract(AUCTIONEER, INTERFACES[AUCTIONEER].abi, library!.getSigner())
      const bidLot = 0
      const tx = await auctioneer.placeBid(auctionId, bidPrice, bidLot)
      setMetamaskLoading(true)
      await tx.wait()
      setMetamaskLoading(false)
    } catch (error) {
      console.log(error)
      setError(error)
    }
  }

  const buyNow = async (auctionId: number, lot: number, maxPrice: number) => {
    try {
      const auctioneer = new Contract(AUCTIONEER, INTERFACES[AUCTIONEER].abi, library!.getSigner())
      const tx = await auctioneer.buyItNow(
        auctionId,
        BigNumber.from(lot).mul(WAD),
        BigNumber.from(maxPrice).mul(RAY)
      )
      setMetamaskLoading(true)
      await tx.wait()
      setMetamaskLoading(false)
    } catch (error) {
      console.log(error)
      setError(error)
    }
  }

  const finalizeSale = async (auctionId: number) => {
    try {
      console.log("finalizing sale")
      const auctioneer = new Contract(AUCTIONEER, INTERFACES[AUCTIONEER].abi, library!.getSigner())
      const tx = await auctioneer.finalizeSale(auctionId)
      setMetamaskLoading(true)
      await tx.wait()
      setMetamaskLoading(false)
    } catch (error) {
      console.log(error)
      setError(error)
    }
  }

  return (
    <Activity active={active} activity={ActivityType.Auction} error={error}>
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
            {auctions.map((auction: any, index: number) => {
              const collId = getCollateralId(auction?.collId)
              return (
                <div className="card my-3" key={index}>
                  <div className="card-body">
                    <h6>Details</h6>
                    <div className="row">
                      <div className="col-8">
                        <pre className="mt-3">
                          {
                            JSON.stringify({
                              beneficiary: auction?.beneficiary,
                              collId,
                              debt: utils.formatEther(auction?.debt?.div(RAY)).toString(),
                              isOver: auction?.isOver,
                              lot: utils.formatEther(auction?.lot)?.toString(),
                              owner: auction?.owner,
                              startPrice: utils.formatEther(auction?.startPrice.div("1000000000"))?.toString(),
                              startTime: ((new Date(auction?.startTime?.toNumber() * 1000))).toLocaleString()
                            }, null, 2)
                          }
                        </pre>
                      </div>
                      <div className="col-4 d-flex justify-content-center align-items-center">
                        <div>
                          <div className="my-3">
                            <label>Lot ({collId})</label>
                            <input className="form-control" placeholder="0.00" onChange={onChangeLot} />
                          </div>
                          <div className="my-3">
                            <label>Max Price ({getStablecoinSymbol(chainId!)})</label>
                            <input className="form-control" placeholder="0.00" onChange={onChangeMaxPrice} />
                          </div>
                          <button className="btn btn-outline-primary my-3 w-100" onClick={() => buyNow(auction.id, lot, maxPrice)}>
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* <hr className="my-3" />
                    <h6>Bidding</h6>
                    <div className="row">
                      <div className="col-8 d-flex justify-content-center align-items-center text-center">
                        <div>
                          <h6>Current High Bid</h6>
                          {
                            auction.highestBid ? (
                              <div className="text-muted">{auction.highestBid?.lot.toString()} {collId} for {auction.highestBid?.price.toString()} {getStablecoinSymbol(chainId!)}</div>
                            ) : (
                              <p className="text-muted">No bids</p>
                            )
                          }
                        </div>
                      </div>
                      <div className="col-4 d-flex justify-content-center align-items-center">
                        <div>
                          <div className="my-3">
                            <label>Bid Lot ({collId})</label>
                            <input className="form-control" placeholder="0.00" onChange={onChangeBidLot} />
                          </div>
                          <div className="my-3">
                            <label>Bid Price ({getStablecoinSymbol(chainId!)})</label>
                            <input className="form-control" placeholder="0.00" onChange={onChangeBidPrice} />
                          </div>
                          <button className="btn btn-primary w-100" disabled={metamaskLoading || (!bidPrice || !bidLot)} onClick={(event) => placeBid(auction.id)}>
                            { metamaskLoading ? <i className="fa fa-spinner fa-spin"></i> : "Place Bid" }
                          </button>
                          <button className="btn btn-outline-secondary w-100 my-3" disabled={false} onClick={() => finalizeSale(auction.id)}>
                            Finalize Sale
                          </button>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              )
            })}
        </>
      }
    </Activity>
  )
}

export default Auctions;