import { BigNumber } from "ethers";
import AureiABI from "@trustline/probity/artifacts/contracts/probity/tokens/Aurei.sol/Aurei.json";
import PhiABI from "@trustline/probity/artifacts/contracts/probity/tokens/Phi.sol/Phi.json";
import AuctioneerABI from "@trustline/probity/artifacts/contracts/probity/Auctioneer.sol/Auctioneer.json";
import BridgeABI from "@trustline/solaris/artifacts/contracts/Bridge.sol/Bridge.json";
import FtsoABI from "@trustline/probity/artifacts/contracts/mocks/MockFtso.sol/MockFtso.json";
import LiquidatorABI from "@trustline/probity/artifacts/contracts/probity/Liquidator.sol/Liquidator.json";
import PriceFeedABI from "@trustline/probity/artifacts/contracts/probity/PriceFeed.sol/PriceFeed.json";
import NativeCollateralABI from "@trustline/probity/artifacts/contracts/probity/collateral/NativeCollateral.sol/NativeCollateral.json";
import RegistryABI from "@trustline/probity/artifacts/contracts/probity/Registry.sol/Registry.json";
import ReservePoolABI from "@trustline/probity/artifacts/contracts/probity/ReservePool.sol/ReservePool.json";
import StateConnectorABI from "@trustline/solaris/artifacts/contracts/test/StateConnector.sol/StateConnector.json"
import PbtTokenABI from "@trustline/probity/artifacts/contracts/probity/tokens/PbtToken.sol/PbtToken.json";
import TellerABI from "@trustline/probity/artifacts/contracts/probity/Teller.sol/Teller.json";
import TreasuryABI from "@trustline/probity/artifacts/contracts/probity/Treasury.sol/Treasury.json";
import VaultEngineSBABI from "@trustline/probity/artifacts/contracts/probity/songbird/VaultEngineSB.sol/VaultEngineSB.json";

/**
 * Contract addresses
 */
export const AUREI             = process.env && process.env.REACT_APP_AUREI             ? process.env.REACT_APP_AUREI             : "";
export const PHI               = process.env && process.env.REACT_APP_PHI               ? process.env.REACT_APP_PHI               : "";
export const AUCTIONEER        = process.env && process.env.REACT_APP_AUCTIONEER        ? process.env.REACT_APP_AUCTIONEER        : "";
export const BRIDGE            = process.env && process.env.REACT_APP_BRIDGE            ? process.env.REACT_APP_BRIDGE            : "";
export const FTSO              = process.env && process.env.REACT_APP_FTSO              ? process.env.REACT_APP_FTSO              : "";
export const LIQUIDATOR        = process.env && process.env.REACT_APP_LIQUIDATOR        ? process.env.REACT_APP_LIQUIDATOR        : ""
export const PRICE_FEED        = process.env && process.env.REACT_APP_PRICE_FEED        ? process.env.REACT_APP_PRICE_FEED        : "";
export const NATIVE_COLLATERAL = process.env && process.env.REACT_APP_NATIVE_COLLATERAL ? process.env.REACT_APP_NATIVE_COLLATERAL : "";
export const REGISTRY          = process.env && process.env.REACT_APP_REGISTRY          ? process.env.REACT_APP_REGISTRY          : "";
export const STATE_CONNECTOR   = process.env && process.env.REACT_APP_STATE_CONNECTOR   ? process.env.REACT_APP_STATE_CONNECTOR   : "";
export const PBT_TOKEN         = process.env && process.env.REACT_APP_PBT_TOKEN         ? process.env.REACT_APP_PBT_TOKEN         : "";
export const RESERVE_POOL      = process.env && process.env.REACT_APP_RESERVE_POOL      ? process.env.REACT_APP_RESERVE_POOL      : "";
export const TELLER            = process.env && process.env.REACT_APP_TELLER            ? process.env.REACT_APP_TELLER            : "";
export const TREASURY          = process.env && process.env.REACT_APP_TREASURY          ? process.env.REACT_APP_TREASURY          : "";
export const VAULT_ENGINE      = process.env && process.env.REACT_APP_VAULT_ENGINE      ? process.env.REACT_APP_VAULT_ENGINE      : "";

/**
 * Contract ABIs
 * Contract addresses are lowercase because web3.eth.sendTransaction returns `tx.to` in lowercase.
 */
export const INTERFACES = {
  [AUREI]: AureiABI,
  [PHI]: PhiABI,
  [AUCTIONEER]: AuctioneerABI,
  [BRIDGE]: BridgeABI,
  [FTSO]: FtsoABI,
  [LIQUIDATOR]: LiquidatorABI,
  [PRICE_FEED]: PriceFeedABI,
  [NATIVE_COLLATERAL]: NativeCollateralABI,
  [REGISTRY]: RegistryABI,
  [RESERVE_POOL]: ReservePoolABI,
  [STATE_CONNECTOR]: StateConnectorABI,
  [PBT_TOKEN]: PbtTokenABI,
  [TELLER]: TellerABI,
  [TREASURY]: TreasuryABI,
  [VAULT_ENGINE]: VaultEngineSBABI
}

// WalletConnect
export const DEFAULT_APP_METADATA = {
  name: "Probity",
  description: "A decentralized credit system",
  url: "https://probity.finance/",
  icons: ["https://probity.finance/probity-logo.png"],
};
export const DEFAULT_LOGGER = "debug"
export const DEFAULT_RELAY_PROVIDER = "wss://relay.walletconnect.com";
export const DEFAULT_METHODS = ["createTrustLine"];

// Other constants
export const RAD = BigNumber.from("1000000000000000000000000000000000000000000000");
export const RAY = BigNumber.from("1000000000000000000000000000");
export const WAD = BigNumber.from("1000000000000000000");
export const VERSION = process.env.REACT_APP_VERSION
