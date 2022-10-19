import React from 'react';
import { Accordion } from 'react-bootstrap'
import useSWR from 'swr';
import numbro from "numbro"
import { Nav } from 'react-bootstrap'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { Contract, utils } from "ethers";
import { getNativeTokenSymbol } from "../../utils"
import fetcher from "../../fetcher";
import { RAY, CONTRACTS } from "../../constants";
import './index.css';
import FLR from "../../assets/flr.jpg"
import SGB from "../../assets/sgb.png"
import USD from "../../assets/usd.png"
import XRP from "../../assets/xrp.png"
import ETH from "../../assets/eth.png"
import AssetContext from "../../contexts/AssetContext"

const assetIcons: { [key: string]: string } = {
  CFLR: FLR,
  SGB,
  FLR,
  USD,
  XRP,
  ETH
}

const formatOptions = {
  thousandSeparated: true,
  optionalMantissa: true,
  trimMantissa: false,
  mantissa: 2
}

function Balances({ newActiveKey }: { newActiveKey: string }) {
  const ctx = React.useContext(AssetContext)
  enum BalanceType { User, System }
  const [selected, setSelected] = React.useState(BalanceType.User)
  const { account, library, chainId } = useWeb3React<Web3Provider>()
  const [collateralRatio, setCollateralRatio] = React.useState("")
  const [underlyingRatio, setUnderlyingRatio] = React.useState("")
  const [estimatedAPR, setEstimatedAPR] = React.useState("")
  const [estimatedAPY, setEstimatedAPY] = React.useState("")
  const [activeKey, setActiveKey] = React.useState("assets")
  const nativeTokenSymbol = getNativeTokenSymbol(chainId!)
  const currentAsset = ctx.asset || nativeTokenSymbol
  const USD = CONTRACTS[chainId!].USD
  const PBT = CONTRACTS[chainId!].PBT
  const PRICE_FEED = CONTRACTS[chainId!].PRICE_FEED
  const VAULT_ENGINE = CONTRACTS[chainId!].VAULT_ENGINE

  // Read data from deployed contracts
  const { data: ethVault, mutate: mutateEthVault } = useSWR([VAULT_ENGINE.address, "vaults", utils.id("ETH"), account], {
    fetcher: fetcher(library, VAULT_ENGINE.abi),
  })
  const { data: usdVault, mutate: mutateUsdVault } = useSWR([VAULT_ENGINE.address, "vaults", utils.id("USD"), account], {
    fetcher: fetcher(library, VAULT_ENGINE.abi),
  })
  const { data: balance, mutate: mutateBalance } = useSWR([VAULT_ENGINE.address, 'systemCurrency', account], {
    fetcher: fetcher(library, VAULT_ENGINE.abi),
  })
  const { data: systemCurrencyIssued, mutate: mutateSystemCurrencyIssued } = useSWR([VAULT_ENGINE.address, 'systemCurrencyIssued'], {
    fetcher: fetcher(library, VAULT_ENGINE.abi),
  })
  const { data: vaultPbtBalance, mutate: mutateVaultPbtBalance } = useSWR([VAULT_ENGINE.address, 'pbt', account], {
    fetcher: fetcher(library, VAULT_ENGINE.abi),
  })
  const { data: erc20Balance, mutate: mutateErc20Balance } = useSWR([USD.address, 'balanceOf', account], {
    fetcher: fetcher(library, USD.abi),
  })
  const { data: pbtErc20Balance, mutate: mutatePbtErc20Balance } = useSWR([PBT.address, 'balanceOf', account], {
    fetcher: fetcher(library, PBT.abi),
  })
  const { data: totalSupply, mutate: mutateTotalSupply } = useSWR([USD.address, 'totalSupply'], {
    fetcher: fetcher(library, USD.abi),
  })
  const { data: lendingPoolDebt, mutate: mutateLendingPoolDebt } = useSWR([VAULT_ENGINE.address, 'lendingPoolDebt'], {
    fetcher: fetcher(library, VAULT_ENGINE.abi),
  })
  const { data: lendingPoolEquity, mutate: mutateTotalEquity } = useSWR([VAULT_ENGINE.address, 'lendingPoolEquity'], {
    fetcher: fetcher(library, VAULT_ENGINE.abi),
  })
  const { data: lendingPoolPrincipal, mutate: mutateTotalPrincipal } = useSWR([VAULT_ENGINE.address, 'lendingPoolPrincipal'], {
    fetcher: fetcher(library, VAULT_ENGINE.abi),
  })
  const { data: lendingPoolSupply, mutate: mutateLendingPoolSupply } = useSWR([VAULT_ENGINE.address, 'lendingPoolSupply'], {
    fetcher: fetcher(library, VAULT_ENGINE.abi),
  })
  const { data: debtAccumulator, mutate: mutateDebtAccumulator } = useSWR([VAULT_ENGINE.address, 'debtAccumulator'], {
    fetcher: fetcher(library, VAULT_ENGINE.abi),
  })
  const { data: equityAccumulator, mutate: mutateEquityAccumulator } = useSWR([VAULT_ENGINE.address, 'equityAccumulator'], {
    fetcher: fetcher(library, VAULT_ENGINE.abi),
  })
  const { mutate: mutateAsset } = useSWR([VAULT_ENGINE.address, 'assets', utils.id(currentAsset)], {
    fetcher: fetcher(library, VAULT_ENGINE.abi),
  })

  /**
   * Toggle accordion based on navbar selection
   */
  React.useEffect(() => {
    setActiveKey(newActiveKey)
  }, [newActiveKey])

  React.useEffect(() => {
    if (library) {
      library.on("block", () => {
        mutateEthVault(undefined, true);
        mutateUsdVault(undefined, true);
        mutateBalance(undefined, true);
        mutateTotalSupply(undefined, true);
        mutateLendingPoolDebt(undefined, true);
        mutateErc20Balance(undefined, true);
        mutatePbtErc20Balance(undefined, true);
        mutateTotalEquity(undefined, true);
        mutateVaultPbtBalance(undefined, true);
        mutateAsset(undefined, true);
        mutateEquityAccumulator(undefined, true);
        mutateDebtAccumulator(undefined, true);
        mutateTotalPrincipal(undefined, true);
        mutateLendingPoolSupply(undefined, true);
        mutateSystemCurrencyIssued(undefined, true);
      });

      return () => {
        library.removeAllListeners("block");
      };
    }
  }, [library, mutateEthVault, mutateUsdVault, mutateBalance, mutateTotalSupply, mutateLendingPoolDebt, mutateLendingPoolSupply, mutateAsset, mutateDebtAccumulator, mutateEquityAccumulator, mutateErc20Balance, mutatePbtErc20Balance, mutateSystemCurrencyIssued, mutateTotalEquity, mutateTotalPrincipal, mutateVaultPbtBalance]);

  /**
   * Update the current APR
   */
  React.useEffect(() => {
    if (lendingPoolPrincipal && lendingPoolSupply) {
      if (lendingPoolSupply.toString() === "0" || lendingPoolPrincipal.toString() === "0") {
        setEstimatedAPR("0%")
        setEstimatedAPY("0%")
        return
      }
      const borrows = Number(utils.formatEther(lendingPoolPrincipal.div(RAY)));
      const supply = Number(utils.formatEther(lendingPoolSupply.div(RAY)));
      const newUtilization = (borrows / supply);
      const newAPR = ((1 / (100 * (1 - newUtilization)))) * 100
      const newAPY = newAPR
      setEstimatedAPR(`${Math.min((Math.ceil(newAPR / 0.25) * 0.25), 100).toFixed(2)}%`)
      setEstimatedAPY(`${newAPY.toFixed(2)}%`)
    }
  }, [lendingPoolSupply, lendingPoolPrincipal, usdVault])

  /**
   * Updates the collateral and underlying ratios
   */
  React.useEffect(() => {
    if (library) {
      (async () => {
        try {
          const vaultEngine = new Contract(VAULT_ENGINE.address, VAULT_ENGINE.abi, library.getSigner())
          const {
            normDebt,
            collateral,
            underlying,
            initialEquity
          } = await vaultEngine.vaults(utils.id("ETH"), account);
          const debtAccumulator = await vaultEngine.debtAccumulator();
          const priceFeed = new Contract(PRICE_FEED.address, PRICE_FEED.abi, library.getSigner())
          const price = await priceFeed.callStatic.getPrice(utils.id("ETH"))
  
          const _debt = normDebt.mul(debtAccumulator)

          // Get collateral ratio
          if (_debt.toString() !== "0") {
            const numerator = Number(utils.formatEther(String(collateral))) * Number(utils.formatUnits(String(price), 27))
            const denominator = Number(utils.formatUnits(String(_debt), 45))
            const _collateralRatio = `${((numerator / denominator) * 100).toFixed(4)}%`
            setCollateralRatio(_collateralRatio)
          } else {
            setCollateralRatio("0%")
          }

          // Get underlying ratio
          if (initialEquity.toString() !== "0") {
            const _underlyingRatio = `${underlying.mul(price).div(RAY).mul(100).mul(RAY).div(initialEquity).toNumber().toFixed(4)}%`
            setUnderlyingRatio(_underlyingRatio)
          } else {
            setUnderlyingRatio("0%")
          }
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [account, library, chainId, lendingPoolDebt, lendingPoolEquity, currentAsset, ethVault, usdVault, PRICE_FEED.abi, PRICE_FEED.address, VAULT_ENGINE.abi, VAULT_ENGINE.address, debtAccumulator])

  const updateActiveKey = (key: string) => {
    if (activeKey === key) setActiveKey("")
    else setActiveKey(key)
  }

  if (!usdVault && !ethVault) return null;

  return (
    <>
      <header>
        <h1>Balances</h1>
      </header>
      <div className="border rounded p-4 shadow-sm bg-white">

        <Nav
          fill
          variant="pills"
          activeKey={selected}
        >
          <Nav.Item>
            <Nav.Link eventKey={BalanceType.User} onClick={() => setSelected(BalanceType.User)}>User</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={BalanceType.System} onClick={() => setSelected(BalanceType.System)}>System</Nav.Link>
          </Nav.Item>
        </Nav>

        <hr />

        {
          selected === BalanceType.User ? (
            <>
              <Accordion defaultActiveKey="" activeKey={activeKey}>
                {/* <Accordion.Item eventKey="assets">
                  <Accordion.Header onClick={() => updateActiveKey("assets")}>
                    <h5>Assets</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="dropdown w-100">
                      <button className="text-dark btn btn-outline-light border dropdown-toggle w-100 d-flex justify-content-between align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <div className="w-100 p-1 d-flex justify-content-between">
                          <h4 className="d-flex align-items-center mb-0">{ctx.asset}</h4>
                          <img src={assetIcons[ctx.asset || "FLR"]} className="rounded-circle border" alt={ctx.asset} height="50" />
                        </div>
                      </button>
                      <ul className="dropdown-menu w-100 p-0">
                        <li className="dropdown-item border" onClick={() => ctx.updateAsset("USD")}>
                          <div className="asset py-2 d-flex justify-content-between">
                            <h4 className="d-flex align-items-center mb-0">USD</h4>
                            <img src={assetIcons["USD"]} className="rounded-circle border" alt="USD" height="50" />
                          </div>
                        </li>
                        <li className="dropdown-item border" onClick={() => ctx.updateAsset(nativeTokenSymbol)}>
                          <div className="asset py-2 d-flex justify-content-between">
                            <h4 className="d-flex align-items-center mb-0">{nativeTokenSymbol}</h4>
                            <img src={assetIcons[nativeTokenSymbol]} className="rounded-circle border" alt={nativeTokenSymbol} height="50" />
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="px-3 py-2 text-truncate">
                      <div className="my-2 d-flex justify-content-between">
                        <h6>Standby</h6>
                        <span className="text-truncate">
                          {numbro(utils.formatEther(ethVault.standbyAmount)).format(formatOptions)} {ctx.asset}
                        </span>
                      </div>
                      <div className="my-2 d-flex justify-content-between">
                        <h6>Active</h6>
                        <span className="text-truncate">
                          {numbro(utils.formatEther(ethVault.underlying.add(ethVault.collateral))).format(formatOptions)} {ctx.asset}
                        </span>
                      </div>
                      <div className="my-2 d-flex justify-content-between">
                        <h6>Total</h6>
                        <span className="text-truncate">{numbro(utils.formatEther(ethVault.standbyAmount.add(ethVault.underlying).add(ethVault.collateral))).format(formatOptions)} {ctx.asset}</span>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item> */}
                <Accordion.Item eventKey="equity">
                  <Accordion.Header onClick={() => updateActiveKey("equity")}>
                    <h5>Debt Investment</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="my-2 d-flex justify-content-between">
                      <h6>Current Value</h6>
                      <span className="text-truncate">
                        {usdVault && equityAccumulator ? numbro(utils.formatEther(usdVault.normEquity.mul(equityAccumulator).div(RAY))).format({ ...formatOptions, mantissa: 8 }) : null} USD
                      </span>
                    </div>
                    {/* <div className="my-2 d-flex justify-content-between">
                      <h6>Underlying</h6>
                      <span className="text-truncate">
                        {numbro(utils.formatEther(usdVault.underlying)).format(formatOptions)} {ctx.asset}
                      </span>
                    </div>
                    <div className="my-2 d-flex justify-content-between">
                      <h6>Supply Ratio</h6>
                      <span className="text-truncate">{underlyingRatio ? underlyingRatio : "0%"}</span>
                    </div> */}
                    <div className="my-2 d-flex justify-content-between">
                      <h6>Current APY</h6>
                      <span className="text-truncate">{estimatedAPY}</span>
                    </div>
                    <div className="my-2 d-flex justify-content-between">
                      <h6>Interest Earned</h6>
                      <span className="text-truncate">
                        {usdVault && equityAccumulator ? numbro(utils.formatUnits(usdVault.normEquity.mul(equityAccumulator).sub(usdVault.initialEquity), 45)).format({ ...formatOptions }) : null} USD
                      </span>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="debt">
                  <Accordion.Header onClick={() => updateActiveKey("debt")}>
                    <h5>Credit Facility</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="my-2 d-flex justify-content-between">
                      <h6>Balance</h6>
                      <span className="text-truncate">
                        {ethVault && debtAccumulator ? numbro(utils.formatEther(ethVault.normDebt.mul(debtAccumulator).div(RAY))).format({ ...formatOptions, mantissa: 8 }) : null} USD
                      </span>
                    </div>
                    <div className="my-2 d-flex justify-content-between">
                      <h6>Collateral</h6>
                      <span className="text-truncate">
                        {ethVault && numbro(utils.formatEther(ethVault.collateral)).format(formatOptions)} ETH
                      </span>
                    </div>
                    <div className="my-2 d-flex justify-content-between">
                      <h6>Collateral Ratio</h6>
                      <span className="text-truncate">{collateralRatio}</span>
                    </div>
                    <div className="my-2 d-flex justify-content-between">
                      <h6>Current APR</h6>
                      <span className="text-truncate">{estimatedAPR}</span>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                {/* <Accordion.Item eventKey="currencies">
                  <Accordion.Header onClick={() => updateActiveKey("currencies")}>
                    <h5>Vault Funds</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="my-2 d-flex justify-content-between">
                      <h6>Vault USD</h6>
                      <span className="text-truncate">{balance ? numbro(utils.formatEther(balance.div(RAY))).format(formatOptions) : "0"} USD</span>
                    </div>
                  </Accordion.Body>
                </Accordion.Item> */}
                {/* <Accordion.Item eventKey="voting">
                  <Accordion.Header onClick={() => updateActiveKey("voting")}>
                    <h5>Voting Power</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="my-2 d-flex justify-content-between">
                        <h6>Vault PBT</h6>
                        <span className="text-truncate">{vaultPbtBalance && usdVault ? numbro(utils.formatUnits(vaultPbtBalance, 45)).format({ ...formatOptions, mantissa: 8 }) : "0"} PBT</span>
                      </div>
                      <div className="my-2 d-flex justify-content-between">
                        <h6>ERC20 PBT</h6>
                        <span className="text-truncate">{pbtErc20Balance ? numbro(utils.formatEther(pbtErc20Balance)).format(formatOptions) : "0"} PBT</span>
                      </div>
                  </Accordion.Body>
                </Accordion.Item> */}
              </Accordion>
            </>
          ) : (
            <>
              <h5>USD Supply</h5>
              <div className="my-2 d-flex justify-content-between">
                <h6>Total Mint</h6>
                <span className="text-truncate">{systemCurrencyIssued ? numbro(utils.formatEther(systemCurrencyIssued.div(RAY).toString())).format(formatOptions) : null} USD</span>
              </div>
              <div className="my-2 d-flex justify-content-between">
                <h6>Probity Amount</h6>
                <span className="text-truncate">{systemCurrencyIssued && totalSupply ? numbro(utils.formatEther(totalSupply.sub(systemCurrencyIssued.div(RAY)))).format(formatOptions) : null} USD</span>
              </div>
              <div className="my-2 mb-4 d-flex justify-content-between">
                <h6>ERC20 Amount</h6>
                <span className="text-truncate">{totalSupply ? numbro(utils.formatEther(totalSupply)).format(formatOptions) : null} USD</span>
              </div>
              <h5>Fund Information</h5>
              <div className="my-2 d-flex justify-content-between">
                <h6>Assets Under Management</h6>
                <span className="text-truncate">{lendingPoolSupply ? numbro(utils.formatUnits((lendingPoolSupply.sub(lendingPoolPrincipal)).add((lendingPoolDebt.mul(debtAccumulator)).toString()), 45)).format(formatOptions) : null} USD</span>
              </div>
              <div className="my-2 d-flex justify-content-between">
                <h6>Cash</h6>
                <span className="text-truncate">{lendingPoolSupply && lendingPoolPrincipal ? numbro(utils.formatUnits(lendingPoolSupply.sub(lendingPoolPrincipal).toString(), 45)).format(formatOptions) : null} USD</span>
              </div>
              <div className="my-2 d-flex justify-content-between">
                <h6>Debt Assets</h6>
                <span className="text-truncate">{lendingPoolDebt ? numbro(utils.formatEther(lendingPoolDebt.mul(debtAccumulator).div(RAY).toString())).format(formatOptions) : null} USD</span>
              </div>
              <div className="my-2 d-flex justify-content-between">
                <h6>Utilization</h6>
                <span className="text-truncate">{lendingPoolEquity && lendingPoolDebt.toString() !== "0" ? numbro(utils.formatUnits(lendingPoolPrincipal.div(lendingPoolEquity).mul(100).toString(), 27)).format('0,0.0[000]') : "0"}%</span>
              </div>
            </>
          )
        }
      </div>
    </>
  )
}

export default Balances;