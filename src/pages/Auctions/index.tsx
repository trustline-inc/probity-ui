import { useEffect, useState, useContext } from "react";
import { scrollToTop, useScroll } from "../../utils"
import { BigNumber, utils } from "ethers";
import Pagination from "../../components/Pagination"
import Activity from "../../containers/Activity";
import { AUCTIONEER, INTERFACES, RESERVE_POOL } from '../../constants';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from "ethers";
import { Activity as ActivityType } from "../../types";
// import EventContext from "../../contexts/TransactionContext"
import { getAssetId, getStablecoinSymbol } from "../../utils";

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
  const [currentPrices, setCurrentPrices] = useState<number[]>([])
  const [auctionsPerPage, setAuctionsPerPage] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const scrollPosition = useScroll()
  const lastAuctionId = currentPage * auctionsPerPage
  const firstAuctionId = Math.max(0, lastAuctionId - auctionsPerPage)

  /**
   * Sets auction count
   */
  useEffect(() => {
    if (library) {
      (async () => {
        setLoading(true)
        const auctioneer = new Contract(AUCTIONEER, INTERFACES[AUCTIONEER].abi, library.getSigner())
        const _auctionCount = await auctioneer.auctionCount()
        setAuctionCount(_auctionCount.toNumber());
        setCurrentPage(1)
        setLoading(false)
      })()
    }
  }, [library])

  /**
   * Fetches the auctions
   */
  useEffect(() => {
    if (library && auctionCount) {
      (async () => {
        setLoading(true)
        const auctioneer = new Contract(AUCTIONEER, INTERFACES[AUCTIONEER].abi, library.getSigner())
        const _auctions = []
        for (let id = firstAuctionId; id < Math.min(lastAuctionId, auctionCount); id++) {
          let auction: any = await auctioneer.auctions(id)
          // const HEAD = "0x0000000000000000000000000000000000000001"
          // let _nextHighestBidder = await auctioneer.nextHighestBidder(id, HEAD)
          // let highestBid
          // if (_nextHighestBidder === "0x0000000000000000000000000000000000000000") {
          //   highestBid = null
          // } else {
          //   highestBid = await auctioneer.bids(id, _nextHighestBidder)
          // }
          // console.log("highestBid", highestBid)
          const currentPrice = await auctioneer.callStatic.calculatePrice(id)
          _auctions.push({ ...auction, id, highestBid: null, currentPrice })
        }
        setAuctions(_auctions);
        setLoading(false)
      })()
    }
  }, [library, auctionCount, currentPage, firstAuctionId, lastAuctionId])

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

  const buyNow = async (auctionId: number, lot: number|string, maxPrice: number|string) => {
    try {
      const auctioneer = new Contract(AUCTIONEER, INTERFACES[AUCTIONEER].abi, library!.getSigner())
      const args = [
        auctionId,
        utils.parseUnits(String(maxPrice), 27),
        utils.parseEther(String(lot)),
      ]
      await auctioneer.callStatic.buyItNow(...args)
      const tx = await auctioneer.buyItNow(...args)
      setMetamaskLoading(true)
      await tx.wait()
      setMetamaskLoading(false)
    } catch (error) {
      console.log(error)
      setError(error)
      scrollToTop()
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
              const collId = getAssetId(auction?.collId)
              return (
                <div className="card my-3" key={index}>
                  <div className="card-body">
                    <h6>Details</h6>
                    <div className="row">
                      <div className="col-8">
                        <div className="row mb-1">
                          <div className="col-3">
                            ID
                          </div>
                          <div className="col-9">
                            {auction.id}
                          </div>
                        </div>
                        <div className="row mb-1">
                          <div className="col-3">
                            Start Time
                          </div>
                          <div className="col-9">
                            {((new Date(auction?.startTime?.toNumber() * 1000))).toLocaleString()}
                          </div>
                        </div>
                        <div className="row mb-1">
                          <div className="col-3">
                            Debt
                          </div>
                          <div className="col-9">
                            {utils.formatUnits(auction?.debt, 45).toString()} AUR
                          </div>
                        </div>
                        <div className="row mb-1">
                          <div className="col-3">
                            Lot
                          </div>
                          <div className="col-9">
                            {utils.formatEther(auction?.lot)?.toString()} {collId}
                          </div>
                        </div>
                        <div className="row mb-1">
                          <div className="col-3">
                            Start Price
                          </div>
                          <div className="col-9">
                            {utils.formatUnits(auction?.startPrice, 27)?.toString()} AUR
                          </div>
                        </div>
                        <div className="row mb-1">
                          <div className="col-3">
                            Current Price
                          </div>
                          <div className="col-9">
                            {utils.formatUnits(auction?.currentPrice, 27)?.toString()} AUR
                          </div>
                        </div>
                        <div className="row mb-1">
                          <div className="col-3">
                            Owner
                          </div>
                          <div className="col-9">
                            <span className="font-monospace">{auction?.owner}</span>
                          </div>
                        </div>
                        <div className="row mb-1">
                          <div className="col-3">
                            Beneficiary
                          </div>
                          <div className="col-9">
                            <span className="font-monospace">{auction?.beneficiary}</span>
                          </div>
                        </div>
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
                          <button disabled={auction?.isOver} className="btn btn-outline-primary my-3 w-100" onClick={() => buyNow(auction.id, lot, maxPrice)}>
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
                  {
                    auction?.isOver && (
                      <div className="card-footer border-warning">
                        This auction has ended.
                      </div>   
                    )
                  }
                </div>
              )
            })}
        </>
      }
      <div className="d-flex justify-content-center">
        <Pagination
          itemsCount={auctionCount}
          itemsPerPage={auctionsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          alwaysShown={false}
        />
      </div>
    </Activity>
  )
}

export default Auctions;