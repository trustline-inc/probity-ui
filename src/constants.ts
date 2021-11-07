import { BigNumber } from "ethers";
import AureiABI from "@trustline/probity/artifacts/contracts/probity/tokens/Aurei.sol/Aurei.json";
import PhiABI from "@trustline/probity/artifacts/contracts/probity/tokens/Phi.sol/Phi.json";
import AuctioneerABI from "@trustline/probity/artifacts/contracts/probity/Auctioneer.sol/Auctioneer.json";
import BridgeABI from "@trustline/solaris/artifacts/contracts/Bridge.sol/Bridge.json";
import FtsoABI from "@trustline/probity/artifacts/contracts/mocks/MockFtso.sol/MockFtso.json";
import NativeCollateralABI from "@trustline/probity/artifacts/contracts/probity/collateral/NativeCollateral.sol/NativeCollateral.json";
import RegistryABI from "@trustline/probity/artifacts/contracts/probity/Registry.sol/Registry.json";
import StateConnectorABI from "@trustline/solaris/artifacts/contracts/test/StateConnector.sol/StateConnector.json"
import TcnTokenABI from "@trustline/probity/artifacts/contracts/probity/tokens/TcnToken.sol/TcnToken.json";
import TellerABI from "@trustline/probity/artifacts/contracts/probity/Teller.sol/Teller.json";
import TreasuryABI from "@trustline/probity/artifacts/contracts/probity/Treasury.sol/Treasury.json";
import VaultEngineABI from "@trustline/probity/artifacts/contracts/probity/VaultEngine.sol/VaultEngine.json";

/**
 * Contract addresses
 */
export const AUREI            = process.env && process.env.REACT_APP_AUREI             ? process.env.REACT_APP_AUREI             : "0xcf9173ec85f051a509F4c21Ecb5EaaEDC1A98a21";
export const PHI              = process.env && process.env.REACT_APP_PHI               ? process.env.REACT_APP_PHI               : "0xcf9173ec85f051a509F4c21Ecb5EaaEDC1A98a21";
export const AUCTIONEER       = process.env && process.env.REACT_APP_AUCTIONEER        ? process.env.REACT_APP_AUCTIONEER        : "0x1aEf23136b3335b8E98a1a3A3A8324DfeA9C06E1";
export const BRIDGE           = process.env && process.env.REACT_APP_BRIDGE            ? process.env.REACT_APP_BRIDGE            : "0xB03C54535380286D61C06b64442DA1Edd9c01F10";
export const FTSO             = process.env && process.env.REACT_APP_FTSO              ? process.env.REACT_APP_FTSO              : "0x4ECaE26B874eb41A4cE87379E19E27E7034E4b5D";
export const NATIVE_COLLATERAL= process.env && process.env.REACT_APP_NATIVE_COLLATERAL ? process.env.REACT_APP_NATIVE_COLLATERAL : "0x0450790BCEFCfd953491f5130DFD3b572C67285F";
export const REGISTRY         = process.env && process.env.REACT_APP_REGISTRY          ? process.env.REACT_APP_REGISTRY          : "0x36514a1557476410b34B46903E73407D61679Bb8";
export const STATE_CONNECTOR  = process.env && process.env.REACT_APP_STATE_CONNECTOR   ? process.env.REACT_APP_STATE_CONNECTOR   : "0x36514a1557476410b34B46903E73407D61679Bb8";
export const TCN_TOKEN        = process.env && process.env.REACT_APP_TCN_TOKEN         ? process.env.REACT_APP_TCN_TOKEN         : "0x82756dc5c3a74422C1a95227e9A8832e33C337cb";
export const TELLER           = process.env && process.env.REACT_APP_TELLER            ? process.env.REACT_APP_TELLER            : "0x91931c05B6A0e130bf30Cc53e2d57048750952B1";
export const TREASURY         = process.env && process.env.REACT_APP_TREASURY          ? process.env.REACT_APP_TREASURY          : "0xf6D099B6C81ab597071f954700b73b3810e31c9D";
export const VAULT_ENGINE     = process.env && process.env.REACT_APP_VAULT_ENGINE      ? process.env.REACT_APP_VAULT_ENGINE      : "0x7F3951BD4B5939348CE1546B247E988FA61aeeA5";

/**
 * Contract ABIs
 */
export const INTERFACES = {
  [AUREI]: AureiABI,
  [PHI]: PhiABI,
  [AUCTIONEER]: AuctioneerABI,
  [BRIDGE]: BridgeABI,
  [FTSO]: FtsoABI,
  [NATIVE_COLLATERAL]: NativeCollateralABI,
  [REGISTRY]: RegistryABI,
  [STATE_CONNECTOR]: StateConnectorABI,
  [TCN_TOKEN]: TcnTokenABI,
  [TELLER]: TellerABI,
  [TREASURY]: TreasuryABI,
  [VAULT_ENGINE]: VaultEngineABI
}

// WalletConnect
export const DEFAULT_APP_METADATA = {
  name: "Probity",
  description: "A decentralized credit system",
  url: "https://probity.finance/",
  icons: ["https://probity.finance/probity-logo.png"],
};
export const DEFAULT_LOGGER = "debug"
export const DEFAULT_RELAY_PROVIDER = "wss://relay.walletconnect.org";
export const DEFAULT_METHODS = ["createTrustLine"];

// Other constants
export const RAD = BigNumber.from("1000000000000000000000000000000000000000000000");
export const RAY = BigNumber.from("1000000000000000000000000000");
export const WAD = BigNumber.from("1000000000000000000");
export const VERSION = process.env.REACT_APP_VERSION
