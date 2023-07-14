import { useEffect, useState } from "react";
import numbro from "numbro"
import { BigNumber, Contract, utils } from "ethers";
import Router from "@uniswap/v2-periphery/build/UniswapV2Router02.json";
import Factory from "@uniswap/v2-core/build/UniswapV2Factory.json";
import Pair from "@uniswap/v2-core/build/UniswapV2Pair.json";
import UsdABI from "@trustline/probity/artifacts/contracts/probity/tokens/Usd.sol/USD.json";
// import LqoABI from "@trustline/probity/artifacts/contracts/probity/tokens/Lqo.sol/LQO.json";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { formatOptions } from "../../constants";



function TradeActivity() {
    const { account, library } = useWeb3React<Web3Provider>()
    const [assetIn, setAssetIn] = useState<string>("USD")
    const [assetOut, setAssetOut] = useState<string>("LQO")
    const [amountIn, setAmountIn] = useState<BigNumber>(BigNumber.from(0))
    const [amountOut, setAmountOut] = useState<BigNumber>(BigNumber.from(0))
    const [quote, setQuote] = useState<any>()
    const [loading, setLoading] = useState<boolean>(false)
    const [reserveIn, setReserveIn] = useState(BigNumber.from(0))
    const [reserveOut, setReserveOut] = useState(BigNumber.from(0))
    const [pair, setPair] = useState()

    const ROUTER = "0xE4c986c2FCE7D8c90630e91F4AFaBa62796cb12A"
    const FACTORY = "0x7c5dF2675221eb4F630a19616db160de918C44Ca"

    const addresses: {
        [key: string]: string;
    } = {
        USD: "0x482e8BEf8235ff6333B671A78e94d6576C4B2CFf",
        LQO: "0xa8cF0dCF0A118f1AaD8E75fF3e1F4E80Bf1410fc"
    }

    useEffect(() => {
        (async () => {
            if (library) {
                const factory = new Contract(FACTORY, Factory.abi, library?.getSigner())
                try {
                    const address = await factory.getPair(addresses[assetIn], addresses[assetOut])
                    if (address === "0x0000000000000000000000000000000000000000") throw Error()
                    setPair(address)
                } catch (error) {
                    const address = await factory.createPair(addresses[assetIn], addresses[assetOut])
                    setPair(address)
                }
            }
        })()
    }, [library, assetIn, assetOut])

    useEffect(() => {
        (async () => {
            if (library && pair) {
                const _pair = new Contract(pair, Pair.abi, library?.getSigner())
                const _reserves = await _pair.getReserves()
                setReserveIn(_reserves[0])
                setReserveOut(_reserves[1])
            }
        })()
    }, [library, pair])

    const swap = async () => {
        setLoading(true)
        try {
            const router = new Contract(ROUTER, Router.abi, library?.getSigner())
            // Check ROUTER allowances
            const token = new Contract(addresses[assetIn], UsdABI.abi, library?.getSigner())
            const allowance = await token.allowance(account, ROUTER)
            if (BigNumber.from(allowance).lt(utils.parseUnits(String(amountIn)))) {
                await token.approve(ROUTER, utils.parseUnits(String(amountIn)))
            }
            const amountOutMin = 0
            const path = [addresses[assetIn], addresses[assetOut]]
            const to = account
            const deadline = Math.floor(Date.now()) + 100
            const args = [
                utils.parseUnits(String(amountIn)),
                amountOutMin,
                path,
                to,
                deadline
            ]
            await router.callStatic.swapExactTokensForTokens(...args)
            const result = await router.swapExactTokensForTokens(...args);
            await result.wait();
            setAmountIn(BigNumber.from(0))
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    const onChange = async (event: any) => {
        try {
            const router = new Contract(ROUTER, Router.abi, library?.getSigner())
            const _amountIn = event.target.value === "" ?  BigNumber.from(0) : event.target.value
            const args = [utils.parseUnits(String(_amountIn)), reserveIn, reserveOut]
            const _amountOut = event.target.value === "" ? BigNumber.from(0) : await router.getAmountOut(...args)
            setAmountIn(_amountIn)
            setAmountOut(_amountOut)
            if (event.target.value !== "")
                if (assetOut === "USD")
                    setQuote((Number(_amountOut) / Number(_amountIn)))
                else if (assetIn === "USD") {
                    let _quote = (Number(_amountIn) / Number((_amountOut)))
                    if (_quote === Infinity) _quote = 0
                    setQuote(_quote.toFixed(2))
                }
            else
                setQuote(null)
        } catch (error) {
            console.log(error)
        }
    }

    const switchAssets = async () => {
        if (assetIn === "USD") {
            setAssetIn("LQO")
            setAssetOut("USD")
            setReserveIn(reserveOut)
            setReserveOut(reserveIn)
        } else {
            setAssetIn("USD")
            setAssetOut("LQO")
            setReserveIn(reserveOut)
            setReserveOut(reserveIn)
        }
        setAmountIn(BigNumber.from(0))
        setAmountOut(BigNumber.from(0))
        setQuote(null)
    }

    return (
        <>
            <label htmlFor="from" className="form-label">From</label>
            <div className="input-group mb-3">
                <input type="number" className="form-control form-control-lg" id="from" onChange={onChange} />
                <span className="input-group-text">{assetIn}</span>
            </div>
            <div className="d-flex justify-content-center">
                <button className="btn btn-light" onClick={switchAssets}>
                    <i className="fa-solid fa-arrows-rotate"></i>
                </button>
            </div>
            <label htmlFor="to" className="form-label">To</label>
            <div className="input-group mb-3">
                <input type="text" className="form-control form-control-lg" id="to" disabled value={numbro(Number(amountOut)).format(formatOptions)} />
                <span className="input-group-text">{assetOut}</span>
            </div>
            {quote && (<p className="text-center">≈ ${quote.toString()} per unit</p>)}
            <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={swap}>
                    {loading ? <div className="spinner-border spinner-border-sm text-light" role="status" /> : "Place Trade"}
                </button>
            </div>
        </>
    )
}

export default TradeActivity