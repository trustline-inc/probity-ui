import numbro from "numbro"
import { useEffect, useState } from "react";
import { BigNumber, Contract, utils } from "ethers";
import Router from "@uniswap/v2-periphery/build/UniswapV2Router02.json";
import Factory from "@uniswap/v2-core/build/UniswapV2Factory.json";
import Pair from "@uniswap/v2-core/build/UniswapV2Pair.json";
import UsdABI from "@trustline/probity/artifacts/contracts/probity/tokens/Usd.sol/USD.json";
import LqoABI from "@trustline/probity/artifacts/contracts/probity/tokens/Lqo.sol/LQO.json";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { formatOptions } from "../../constants";

function ProvideActivity() {
    const { account, library } = useWeb3React<Web3Provider>()
    const [amountADesired, setAmountADesired] = useState<BigNumber|string>(BigNumber.from(0))
    const [amountBDesired, setAmountBDesired] = useState<BigNumber|string>(BigNumber.from(0))
    const [loading, setLoading] = useState<boolean>(false)
    const [pair, setPair] = useState()
    const [reserves, setReserves] = useState<any[]>([BigNumber.from(0), BigNumber.from(0)])

    const ROUTER = "0xE4c986c2FCE7D8c90630e91F4AFaBa62796cb12A"
    const FACTORY = "0x7c5dF2675221eb4F630a19616db160de918C44Ca"
    const USD = "0x482e8BEf8235ff6333B671A78e94d6576C4B2CFf"
    const LQO = "0xa8cF0dCF0A118f1AaD8E75fF3e1F4E80Bf1410fc"

    useEffect(() => {
        (async () => {
            if (library) {
                const factory = new Contract(FACTORY, Factory.abi, library?.getSigner())
                try {
                    const address = await factory.getPair(USD, LQO)
                    if (address === "0x0000000000000000000000000000000000000000") throw Error()
                    setPair(address)
                } catch (error) {
                    const address = await factory.createPair(USD, LQO)
                    setPair(address)
                }
            }
        })()
    }, [library, setPair])

    useEffect(() => {
        (async () => {
            if (library && pair) {
                const _pair = new Contract(pair, Pair.abi, library?.getSigner())
                const _reserves = await _pair.getReserves()
                console.log(_reserves[0].toString(), _reserves[1].toString())
                setReserves([_reserves[0], _reserves[1]])
            }
        })()
    }, [library, pair])

    const addLiquidity = async () => {
        setLoading(true)
        try {
            // Check ROUTER allowances
            const usd = new Contract(USD, UsdABI.abi, library?.getSigner())
            const lqo = new Contract(LQO, LqoABI.abi, library?.getSigner())
            let allowance = await usd.allowance(account, ROUTER)
            if (BigNumber.from(allowance).lt(amountADesired)) {
                await usd.approve(ROUTER, amountADesired)
            }
            allowance = await lqo.allowance(account, ROUTER)
            if (BigNumber.from(allowance).lt(amountBDesired)) {
                await lqo.approve(ROUTER, amountBDesired)
            }

            const router = new Contract(ROUTER, Router.abi, library?.getSigner())
            const deadline = Math.floor(Date.now()) + 100
            const args = [
                USD,
                LQO,
                amountADesired,
                amountBDesired,
                amountADesired,
                amountBDesired,
                account,
                deadline,
            ]
            await router.callStatic.addLiquidity(...args)
            const result = await router.addLiquidity(...args);
            await result.wait();
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    return (
        <>
            {reserves && (
                <div className="border rounded p-3 mb-3">
                    <h5 className="text-center">Active Liquidity</h5>
                    <div className="d-flex justify-content-between">
                        <div>USD:</div>
                        <div>{numbro(Number((utils.formatEther(reserves[0]))).toFixed(2)).format(formatOptions)}</div>
                    </div>
                    <div className="d-flex justify-content-between">
                        <div>LQO:</div>
                        <div className="text-truncate">{numbro(reserves[1].toString()).format(formatOptions)}</div>
                    </div>
                </div>
            )}
            <label htmlFor="from" className="form-label">Amount</label>
            <div className="input-group mb-3">
                <input type="number" className="form-control form-control-lg" onChange={(event) => setAmountADesired(BigNumber.from(event.target.value).mul("1000000000000000000"))} />
                <span className="input-group-text">USD</span>
            </div>
            <label htmlFor="to" className="form-label">Amount</label>
            <div className="input-group mb-3">
                <input type="number" className="form-control form-control-lg" onChange={(event) => setAmountBDesired(BigNumber.from(event.target.value))} />
                <span className="input-group-text">LQO</span>
            </div>
            <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={addLiquidity}>
                    {loading ? <div className="spinner-border spinner-border-sm text-light" role="status" /> : "Add Liquidity"}
                </button>
            </div>
        </>
    )
}

export default ProvideActivity