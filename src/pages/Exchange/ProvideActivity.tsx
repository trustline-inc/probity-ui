import { useState } from "react";
import useSWR from 'swr';
import { BigNumber, Contract, utils } from "ethers";
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
    const [loading, setLoading] = useState<boolean>(false)

    const ROUTER = "0x2bfEd21c4315B9770398Ce90D6928aAcfe4E5256"
    const FACTORY = "0xFbCC76D2e42C2C50BBEB342E185B97802Cc877eA"
    const USD = "0x85E73942644D5020Ae1A8Fce6f8D02557e933651"
    const LQO = "0x1483e8dd076c7FAA65EfcB388a66eEcf06A13576"

    const { data: pairsLength } = useSWR([FACTORY, "allPairsLength"], {
        fetcher: fetcher(library, Factory.abi),
    })

    const { data: pair } = useSWR([FACTORY, "allPairs", pairsLength?.toNumber() - 1], {
        fetcher: fetcher(library, Factory.abi),
    })
    const PAIR = pair

    const { data: reserves } = useSWR([PAIR, "getReserves"], {
        fetcher: fetcher(library, Pair.abi),
    })

    const addLiquidity = async () => {
        setLoading(true)
        try {
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
                    <h5 className="text-center">Available Liquidity</h5>
                    <div className="row">
                        <div className="col-2">USD:</div>
                        <div className="col-10">{(+utils.formatEther(reserves[1])).toFixed(2)}</div>
                        <div className="col-2">LQO:</div>
                        <div className="col-10 text-truncate">{(+utils.formatEther(reserves[0])).toFixed(18)}</div>
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
                <input type="number" className="form-control form-control-lg" onChange={(event) => setAmountBDesired(BigNumber.from(event.target.value).mul("1000000000000000000"))} />
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