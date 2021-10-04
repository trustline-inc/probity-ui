import { BigNumber } from "ethers";
import AureiABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/Aurei.sol/Aurei.json";
import BridgeABI from "@trustline-inc/probity/artifacts/contracts/Bridge.sol/Bridge.json";
import FtsoABI from "@trustline-inc/probity/artifacts/contracts/test/Ftso.sol/Ftso.json";
import NativeCollateralABI from "@trustline-inc/probity/artifacts/contracts/probity/collateral/NativeCollateral.sol/NativeCollateral.json";
import RegistryABI from "@trustline-inc/probity/artifacts/contracts/probity/Registry.sol/Registry.json";
import TcnTokenABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/TcnToken.sol/TcnToken.json";
import TellerABI from "@trustline-inc/probity/artifacts/contracts/probity/Teller.sol/Teller.json";
import TreasuryABI from "@trustline-inc/probity/artifacts/contracts/probity/Treasury.sol/Treasury.json";
import VaultEngineABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngine.sol/VaultEngine.json";

/**
 * Contract addresses
 */
export const AUREI_ADDRESS             = process.env && process.env.REACT_APP_AUREI_ADDRESS             ? process.env.REACT_APP_AUREI_ADDRESS             : "0x238f76EffC3F3d711847D48682304Bfaee357888";
export const BRIDGE_ADDRESS            = process.env && process.env.REACT_APP_BRIDGE_ADDRESS            ? process.env.REACT_APP_BRIDGE_ADDRESS            : "0x7B0E124460D7B84E035E65855d72711EE639970F";
export const FTSO_ADDRESS              = process.env && process.env.REACT_APP_FTSO_ADDRESS              ? process.env.REACT_APP_FTSO_ADDRESS              : "0x6278F4F18Ad235C27d3d6029B3Bdaa7dFB884A47";
export const NATIVE_COLLATERAL_ADDRESS = process.env && process.env.REACT_APP_NATIVE_COLLATERAL_ADDRESS ? process.env.REACT_APP_NATIVE_COLLATERAL_ADDRESS : "0x1aEf23136b3335b8E98a1a3A3A8324DfeA9C06E1";
export const REGISTRY_ADDRESS          = process.env && process.env.REACT_APP_REGISTRY_ADDRESS          ? process.env.REACT_APP_REGISTRY_ADDRESS          : "0xd62b12e7f8232c050bD87adFe7fA9071D864Fd19";
export const TCN_TOKEN_ADDRESS         = process.env && process.env.REACT_APP_TCN_TOKEN_ADDRESS         ? process.env.REACT_APP_TCN_TOKEN_ADDRESS         : "0xB8762F3F8A041018f9EFaec494dCA78f4968BcDb";
export const TELLER_ADDRESS            = process.env && process.env.REACT_APP_TELLER_ADDRESS            ? process.env.REACT_APP_TELLER_ADDRESS            : "0xf56dAde9c66c6bE12E5B529909066135e61834c8";
export const TREASURY_ADDRESS          = process.env && process.env.REACT_APP_TREASURY_ADDRESS          ? process.env.REACT_APP_TREASURY_ADDRESS          : "0x0581F116aB4Fe1F5bEBCd3dE0d66612D0F6C1EC6";
export const VAULT_ENGINE_ADDRESS      = process.env && process.env.REACT_APP_VAULT_ENGINE_ADDRESS      ? process.env.REACT_APP_VAULT_ENGINE_ADDRESS      : "0x39361717bF9C5C2F0e882D3D39fd7e45a4b7d94D";

/**
 * Contract ABIs
 */
export const INTERFACES = {
  [AUREI_ADDRESS]: AureiABI,
  [BRIDGE_ADDRESS]: BridgeABI,
  [FTSO_ADDRESS]: FtsoABI,
  [NATIVE_COLLATERAL_ADDRESS]: NativeCollateralABI,
  [REGISTRY_ADDRESS]: RegistryABI,
  [TCN_TOKEN_ADDRESS]: TcnTokenABI,
  [TELLER_ADDRESS]: TellerABI,
  [TREASURY_ADDRESS]: TreasuryABI,
  [VAULT_ENGINE_ADDRESS]: VaultEngineABI
}

// Other constants
export const RAD = BigNumber.from("1000000000000000000000000000000000000000000000");
export const RAY = BigNumber.from("1000000000000000000000000000");
export const WAD = BigNumber.from("1000000000000000000");
export const VERSION = process.env.REACT_APP_VERSION
