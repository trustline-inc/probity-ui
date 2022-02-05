import React from 'react';
import useSWR from 'swr';
import numbro from "numbro"
import { Nav } from 'react-bootstrap'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { Contract, utils } from "ethers";
import { getNativeTokenSymbol, getStablecoinABI, getStablecoinAddress, getStablecoinSymbol } from "../../utils"
import fetcher from "../../fetcher";
import {
  RAY,
  FTSO,
  PBT_TOKEN,
  VAULT_ENGINE,
  INTERFACES
} from "../../constants";
import './index.css';
import FLR from "../../assets/flare.jpg"
import SGB from "../../assets/sgb.png"
import TUSD from "../../assets/TUSD.png"
import XRP from "../../assets/xrp.png"
import AssetContext from "../../contexts/AssetContext"

const assetIcons: { [key: string]: string } = {
  CFLR: FLR,
  SGB,
  FLR,
  TUSD,
  FXRP: XRP
}

const formatOptions = {
  thousandSeparated: true,
  optionalMantissa: true,
  trimMantissa: false,
  mantissa: 4
}

function Balances() {
  const ctx = React.useContext(AssetContext)
  enum BalanceType { Individual, Aggregate }
  const [selected, setSelected] = React.useState(BalanceType.Individual)
  const { account, library, chainId } = useWeb3React<Web3Provider>()
  const [collateralRatio, setCollateralRatio] = React.useState("")
  const [underlyingRatio, setUnderlyingRatio] = React.useState("")
  const [estimatedAPR, setEstimatedAPR] = React.useState("")
  const [estimatedAPY, setEstimatedAPY] = React.useState("")
  const nativeTokenSymbol = getNativeTokenSymbol(chainId!)
  const currentAsset = ctx.asset || nativeTokenSymbol

  // Read data from deployed contracts
  const { data: vault, mutate: mutateVault } = useSWR([VAULT_ENGINE, "vaults", utils.id(currentAsset), account], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })
  const { data: vaultStablecoinBalance, mutate: mutateVaultStablecoinBalance } = useSWR([VAULT_ENGINE, 'stablecoin', account], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })
  const { data: pbtBalance, mutate: mutateInterestBalance } = useSWR([VAULT_ENGINE, 'pbt', account], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })
  const { data: stablecoinERC20Balance, mutate: mutateStablecoinERC20Balance } = useSWR([getStablecoinAddress(chainId!), 'balanceOf', account], {
    fetcher: fetcher(library, getStablecoinABI(chainId!).abi),
  })
  const { data: pbtERC20Balance, mutate: mutatePbtERC20Balance } = useSWR([PBT_TOKEN, 'balanceOf', account], {
    fetcher: fetcher(library, INTERFACES[PBT_TOKEN].abi),
  })
  const { data: totalStablecoinSupply, mutate: mutateTotalStablecoinSupply } = useSWR([getStablecoinAddress(chainId!), 'totalSupply'], {
    fetcher: fetcher(library, getStablecoinABI(chainId!).abi),
  })
  const { data: totalDebt, mutate: mutateTotalDebt } = useSWR([VAULT_ENGINE, 'totalDebt'], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })
  const { data: totalEquity, mutate: mutateTotalEquity } = useSWR([VAULT_ENGINE, 'totalEquity'], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })
  const { data: asset, mutate: mutateAsset } = useSWR([VAULT_ENGINE, 'assets', utils.id(currentAsset)], {
    fetcher: fetcher(library, INTERFACES[VAULT_ENGINE].abi),
  })

  React.useEffect(() => {
    if (library) {
      library.on("block", () => {
        mutateVault(undefined, true);
        mutateVaultStablecoinBalance(undefined, true);
        mutateTotalStablecoinSupply(undefined, true);
        mutateTotalDebt(undefined, true);
        mutateStablecoinERC20Balance(undefined, true);
        mutatePbtERC20Balance(undefined, true);
        mutateTotalEquity(undefined, true);
        mutateInterestBalance(undefined, true);
        mutateAsset(undefined, true);
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
    if (totalDebt && totalEquity) {
      if (totalEquity.toString() === "0" || totalDebt.toString() === "0") {
        setEstimatedAPR("0%")
        setEstimatedAPY("0%")
        return
      }
      const borrows = Number(utils.formatEther(totalDebt.div(RAY)));
      const supply = Number(utils.formatEther(totalEquity.div(RAY)));
      const newUtilization = (borrows / supply);
      const newAPR = ((1 / (100 * (1 - newUtilization)))) * 100
      const newAPY = newAPR * newUtilization
      setEstimatedAPR(`${Math.min((Math.ceil(newAPR / 0.25) * 0.25), 100).toFixed(2)}%`)
      setEstimatedAPY(`${newAPY.toFixed(2)}%`)
    }
  }, [totalEquity, totalDebt])

  /**
   * Updates the collateral and underlying ratios
   */
  React.useEffect(() => {
    if (library) {
      (async () => {
        try {
          const vaultEngine = new Contract(VAULT_ENGINE, INTERFACES[VAULT_ENGINE].abi, library.getSigner())
          const {
            debt,
            collateral,
            underlying,
            initialEquity
          } = await vaultEngine.vaults(utils.id(currentAsset), account);
          const {
            debtAccumulator
          } = await vaultEngine.assets(utils.id(currentAsset));
          const ftsoContract = new Contract(FTSO, INTERFACES[FTSO].abi, library.getSigner())
          const { _price } = await ftsoContract.getCurrentPrice()
  
          const _debt = debt.mul(debtAccumulator)

          // Get collateral ratio
          if (_debt.toString() !== "0") {
            const numerator = Number(utils.formatEther(String(collateral))) * Number(utils.formatUnits(String(_price), 5))
            const denominator = Number(utils.formatUnits(String(_debt), 45))
            const _collateralRatio = `${((numerator / denominator) * 100).toFixed(4)}%`
            setCollateralRatio(_collateralRatio)
          } else {
            setCollateralRatio("0%")
          }

          // Get underlying ratio
          if (initialEquity.toString() !== "0") {
            const _underlyingRatio = `${underlying.mul(_price).div("100000").mul(100).mul(RAY).div(initialEquity).toString()}%`
            setUnderlyingRatio(_underlyingRatio)
          } else {
            setUnderlyingRatio("0%")
          }
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [account, library, chainId, totalDebt, totalEquity, currentAsset])

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
              
                <div className="accordion">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        <h5>Assets</h5>
                      </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show m-0">
                      <div className="accordion-body">
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
                            <li className="dropdown-item border" onClick={() => ctx.updateAsset(nativeTokenSymbol)}>
                              <div className="asset py-2 d-flex justify-content-between">
                                <h4 className="d-flex align-items-center mb-0">{nativeTokenSymbol}</h4>
                                <img src={FLR} className="rounded-circle border" alt={nativeTokenSymbol} height="50" />
                              </div>
                            </li>
                            <li className="dropdown-item border disabled" onClick={() => ctx.updateAsset("FXRP")}>
                              <div className="asset py-2 d-flex justify-content-between">
                                <h4 className="d-flex align-items-center mb-0">FXRP</h4>
                                <img src={XRP} className="rounded-circle border" alt="FXRP" height="50" />
                              </div>
                            </li>
                            <li className="dropdown-item border disabled" onClick={() => ctx.updateAsset("TUSD")}>
                              <div className="asset py-2 d-flex justify-content-between">
                                <h4 className="d-flex align-items-center mb-0">USD</h4>
                                <img src={TUSD} className="rounded-circle border" alt="USD" height="50" />
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div className="px-3 py-2">
                          <div className="row my-2">
                            <div className="col-6">
                              Standby
                            </div>
                            <div className="col-6 text-end">
                              <span className="text-truncate">{numbro(utils.formatEther(vault.standby)).format(formatOptions)} {ctx.asset}</span>
                            </div>
                          </div>
                          <div className="row my-2 text-truncate">
                            <div className="col-6">
                              Active
                            </div>
                            <div className="col-6 text-end">
                              <span className="text-truncate">{numbro(utils.formatEther(vault.underlying.add(vault.collateral))).format(formatOptions)} {ctx.asset}</span>
                            </div>
                          </div>
                          <div className="row my-2 text-truncate">
                            <div className="col-6">
                              Total
                            </div>
                            <div className="col-6 text-end">
                              <span className="text-truncate">{numbro(utils.formatEther(vault.standby.add(vault.underlying).add(vault.collateral))).format(formatOptions)} {ctx.asset}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                        <h5>Equity Position</h5>
                      </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo">
                      <div className="accordion-body">
                        <div className="row my-2 text-truncate">
                          <div className="col-6">
                            Equity Balance
                          </div>
                          <div className="col-6 text-end">
                            <span className="text-truncate">
                              {vault && asset ? numbro(utils.formatEther(vault.equity.mul(asset.equityAccumulator).div(RAY))).format({ ...formatOptions, mantissa: 8 }) : null} {getStablecoinSymbol(chainId!)}
                            </span>
                          </div>
                        </div>
                        <div className="row my-2 text-truncate">
                          <div className="col-6">
                            Underlying
                          </div>
                          <div className="col-6 text-end">
                            <span className="text-truncate">
                              {numbro(utils.formatEther(vault.underlying)).format(formatOptions)} {ctx.asset}
                            </span>
                          </div>
                        </div>
                        <div className="row my-2 text-truncate">
                          <div className="col-6">
                            Underlying Ratio
                          </div>
                          <div className="col-6 text-end">
                            <span className="text-truncate">{underlyingRatio}</span>
                          </div>
                        </div>
                        <div className="row my-2 text-truncate">
                          <div className="col-6">
                            Current APY
                          </div>
                          <div className="col-6 text-end">
                            <span className="text-truncate">{estimatedAPY}</span>
                          </div>
                        </div>
                        <div className="row my-2 text-truncate">
                          <div className="col-6">
                            Interest Earned
                          </div>
                          <div className="col-6 text-end">
                            <span className="text-truncate">
                              {vault && asset ? numbro(utils.formatUnits(vault.equity.mul(asset.equityAccumulator).sub(vault.initialEquity), 45)).format({ ...formatOptions, mantissa: 8 }) : null} {getStablecoinSymbol(chainId!)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingThree">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                        <h5>Debt Position</h5>
                      </button>
                    </h2>
                    <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree">
                      <div className="accordion-body">
                        <div className="row my-2">
                          <div className="col-6">
                            Debt Balance
                          </div>
                          <div className="col-6 text-end">
                            <span className="text-truncate">
                              {vault && asset ? numbro(utils.formatEther(vault.debt.mul(asset.debtAccumulator).div(RAY))).format({ ...formatOptions, mantissa: 8 }) : null} {getStablecoinSymbol(chainId!)}
                            </span>
                          </div>
                        </div>
                        <div className="row my-2">
                          <div className="col-6">
                            Collateral
                          </div>
                          <div className="col-6 text-end">
                            <span className="text-truncate">
                              {numbro(utils.formatEther(vault.collateral)).format(formatOptions)} {ctx.asset}
                            </span>
                          </div>
                        </div>
                        <div className="row my-2 text-truncate">
                          <div className="col-6">
                            Collateral Ratio
                          </div>
                          <div className="col-6 text-end">
                            <span className="text-truncate">{collateralRatio}</span>
                          </div>
                        </div>
                        <div className="row my-2 text-truncate">
                          <div className="col-6">
                            Current APR
                          </div>
                          <div className="col-6 text-end">
                            <span className="text-truncate">{estimatedAPR}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingFour">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                        <h5>Stablecoins</h5>
                      </button>
                    </h2>
                    <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour">
                      <div className="accordion-body">
                        <div className="row text-truncate my-2">
                          <div className="col-6">
                            Vault {getStablecoinSymbol(chainId!)}
                          </div>
                          <div className="col-6 text-end">
                            <span className="text-truncate">{vaultStablecoinBalance ? numbro(utils.formatEther(vaultStablecoinBalance.div(RAY))).format(formatOptions) : "0"} {getStablecoinSymbol(chainId!)}</span>
                          </div>
                        </div>
                        <div className="row text-truncate my-2">
                          <div className="col-6">
                            ERC20 {getStablecoinSymbol(chainId!)}
                          </div>
                          <div className="col-6 text-end">
                            <span className="text-truncate">{stablecoinERC20Balance ? numbro(utils.formatEther(stablecoinERC20Balance)).format(formatOptions) : "0"} {getStablecoinSymbol(chainId!)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingFive">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                          <h5>Voting Power</h5>
                        </button>
                      </h2>
                      <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive">
                        <div className="accordion-body">
                          <div className="row text-truncate my-2">
                            <div className="col-6">
                              Vault PBT
                            </div>
                            <div className="col-6 text-end">
                              <span className="text-truncate">{pbtBalance ? numbro(utils.formatEther(pbtBalance.div(RAY))).format(formatOptions) : "0"} PBT</span>
                            </div>
                          </div>
                          <div className="row text-truncate my-2">
                            <div className="col-6">
                              ERC20 PBT                 
                            </div>
                            <div className="col-6 text-end">
                              <span className="text-truncate">{pbtERC20Balance ? numbro(utils.formatEther(pbtERC20Balance)).format(formatOptions) : "0"} PBT</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              
            </>
          ) : (
            <>
              <h5>System Stats</h5>
              <div className="row my-2 mt-4 text-truncate">
                <div className="col-6">
                  <h6>Circulating Supply</h6>
                </div>
                  <div className="col-6 text-end">
                  <span className="text-truncate">{totalStablecoinSupply ? numbro(utils.formatEther(totalStablecoinSupply)).format(formatOptions) : null} {getStablecoinSymbol(chainId!)}</span>
                </div>
              </div>
              <div className="row my-2 text-truncate">
                <div className="col-6">
                  <h6>Total Supply</h6>
                </div>
                <div className="col-6 text-end">
                  <span className="text-truncate">{totalEquity && asset ? numbro(utils.formatEther(totalEquity.div(RAY).toString())).format(formatOptions) : null} {getStablecoinSymbol(chainId!)}</span>
                </div>
              </div>
              <div className="row my-2 text-truncate">
                <div className="col-6">
                  <h6>Working Capital</h6>
                </div>
                <div className="col-6 text-end">
                  <span className="text-truncate">{totalEquity && totalDebt && asset ? numbro(utils.formatUnits(totalEquity.sub(totalDebt).toString(), 45)).format(formatOptions) : null} {getStablecoinSymbol(chainId!)}</span>
                </div>
              </div>
              <div className="row my-2 text-truncate">
                <div className="col-6">
                  <h6>Utilization Ratio</h6>
                </div>
                <div className="col-6 text-end">
                  <span className="text-truncate">{totalEquity && totalDebt && asset ? numbro(utils.formatUnits(totalEquity.mul(RAY).div(totalDebt), 27)).format('0,0.0[000]') : null}%</span>
                </div>
              </div>
              <div className="row my-2 text-truncate">
                <div className="col-6">
                  <h6>Total Debt</h6>
                </div>
                <div className="col-6 text-end">
                  <span className="text-truncate">{totalDebt && asset ? numbro(utils.formatEther(totalDebt.div(RAY).toString())).format(formatOptions) : null} {getStablecoinSymbol(chainId!)}</span>
                </div>
              </div>
            </>
          )
        }
      </div>
    </>
  )
}

export default Balances;