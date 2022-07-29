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
import FLR from "../../assets/flare.jpg"
import SGB from "../../assets/sgb.png"
import USD from "../../assets/usd.png"
import AssetContext from "../../contexts/AssetContext"

const assetIcons: { [key: string]: string } = {
  CFLR: FLR,
  SGB,
  FLR,
  USD,
}

const formatOptions = {
  thousandSeparated: true,
  optionalMantissa: true,
  trimMantissa: false,
  mantissa: 8
}

function Balances({ newActiveKey }: { newActiveKey: string }) {
  const ctx = React.useContext(AssetContext)
  enum BalanceType { Individual, Aggregate }
  const [selected, setSelected] = React.useState(BalanceType.Individual)
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
  const { data: vault, mutate: mutateVault } = useSWR([VAULT_ENGINE.address, "vaults", utils.id(currentAsset), account], {
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
  const { data: asset, mutate: mutateAsset } = useSWR([VAULT_ENGINE.address, 'assets', utils.id(currentAsset)], {
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
        mutateVault(undefined, true);
        mutateBalance(undefined, true);
        mutateTotalSupply(undefined, true);
        mutateLendingPoolDebt(undefined, true);
        mutateErc20Balance(undefined, true);
        mutatePbtErc20Balance(undefined, true);
        mutateTotalEquity(undefined, true);
        mutateVaultPbtBalance(undefined, true);
        // mutateAsset(undefined, true);
      });

      return () => {
        library.removeAllListeners("block");
      };
    }
  }, []);

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
  }, [lendingPoolSupply, lendingPoolPrincipal, vault])

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
          } = await vaultEngine.vaults(utils.id(currentAsset), account);
          const debtAccumulator = await vaultEngine.debtAccumulator();
          const priceFeed = new Contract(PRICE_FEED.address, PRICE_FEED.abi, library.getSigner())
          const price = await priceFeed.callStatic.getPrice(utils.id(currentAsset))
  
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
  }, [account, library, chainId, lendingPoolDebt, lendingPoolEquity, currentAsset, vault])

  const updateActiveKey = (key: string) => {
    if (activeKey === key) setActiveKey("")
    else setActiveKey(key)
  }

  if (!vault) return null;

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
            <Nav.Link eventKey={BalanceType.Individual} onClick={() => setSelected(BalanceType.Individual)}>Individual</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={BalanceType.Aggregate} onClick={() => setSelected(BalanceType.Aggregate)}>Aggregate</Nav.Link>
          </Nav.Item>
        </Nav>

        <hr />

        {
          selected === BalanceType.Individual ? (
            <>
              <Accordion defaultActiveKey="assets" activeKey={activeKey}>
                <Accordion.Item eventKey="assets">
                  <Accordion.Header onClick={() => updateActiveKey("assets")}>
                    <h5>Assets</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="dropdown w-100">
                      <button className="text-dark btn btn-outline-light border dropdown-toggle w-100 d-flex justify-content-between align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {/* The button displays the currently selected asset */}
                        <div className="w-100 p-1 d-flex justify-content-between">
                          <h4 className="d-flex align-items-center mb-0">{ctx.asset}</h4>
                          <img src={assetIcons[ctx.asset || "FLR"]} className="rounded-circle border" alt={ctx.asset} height="50" />
                        </div>
                      </button>
                      {/* Dropdown selection menu of other assets */}
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
                        {/*
                        <li className="dropdown-item border disabled" onClick={() => ctx.updateAsset("FXRP")}>
                          <div className="asset py-2 d-flex justify-content-between">
                            <h4 className="d-flex align-items-center mb-0">FXRP</h4>
                            <img src={XRP} className="rounded-circle border" alt="FXRP" height="50" />
                          </div>
                        </li>
                        */}
                      </ul>
                    </div>
                    <div className="px-3 py-2 text-truncate">
                      <div className="my-2 d-flex justify-content-between">
                        <h6>Standby</h6>
                        <span className="text-truncate">
                          {numbro(utils.formatEther(vault.standbyAmount)).format(formatOptions)} {ctx.asset}
                        </span>
                      </div>
                      <div className="my-2 d-flex justify-content-between">
                        <h6>Active</h6>
                        <span className="text-truncate">
                          {numbro(utils.formatEther(vault.underlying.add(vault.collateral))).format(formatOptions)} {ctx.asset}
                        </span>
                      </div>
                      <div className="my-2 d-flex justify-content-between">
                        <h6>Total</h6>
                        <span className="text-truncate">{numbro(utils.formatEther(vault.standbyAmount.add(vault.underlying).add(vault.collateral))).format(formatOptions)} {ctx.asset}</span>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="equity">
                  <Accordion.Header onClick={() => updateActiveKey("equity")}>
                    <h5>Equity Position</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="my-2 d-flex justify-content-between">
                      <h6>Equity</h6>
                      <span className="text-truncate">
                        {vault && equityAccumulator ? numbro(utils.formatEther(vault.normEquity.mul(equityAccumulator).div(RAY))).format({ ...formatOptions, mantissa: 8 }) : null} USD
                      </span>
                    </div>
                    <div className="my-2 d-flex justify-content-between">
                      <h6>Underlying</h6>
                      <span className="text-truncate">
                        {numbro(utils.formatEther(vault.underlying)).format(formatOptions)} {ctx.asset}
                      </span>
                    </div>
                    <div className="my-2 d-flex justify-content-between">
                      <h6>Supply Ratio</h6>
                      <span className="text-truncate">{underlyingRatio ? underlyingRatio : "0%"}</span>
                    </div>
                    <div className="my-2 d-flex justify-content-between">
                      <h6>Current APY</h6>
                      <span className="text-truncate">{estimatedAPY}</span>
                    </div>
                    <div className="my-2 d-flex justify-content-between">
                      <h6>Interest Earned</h6>
                      <span className="text-truncate">
                        {vault && equityAccumulator ? numbro(utils.formatUnits(vault.normEquity.mul(equityAccumulator).sub(vault.initialEquity), 45)).format({ ...formatOptions }) : null} USD
                      </span>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="debt">
                  <Accordion.Header onClick={() => updateActiveKey("debt")}>
                    <h5>Debt Position</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="my-2 d-flex justify-content-between">
                      <h6>Debt</h6>
                      <span className="text-truncate">
                        {vault && debtAccumulator ? numbro(utils.formatEther(vault.normDebt.mul(debtAccumulator).div(RAY))).format({ ...formatOptions, mantissa: 8 }) : null} USD
                      </span>
                    </div>
                    <div className="my-2 d-flex justify-content-between">
                      <h6>Collateral</h6>
                      <span className="text-truncate">
                        {numbro(utils.formatEther(vault.collateral)).format(formatOptions)} {ctx.asset}
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
                <Accordion.Item eventKey="currencies">
                  <Accordion.Header onClick={() => updateActiveKey("currencies")}>
                    <h5>Vault Funds</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="my-2 d-flex justify-content-between">
                      <h6>Vault USD</h6>
                      <span className="text-truncate">{balance ? numbro(utils.formatEther(balance.div(RAY))).format(formatOptions) : "0"} USD</span>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                {/* <Accordion.Item eventKey="voting">
                  <Accordion.Header onClick={() => updateActiveKey("voting")}>
                    <h5>Voting Power</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="my-2 d-flex justify-content-between">
                        <h6>Vault PBT</h6>
                        <span className="text-truncate">{vaultPbtBalance && vault ? numbro(utils.formatUnits(vaultPbtBalance, 45)).format({ ...formatOptions, mantissa: 8 }) : "0"} PBT</span>
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
              <h5>System Currency</h5>
              <div className="my-2 d-flex justify-content-between">
                <h6>Issued Supply</h6>
                <span className="text-truncate">{systemCurrencyIssued ? numbro(utils.formatEther(systemCurrencyIssued.div(RAY).toString())).format(formatOptions) : null} USD</span>
              </div>
              <div className="my-2 mb-4 d-flex justify-content-between">
                <h6>ERC20 Supply</h6>
                <span className="text-truncate">{totalSupply ? numbro(utils.formatEther(totalSupply)).format(formatOptions) : null} USD</span>
              </div>
              <h5>Lending Pool</h5>
              <div className="my-2 d-flex justify-content-between">
                <h6>Total Debt</h6>
                <span className="text-truncate">{lendingPoolDebt ? numbro(utils.formatEther(lendingPoolDebt.mul(debtAccumulator).div(RAY).toString())).format(formatOptions) : null} USD</span>
              </div>
              <div className="my-2 d-flex justify-content-between">
                <h6>Total Supply</h6>
                <span className="text-truncate">{lendingPoolSupply ? numbro(utils.formatEther(lendingPoolSupply.div(RAY).toString())).format(formatOptions) : null} USD</span>
              </div>
              <div className="my-2 d-flex justify-content-between">
                <h6>Loanable Funds</h6>
                <span className="text-truncate">{lendingPoolSupply && lendingPoolPrincipal ? numbro(utils.formatUnits(lendingPoolSupply.sub(lendingPoolPrincipal).toString(), 45)).format(formatOptions) : null} USD</span>
              </div>
              <div className="my-2 d-flex justify-content-between">
                <h6>Utilization Ratio</h6>
                <span className="text-truncate">{lendingPoolEquity && lendingPoolDebt.toString() !== "0" ? numbro(utils.formatUnits(lendingPoolDebt.mul(RAY).div(lendingPoolEquity).mul(100).toString(), 27)).format('0,0.0[000]') : "0"}%</span>
              </div>
            </>
          )
        }
      </div>
    </>
  )
}

export default Balances;