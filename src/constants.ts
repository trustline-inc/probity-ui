import { BigNumber } from "ethers";
import UsdABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/Usd.sol/USD.json";
import AuctioneerABI from "@trustline-inc/probity/artifacts/contracts/probity/Auctioneer.sol/Auctioneer.json";
import BridgeABI from "@trustline-inc/bridge/artifacts/contracts/Bridge.sol/Bridge.json";
import LiquidatorABI from "@trustline-inc/probity/artifacts/contracts/probity/Liquidator.sol/Liquidator.json";
import PriceFeedABI from "@trustline-inc/probity/artifacts/contracts/probity/PriceFeed.sol/PriceFeed.json";
import NativeAssetManagerABI from "@trustline-inc/probity/artifacts/contracts/probity/assets/NativeAssetManager.sol/NativeAssetManager.json";
import Erc20AssetManagerABI from "@trustline-inc/probity/artifacts/contracts/probity/assets/ERC20AssetManager.sol/ERC20AssetManager.json";
import RegistryABI from "@trustline-inc/probity/artifacts/contracts/probity/Registry.sol/Registry.json";
import ReservePoolABI from "@trustline-inc/probity/artifacts/contracts/probity/ReservePool.sol/ReservePool.json";
import StateConnectorABI from "@trustline-inc/bridge/artifacts/contracts/test/StateConnector.sol/StateConnector.json"
import PbtABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/Pbt.sol/PBT.json";
import TellerABI from "@trustline-inc/probity/artifacts/contracts/probity/Teller.sol/Teller.json";
import TreasuryABI from "@trustline-inc/probity/artifacts/contracts/probity/Treasury.sol/Treasury.json";
import VaultEngineABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngine.sol/VaultEngine.json";
import VaultEngineIssuerABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngineIssuer.sol/VaultEngineIssuer.json";
import VaultEngineLimitedABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngineLimited.sol/VaultEngineLimited.json";
import VaultEngineUnrestrictedABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngineUnrestricted.sol/VaultEngineUnrestricted.json";

/**
 * Contract addresses
 */
export const CONTRACTS: { [key: number]: any } = {
  // Local
  4294967295: {
    USD: {
      address: "0x5B6A3735f981e7D191229FadA854DedfB02Bf341",
      abi: UsdABI.abi
    },
    AUCTIONEER: {
      address: "0x8990547b9DBd227a9f758960CEE0bae43d1c6DB2",
      abi: AuctioneerABI.abi
    },
    // NOTE: BRIDGE is deployed from https://github.com/trustline-inc/solaris-sdk
    BRIDGE: {
      address: "",
      abi: BridgeABI.abi
    },
    LIQUIDATOR: {
      address: "0x826D41d24eF10E24388a32ee0E37aEB40ed84a72",
      abi: LiquidatorABI.abi
    },
    USD_MANAGER: {
      address: "0x077a26C9D83044bBF376c18CA546E3F9Cde19a4E",
      abi: Erc20AssetManagerABI.abi
    },
    PRICE_FEED: {
      address: "0x2cB106e7DC976807Db28F34b0c6C63f661074899",
      abi: PriceFeedABI.abi
    },
    NATIVE_ASSET_MANAGER: {
      address: "0x51c22C95180b38a44e32fae2B25B79CbA10Bac97",
      abi: NativeAssetManagerABI.abi
    },
    REGISTRY: {
      address: "0xd4605c18B944515DDAE8E5568bB139794aFE8a59",
      abi: RegistryABI.abi
    },
    PBT: {
      address: "0x7c935e525cB6D5c9A4Bc618ADF948a9a4ecC0f1D",
      abi: PbtABI.abi
    },
    RESERVE_POOL: {
      address: "0xB4B57DeDC27aecf11bf6505653e323FD9CC138EB",
      abi: ReservePoolABI.abi
    },
    TELLER: {
      address: "0x895742455acae0F62ca8dEBA5699159BCd176325",
      abi: TellerABI.abi
    },
    TREASURY: {
      address: "0x94cc2044Fd152F633F89E202e8A93620Ce8C3D6A",
      abi: TreasuryABI.abi
    },
    VAULT_ENGINE: {
      address: "0xED96EE55607a6D5D09FCc0d36065b2427A680D1a",
      abi: VaultEngineIssuerABI.abi
    },
    INTERFACES: {
      "0x5B6A3735f981e7D191229FadA854DedfB02Bf341": UsdABI,
      "0x8990547b9DBd227a9f758960CEE0bae43d1c6DB2": AuctioneerABI,
      "0x826D41d24eF10E24388a32ee0E37aEB40ed84a72": LiquidatorABI,
      "0x2cB106e7DC976807Db28F34b0c6C63f661074899": PriceFeedABI,
      "0x51c22C95180b38a44e32fae2B25B79CbA10Bac97": NativeAssetManagerABI,
      "0x077a26C9D83044bBF376c18CA546E3F9Cde19a4E": Erc20AssetManagerABI,
      "0xd4605c18B944515DDAE8E5568bB139794aFE8a59": RegistryABI,
      "0x7c935e525cB6D5c9A4Bc618ADF948a9a4ecC0f1D": PbtABI,
      "0xB4B57DeDC27aecf11bf6505653e323FD9CC138EB": ReservePoolABI,
      "0x895742455acae0F62ca8dEBA5699159BCd176325": TellerABI,
      "0x94cc2044Fd152F633F89E202e8A93620Ce8C3D6A": TreasuryABI,
      "0xED96EE55607a6D5D09FCc0d36065b2427A680D1a": VaultEngineIssuerABI
    }
  },
  // Coston
  19: {

  }
}

// WalletConnect
export const PROJECT_ID = process.env.REACT_APP_WC_PROJECT_ID
export const DEFAULT_APP_METADATA = {
  name: "Probity",
  description: "A credit facility protocol",
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
