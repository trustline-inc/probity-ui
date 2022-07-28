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
  1337: {
    USD: {
      address: "0xa7db5AB2eEb901Ab81eD5F500A53Ea411A33305E",
      abi: UsdABI.abi
    },
    AUCTIONEER: {
      address: "0x39dcFf08F4060Cac48A7A2506b3B92eC6DBA9C02",
      abi: AuctioneerABI.abi
    },
    // NOTE: BRIDGE is deployed from https://github.com/trustline-inc/solaris-sdk
    BRIDGE: {
      address: "",
      abi: BridgeABI.abi
    },
    LIQUIDATOR: {
      address: "0x87F1dC4940968F55854141c18fcC9BFD48E3dD18",
      abi: LiquidatorABI.abi
    },
    USD_MANAGER: {
      address: "0xfB2e8D1A52760aF87F5E54828f5eF19FA9437cf3",
      abi: Erc20AssetManagerABI.abi
    },
    PRICE_FEED: {
      address: "0x2c7C5fE98482fe9a3f01D94f67408eA0DCaA3fdb",
      abi: PriceFeedABI.abi
    },
    NATIVE_ASSET_MANAGER: {
      address: "0x99CDaDd8dB08055B5125b8d0493e9Ce42FbC80c7",
      abi: NativeAssetManagerABI.abi
    },
    REGISTRY: {
      address: "0xBc20dF627E8513Fb56F64E41dB7E4AA39202782e",
      abi: RegistryABI.abi
    },
    PBT: {
      address: "0xF388b171C7008fd69c22468850DA7079770785eB",
      abi: PbtABI.abi
    },
    RESERVE_POOL: {
      address: "0xaA24A48ffdD3605A60D1aE93C9A6428E7DAB5cE9",
      abi: ReservePoolABI.abi
    },
    TELLER: {
      address: "0xDD31E3e0A39F1604e6B4a48Cb8a86FE395bF5186",
      abi: TellerABI.abi
    },
    TREASURY: {
      address: "0x7F9De1AC1Cb10fa5b15E3CF31eD9838a132026fE",
      abi: TreasuryABI.abi
    },
    VAULT_ENGINE: {
      address: "0xdf38A687f4A8E235e64C143810044C7877132E8E",
      abi: VaultEngineABI.abi
    },
    INTERFACES: {
      "0xa7db5AB2eEb901Ab81eD5F500A53Ea411A33305E": UsdABI,
      "0x39dcFf08F4060Cac48A7A2506b3B92eC6DBA9C02": AuctioneerABI,
      "0x87F1dC4940968F55854141c18fcC9BFD48E3dD18": LiquidatorABI,
      "0x2c7C5fE98482fe9a3f01D94f67408eA0DCaA3fdb": PriceFeedABI,
      "0x99CDaDd8dB08055B5125b8d0493e9Ce42FbC80c7": NativeAssetManagerABI,
      "0xfB2e8D1A52760aF87F5E54828f5eF19FA9437cf3": Erc20AssetManagerABI,
      "0xBc20dF627E8513Fb56F64E41dB7E4AA39202782e": RegistryABI,
      "0xF388b171C7008fd69c22468850DA7079770785eB": PbtABI,
      "0xaA24A48ffdD3605A60D1aE93C9A6428E7DAB5cE9": ReservePoolABI,
      "0xDD31E3e0A39F1604e6B4a48Cb8a86FE395bF5186": TellerABI,
      "0x7F9De1AC1Cb10fa5b15E3CF31eD9838a132026fE": TreasuryABI,
      "0xdf38A687f4A8E235e64C143810044C7877132E8E": VaultEngineABI
    }
  },
  // Songbird
  16: {
    USD: {
      address: "0x5322E9cE9DFc60372222F899D2B3683D45D9C167",
      abi: UsdABI.abi
    },
    AUCTIONEER: {
      address: "0x80584b42bC51219fB5556e27fa6c16ADbaEA1E53",
      abi: AuctioneerABI.abi
    },
    BRIDGE: {
      address: "",
      abi: null
    },
    LIQUIDATOR: {
      address: "0xfE850285031a976de274b969d098fBb9E94fc7bb",
      abi: LiquidatorABI.abi
    },
    PRICE_FEED: {
      address: "0x51D82d9d17fAdaC40cDef03cf9CB07b1Fb65563C",
      abi: PriceFeedABI.abi
    },
    NATIVE_ASSET_MANAGER: {
      address: "0x836BD8CBf5baFc971012397879490Ef7Ede64a38",
      abi: NativeAssetManagerABI.abi
    },
    REGISTRY: {
      address: "0xCA33D13E5D03b262C06E98244cb47328d5f890f3",
      abi: RegistryABI.abi
    },
    PBT: {
      address: "0x9E9600168c3b6FA0d3A779956969c41aaD21e1a1",
      abi: PbtABI.abi
    },
    RESERVE_POOL: {
      address: "0x13F332fd05F85909E1f1a74949c30fC74D9Ce3B1",
      abi: ReservePoolABI.abi
    },
    TELLER: {
      address: "0x25bb8E3bf6228e9cd4F8A29337438357BdDbDfeF",
      abi: TellerABI.abi
    },
    TREASURY: {
      address: "0x08E6eC157F126d30D3E2Ba0f9c3F95Fb53bd0613",
      abi: TreasuryABI.abi
    },
    VAULT_ENGINE: {
      address: "0x02b1A3b0efB8D04A3d91e3CD548885bC4c4bC1c7",
      abi: VaultEngineLimitedABI.abi
    },
    INTERFACES: {
      "0x5322E9cE9DFc60372222F899D2B3683D45D9C167": UsdABI,
      "0x80584b42bC51219fB5556e27fa6c16ADbaEA1E53": AuctioneerABI,
      "0xfE850285031a976de274b969d098fBb9E94fc7bb": LiquidatorABI,
      "0x51D82d9d17fAdaC40cDef03cf9CB07b1Fb65563C": PriceFeedABI,
      "0x836BD8CBf5baFc971012397879490Ef7Ede64a38": NativeAssetManagerABI,
      "": Erc20AssetManagerABI,
      "0xCA33D13E5D03b262C06E98244cb47328d5f890f3": RegistryABI,
      "0x9E9600168c3b6FA0d3A779956969c41aaD21e1a1": PbtABI,
      "0x13F332fd05F85909E1f1a74949c30fC74D9Ce3B1": ReservePoolABI,
      "0x25bb8E3bf6228e9cd4F8A29337438357BdDbDfeF": TellerABI,
      "0x08E6eC157F126d30D3E2Ba0f9c3F95Fb53bd0613": TreasuryABI,
      "0x02b1A3b0efB8D04A3d91e3CD548885bC4c4bC1c7": VaultEngineABI
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
