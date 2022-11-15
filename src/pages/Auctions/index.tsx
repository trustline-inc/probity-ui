import { useEffect, useState } from "react";
import numbro from "numbro"
import web3 from "web3"
import { scrollToTop } from "../../utils"
import { utils } from "ethers";
import Pagination from "../../components/Pagination"
import Activity from "../../containers/Activity";
import { CONTRACTS } from '../../constants';
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from "ethers";
import { Activity as ActivityType } from "../../types";
import { getAssetId } from "../../utils";
import { formatOptions } from "../../constants";

function Auctions({ assetPrice }: { assetPrice: number }) {
  const [loading, setLoading] = useState(false);
  const [metamaskLoading, setMetamaskLoading] = useState(false)
  const [bidPrice, setBidPrice] = useState<number>(0.00)
  const [bidLot, setBidLot] = useState<number>(0.00)
  const [lot, setLot] = useState<number>(0.00)
  const [maxPrice, setMaxPrice] = useState<number>(0.00)
  const [auctions, setAuctions] = useState<any[]>([]);
  const [totalAuctions, setTotalAuctions] = useState(0)
  const { library, active, chainId } = useWeb3React<Web3Provider>()
  const [error, setError] = useState<any|null>(null);
  const [auctionsPerPage] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const lastAuctionId = currentPage * auctionsPerPage
  const firstAuctionId = Math.max(0, lastAuctionId - auctionsPerPage)
  const AUCTIONEER = CONTRACTS[chainId!].AUCTIONEER
  const RESERVE_POOL = CONTRACTS[chainId!].RESERVE_POOL

  /**
   * Sets auction count
   */
  useEffect(() => {
    if (library) {
      (async () => {
        setLoading(true)
        const auctioneer = new Contract(AUCTIONEER.address, AUCTIONEER.abi, library.getSigner())
        const _totalAuctions = await auctioneer.totalAuctions()
        setTotalAuctions(_totalAuctions.toNumber());
        setCurrentPage(1)
        setLoading(false)
      })()
    }
  }, [library, AUCTIONEER.abi, AUCTIONEER.address])

  /**
   * Fetches the auctions
   */
  useEffect(() => {
    if (library && totalAuctions) {
      (async () => {
        setLoading(true)
        const auctioneer = new Contract(AUCTIONEER.address, AUCTIONEER.abi, library.getSigner())
        const _auctions = []
        for (let id = firstAuctionId; id < Math.min(lastAuctionId, totalAuctions); id++) {
          let auction: any = await auctioneer.auctions(id)
          const HEAD = "0x0000000000000000000000000000000000000001"
          let _nextHighestBidder = await auctioneer.nextHighestBidder(id, HEAD)
          let highestBid
          if (_nextHighestBidder === "0x0000000000000000000000000000000000000000") {
            highestBid = null
          } else {
            highestBid = await auctioneer.bids(id, _nextHighestBidder)
          }
          const currentPrice = await auctioneer.callStatic.calculatePrice(id)
          _auctions.push({ ...auction, id, highestBid, currentPrice })
        }
        setAuctions(_auctions);
        setLoading(false)
      })()
    }
  }, [library, totalAuctions, currentPage, firstAuctionId, lastAuctionId, AUCTIONEER.abi, AUCTIONEER.address])

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
      const auctioneer = new Contract(AUCTIONEER.address, AUCTIONEER.abi, library!.getSigner())
      const args = [
        auctionId,
        utils.parseUnits(String(bidPrice), 27),
        utils.parseEther(String(bidLot)),
      ]
      const tx = await auctioneer.placeBid(...args)
      setMetamaskLoading(true)
      await tx.wait()
      setMetamaskLoading(false)
    } catch (error) {
      console.log(error)
      setError(error)
      scrollToTop()
    }
  }

  const buyNow = async (auctionId: number, lot: number|string, maxPrice: number|string) => {
    try {
      const auctioneer = new Contract(AUCTIONEER.address, AUCTIONEER.abi, library!.getSigner())
      const args = [
        auctionId,
        utils.parseUnits(String(maxPrice), 27),
        utils.parseEther(String(lot)),
        {
          gasLimit: web3.utils.toWei('300000', 'wei'),
          maxFeePerGas: 25 * 1e9,
        }
      ]
      console.log(
        utils.parseUnits(String(maxPrice), 27).toString(),
        utils.parseEther(String(lot)).toString()
      )
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
      const auctioneer = new Contract(AUCTIONEER.address, AUCTIONEER.abi, library!.getSigner())
      const tx = await auctioneer.finalizeSale(auctionId)
      setMetamaskLoading(true)
      await tx.wait()
      setMetamaskLoading(false)
    } catch (error) {
      console.log(error)
      setError(error)
      scrollToTop()
    }
  }

  return (
    <Activity active={active} activity={ActivityType.Auction} error={error}>
      <h1>Auctions</h1>
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
              <code>{RESERVE_POOL.address}</code> is the Reserve Pool's address.
            </div>
            {auctions.map((auction: any, index: number) => {
              const collId = getAssetId(auction?.assetId)
              return (
                <div className="card my-3" key={index}>
                  <div className="card-body">
                    <h6>Details</h6>
                    <div className="row">
                      <div className="col-lg-8 col-md-8">
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
                            {numbro(utils.formatUnits(auction?.debt, 45)).format({ ...formatOptions, mantissa: 18 })} USD
                          </div>
                        </div>
                        <div className="row mb-1">
                          <div className="col-3">
                            Lot
                          </div>
                          <div className="col-9">
                            {numbro(utils.formatEther(auction?.lot)).format(formatOptions)} {collId}
                          </div>
                        </div>
                        <div className="row mb-1">
                          <div className="col-3">
                            Start Price
                          </div>
                          <div className="col-9">
                            {numbro(utils.formatUnits(auction?.startPrice, 27)).format({ ...formatOptions, mantissa: 27 })} USD
                          </div>
                        </div>
                        <div className="row mb-1">
                          <div className="col-3">
                            Current Price
                          </div>
                          <div className="col-9">
                            {numbro(utils.formatUnits(auction?.currentPrice, 27)).format({ ...formatOptions, mantissa: 27 })} USD
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
                      <div className="col-lg-4 col-md-4 d-flex justify-content-center align-items-center">
                        <div>
                          <div className="my-3">
                            <label>Lot ({collId})</label>
                            <input className="form-control" placeholder="0.00" onChange={onChangeLot} />
                          </div>
                          <div className="my-3">
                            <label>Max Price (USD)</label>
                            <input className="form-control" placeholder="0.00" onChange={onChangeMaxPrice} />
                          </div>
                          <button disabled={auction?.isOver} className="btn btn-outline-primary my-3 w-100" onClick={() => buyNow(auction.id, lot, maxPrice)}>
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                    <hr className="my-3" />
                    <h6>Bidding</h6>
                    <div className="row">
                      <div className="col-8 d-flex justify-content-center align-items-center text-center">
                        <div>
                          <h6>Current High Bid</h6>
                          {
                            auction.highestBid ? (
                              <div className="text-muted">{String(utils.formatEther(String(auction.highestBid?.lot)))} {collId} for {String(utils.formatUnits(String(auction.highestBid?.price), 27))} USD</div>
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
                            <label>Bid Price (USD)</label>
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
                    </div>
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
          itemsCount={totalAuctions}
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