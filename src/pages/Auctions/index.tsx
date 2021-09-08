import { useEffect, useState, useContext } from "react";
import { utils } from "ethers";
import Activity from "../../containers/Activity";
import { AUREI_ADDRESS, TELLER_ADDRESS, TREASURY_ADDRESS, VAULT_ADDRESS } from '../../constants';
import AureiABI from "@trustline-inc/aurei/artifacts/contracts/Aurei.sol/Aurei.json";
import TellerABI from "@trustline-inc/aurei/artifacts/contracts/Teller.sol/Teller.json";
import TreasuryABI from "@trustline-inc/aurei/artifacts/contracts/Treasury.sol/Treasury.json";
import VaultABI from "@trustline-inc/aurei/artifacts/contracts/Vault.sol/Vault.json";
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from "ethers";
import { Activity as ActivityType } from "../../types";
import numeral from "numeral";
import EventContext from "../../contexts/TransactionContext"

function Auctions({ collateralPrice }: { collateralPrice: number }) {
  const [users, setUsers] = useState([]);
  const [vaults, setVaults] = useState<any>([]);
  const [price, setPrice] = useState(0.00);
  const { library, active } = useWeb3React<Web3Provider>()
  const [error, setError] = useState<any|null>(null);
  const ctx = useContext(EventContext)

  useEffect(() => {
    if (library) {
      const runEffect = async () => {
        const vault = new Contract(VAULT_ADDRESS, VaultABI.abi, library.getSigner())
        const _users = await vault.getUsers();
        setUsers(_users);
      }

      runEffect();
    }
  }, [library])

  useEffect(() => {
    if (library) {
      const runEffect = async () => {
        const _vaults: any[] = [];
        for (let address of users) {
          const teller = new Contract(TELLER_ADDRESS, TellerABI.abi, library.getSigner())
          const treasury = new Contract(TREASURY_ADDRESS, TreasuryABI.abi, library.getSigner())
          const vault = new Contract(VAULT_ADDRESS, VaultABI.abi, library.getSigner())
          const debt = await teller.balanceOf(address);
          const capital = await treasury.capitalOf(address);
          const [loanCollateral, stakedCollateral] = await vault.balanceOf(address);
          _vaults.push({
            address: address,
            debt: numeral(utils.formatEther(debt.toString()).toString()).format('$0,0.00'),
            capital: numeral(utils.formatEther(capital.toString()).toString()).format('$0,0.00'),
            loanCollateral: numeral(Number(utils.formatEther(loanCollateral.toString())) * collateralPrice).format('$0,0.00'),
            stakedCollateral: numeral(Number(utils.formatEther(stakedCollateral.toString())) * collateralPrice).format('$0,0.00'),
            loanLiquidationEligible: Number(utils.formatEther(loanCollateral.toString())) * collateralPrice < (Number(utils.formatEther(debt.toString())) * 1.5),
            capitalLiquidationEligible: Number(utils.formatEther(stakedCollateral.toString())) * collateralPrice < (Number(utils.formatEther(capital.toString())) * 1.5),
          });
        }
        setVaults(_vaults);
      }

      runEffect();
    }
  }, [library, users, collateralPrice])

  const liquidate = async (address: string, type: string) => {
    if (library) {
      const aurei = new Contract(AUREI_ADDRESS, AureiABI.abi, library.getSigner())
      const teller = new Contract(TELLER_ADDRESS, TellerABI.abi, library.getSigner())
      const treasury = new Contract(TREASURY_ADDRESS, TreasuryABI.abi, library.getSigner())

      try {
        let result, data;
        if (type === "debt") {
          result = await aurei.approve(
            TELLER_ADDRESS,
            utils.parseEther(price.toString()).toString()
          );
          data = await result.wait();
          ctx.updateTransactions(data);
          result = await teller.liquidate(address, utils.parseEther(price.toString()).toString());
          data = await result.wait();
          ctx.updateTransactions(data);
        } else {
          result = await treasury.liquidate(address)
          data = await result.wait();
          ctx.updateTransactions(data);
        }
        console.log(result);
      } catch (error) {
        console.error(error)
        setError(error);
      }
    }
  }

  const liquidationEligibleVaults = vaults.filter((vault: any) => vault.loanLiquidationEligible || vault.capitalLiquidationEligible).map((vault: any, index: number) => {
    return (
      <div key={index} className="row">
        <div className="col-8 border">
          <pre className="mt-3">{JSON.stringify(vault, null, 2)}</pre>
        </div>
        <div className="col-4 d-flex justify-content-center align-items-center">
          <div>
            <div className="mb-3">
              <label htmlFor="purchase_price" className="form-label">Purchase Price</label>
              <input type="number" className="form-control" id="purchase_price" placeholder="0.00" onChange={event => setPrice(Number(event.target.value))} disabled={!vault.loanLiquidationEligible} />
              <small className="text-muted">Purchase price in AUR (debt liquidation)</small>
            </div>
            <button className="btn btn-primary my-2 w-100" disabled={!vault.loanLiquidationEligible} onClick={() => liquidate(vault.address, "debt")}>
              Liquidate Debt
            </button>
            <br/>
            <button className="btn btn-primary w-100" disabled={!vault.capitalLiquidationEligible} onClick={() => liquidate(vault.address, "capital")}>
              Liquidate Capital
            </button>
          </div>
        </div>
        <hr className="my-3" />
      </div>
    )
  })

  const nonEligibleVaults = vaults.filter((vault: any) => !vault.loanLiquidationEligible && !vault.capitalLiquidationEligible).map((vault: any, index: number) => {
    return (
      <div key={index} className="row">
        <div className="col-12 border">
          <pre className="mt-3">{JSON.stringify(vault, null, 2)}</pre>
        </div>
        <hr className="my-3" />
      </div>
    )
  })

  return (
    <Activity active={active} activity={ActivityType.Liquidate} error={error}>
      <h4>Under-Collateralized Vaults</h4>
      {liquidationEligibleVaults}
      {liquidationEligibleVaults.length === 0 && (
        <>
          <div className="d-flex justify-content-center align-items-center py-5">
            No vault collateral is currently eligible for auction
          </div>
          <div>

          </div>
        </>
      )}
      <div className="py-1" />
      <h4>Non-Eligible Vaults</h4>
      {nonEligibleVaults}
    </Activity>
  )
}

export default Auctions;