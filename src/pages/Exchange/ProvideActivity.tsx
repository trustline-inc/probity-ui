import { useState } from "react";
import useSWR from 'swr';
import { BigNumber, Contract } from "ethers";
import Router from "@uniswap/v2-periphery/build/UniswapV2Router02.json";
import Factory from "@uniswap/v2-core/build/UniswapV2Factory.json";
import Pair from "@uniswap/v2-core/build/UniswapV2Pair.json";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import fetcher from "../../fetcher";

function ProvideActivity() {
    const { account, library } = useWeb3React<Web3Provider>()
    const [amountADesired, setAmountADesired] = useState<BigNumber|string>(BigNumber.from(0))
    const [amountBDesired, setAmountBDesired] = useState<BigNumber|string>(BigNumber.from(0))

    const ROUTER = "0x2bfEd21c4315B9770398Ce90D6928aAcfe4E5256"
    const FACTORY = "0xFbCC76D2e42C2C50BBEB342E185B97802Cc877eA"
    const PAIR = "0x2Bd6170bD093C35956420532796F6C73aF6eb26E"

    const { data: pair } = useSWR([FACTORY, "allPairs", 1], {
        fetcher: fetcher(library, Factory.abi),
    })
    console.log("pair", pair)
    const { data: reserves } = useSWR([PAIR, "getReserves"], {
        fetcher: fetcher(library, Pair.abi),
    })
    console.log("reserves:", reserves)

    const addLiquidity = async () => {
        try {
            const router = new Contract(ROUTER, Router.abi, library?.getSigner())
            const deadline = Math.floor(Date.now()) + 100
            const args = [
                "0xED74441c6C272424785e833704181B3a12b0204A",
                "0x0861c94d5Fd7e3BC4569c51aB236809Ed9EB6327",
                amountADesired,
                amountBDesired,
                amountADesired,
                amountBDesired,
                account,
                deadline,
            ]
            await router.callStatic.addLiquidity(...args)
            const result = await router.addLiquidity(...args);
            const data = await result.wait();
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <label htmlFor="from" className="form-label">Amount</label>
            <div className="input-group mb-3">
                <input type="number" className="form-control form-control-lg" onChange={(event) => setAmountADesired(BigNumber.from(event.target.value).mul("1000000000000000000"))} />
                <span className="input-group-text">USD</span>
            </div>
            <label htmlFor="to" className="form-label">Amount</label>
            <div className="input-group mb-3">
                <input type="number" className="form-control form-control-lg" onChange={(event) => setAmountBDesired(BigNumber.from(event.target.value).mul("1000000000000000000"))} />
                <span className="input-group-text">LQO</span>
            </div>
            <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={addLiquidity}>
                    Provide Liquidity
                </button>
            </div>
        </>
    )
}

export default ProvideActivity