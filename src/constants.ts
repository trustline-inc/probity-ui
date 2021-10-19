import { BigNumber } from "ethers";
import AureiABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/Aurei.sol/Aurei.json";
import AuctioneerABI from "@trustline-inc/probity/artifacts/contracts/probity/Auctioneer.sol/Auctioneer.json";
import BridgeABI from "@trustline/solaris/artifacts/contracts/Bridge.sol/Bridge.json";
import FtsoABI from "@trustline-inc/probity/artifacts/contracts/mocks/MockFtso.sol/MockFtso.json";
import NativeCollateralABI from "@trustline-inc/probity/artifacts/contracts/probity/collateral/NativeCollateral.sol/NativeCollateral.json";
import RegistryABI from "@trustline-inc/probity/artifacts/contracts/probity/Registry.sol/Registry.json";
import StateConnectorABI from "@trustline/solaris/artifacts/contracts/test/StateConnector.sol/StateConnector.json"
import TcnTokenABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/TcnToken.sol/TcnToken.json";
import TellerABI from "@trustline-inc/probity/artifacts/contracts/probity/Teller.sol/Teller.json";
import TreasuryABI from "@trustline-inc/probity/artifacts/contracts/probity/Treasury.sol/Treasury.json";
import VaultEngineABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngine.sol/VaultEngine.json";

/**
 * Contract addresses
 */
export const AUREI_ADDRESS             = process.env && process.env.REACT_APP_AUREI_ADDRESS             ? process.env.REACT_APP_AUREI_ADDRESS             : "0xcf9173ec85f051a509F4c21Ecb5EaaEDC1A98a21";
export const AUCTIONEER_ADDRESS        = process.env && process.env.REACT_APP_AUCTIONEER_ADDRESS        ? process.env.REACT_APP_AUCTIONEER_ADDRESS        : "0x1aEf23136b3335b8E98a1a3A3A8324DfeA9C06E1";
export const BRIDGE_ADDRESS            = process.env && process.env.REACT_APP_BRIDGE_ADDRESS            ? process.env.REACT_APP_BRIDGE_ADDRESS            : "0xB03C54535380286D61C06b64442DA1Edd9c01F10";
export const FTSO_ADDRESS              = process.env && process.env.REACT_APP_FTSO_ADDRESS              ? process.env.REACT_APP_FTSO_ADDRESS              : "0x4ECaE26B874eb41A4cE87379E19E27E7034E4b5D";
export const NATIVE_COLLATERAL_ADDRESS = process.env && process.env.REACT_APP_NATIVE_COLLATERAL_ADDRESS ? process.env.REACT_APP_NATIVE_COLLATERAL_ADDRESS : "0x0450790BCEFCfd953491f5130DFD3b572C67285F";
export const REGISTRY_ADDRESS          = process.env && process.env.REACT_APP_REGISTRY_ADDRESS          ? process.env.REACT_APP_REGISTRY_ADDRESS          : "0x36514a1557476410b34B46903E73407D61679Bb8";
export const STATE_CONNECTOR_ADDRESS   = process.env && process.env.REACT_APP_STATE_CONNECTOR_ADDRESS   ? process.env.REACT_APP_STATE_CONNECTOR_ADDRESS   : "0x36514a1557476410b34B46903E73407D61679Bb8";
export const TCN_TOKEN_ADDRESS         = process.env && process.env.REACT_APP_TCN_TOKEN_ADDRESS         ? process.env.REACT_APP_TCN_TOKEN_ADDRESS         : "0x82756dc5c3a74422C1a95227e9A8832e33C337cb";
export const TELLER_ADDRESS            = process.env && process.env.REACT_APP_TELLER_ADDRESS            ? process.env.REACT_APP_TELLER_ADDRESS            : "0x91931c05B6A0e130bf30Cc53e2d57048750952B1";
export const TREASURY_ADDRESS          = process.env && process.env.REACT_APP_TREASURY_ADDRESS          ? process.env.REACT_APP_TREASURY_ADDRESS          : "0xf6D099B6C81ab597071f954700b73b3810e31c9D";
export const VAULT_ENGINE_ADDRESS      = process.env && process.env.REACT_APP_VAULT_ENGINE_ADDRESS      ? process.env.REACT_APP_VAULT_ENGINE_ADDRESS      : "0x7F3951BD4B5939348CE1546B247E988FA61aeeA5";

/**
 * Contract ABIs
 */
export const INTERFACES = {
  [AUREI_ADDRESS]: AureiABI,
  [AUCTIONEER_ADDRESS]: AuctioneerABI,
  [BRIDGE_ADDRESS]: BridgeABI,
  [FTSO_ADDRESS]: FtsoABI,
  [NATIVE_COLLATERAL_ADDRESS]: NativeCollateralABI,
  [REGISTRY_ADDRESS]: RegistryABI,
  [STATE_CONNECTOR_ADDRESS]: StateConnectorABI,
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
