import { BigNumber } from "ethers";
import AureiABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/Aurei.sol/Aurei.json";
import AuctioneerABI from "@trustline-inc/probity/artifacts/contracts/probity/Auctioneer.sol/Auctioneer.json";
import BridgeABI from "@trustline-inc/bridge/artifacts/contracts/Bridge.sol/Bridge.json";
import LiquidatorABI from "@trustline-inc/probity/artifacts/contracts/probity/Liquidator.sol/Liquidator.json";
import PriceFeedABI from "@trustline-inc/probity/artifacts/contracts/probity/PriceFeed.sol/PriceFeed.json";
import NativeAssetManagerABI from "@trustline-inc/probity/artifacts/contracts/probity/assets/NativeAssetManager.sol/NativeAssetManager.json";
import RegistryABI from "@trustline-inc/probity/artifacts/contracts/probity/Registry.sol/Registry.json";
import ReservePoolABI from "@trustline-inc/probity/artifacts/contracts/probity/ReservePool.sol/ReservePool.json";
import StateConnectorABI from "@trustline-inc/bridge/artifacts/contracts/test/StateConnector.sol/StateConnector.json"
import PbtTokenABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/PbtToken.sol/PbtToken.json";
import TellerABI from "@trustline-inc/probity/artifacts/contracts/probity/Teller.sol/Teller.json";
import TreasuryABI from "@trustline-inc/probity/artifacts/contracts/probity/Treasury.sol/Treasury.json";
import VaultEngineABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngine.sol/VaultEngine.json";
import VaultEngineLimitedABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngineLimited.sol/VaultEngineLimited.json";
import VaultEngineUnrestrictedABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngineUnrestricted.sol/VaultEngineUnrestricted.json";

/**
 * Contract addresses
 */
export const CONTRACTS: { [key: number]: any } = {
  // Local
  1337: {
    AUREI: {
      address: "0x320Dd91E71490799a763EE0e08626C634C44467b",
      abi: AureiABI.abi
    },
    AUCTIONEER: {
      address: "0x23C72E4b949f30476E03B099A7c09D871ECD234f",
      abi: AuctioneerABI.abi
    },
    BRIDGE: {
      address: "",
      abi: null
    },
    LIQUIDATOR: {
      address: "0xAd7a92efd3f13e13C5259Ad170e28b7f25343509",
      abi: LiquidatorABI.abi
    },
    PRICE_FEED: {
      address: "0xdd3667DF55db13F6B36eb46d5168f6DFB59E20dF",
      abi: PriceFeedABI.abi
    },
    NATIVE_ASSET_MANAGER: {
      address: "0xe6Ddb964B81db85aa920d3eCDF692334aA0236dA",
      abi: NativeAssetManagerABI.abi
    },
    REGISTRY: {
      address: "0xa0004f1e4dB53925C89900EC1dD8774BCA08c451",
      abi: RegistryABI.abi
    },
    PBT_TOKEN: {
      address: "0x3aa5D1683c8c2af0bf98c986d2B25dBA239DdFaa",
      abi: PbtTokenABI.abi
    },
    RESERVE_POOL: {
      address: "0xcd012878cC015788767fb0B07ffba6a00b831B76",
      abi: ReservePoolABI.abi
    },
    TELLER: {
      address: "0x004E80Ae535360322b070c4d380308D1A0177b21",
      abi: TellerABI.abi
    },
    TREASURY: {
      address: "0x1fC60084AdC09B7617BC3431F1008851AfaC03D6",
      abi: TreasuryABI.abi
    },
    VAULT_ENGINE: {
      address: "0x40c7009A2e026d596bB9E61C909d6F8eB255dcFa",
      abi: VaultEngineLimitedABI.abi
    },
    INTERFACES: {
      "0x320Dd91E71490799a763EE0e08626C634C44467b": AureiABI,
      "0x23C72E4b949f30476E03B099A7c09D871ECD234f": AuctioneerABI,
      "0xAd7a92efd3f13e13C5259Ad170e28b7f25343509": LiquidatorABI,
      "0xdd3667DF55db13F6B36eb46d5168f6DFB59E20dF": PriceFeedABI,
      "0xe6Ddb964B81db85aa920d3eCDF692334aA0236dA": NativeAssetManagerABI,
      "0xa0004f1e4dB53925C89900EC1dD8774BCA08c451": RegistryABI,
      "0x3aa5D1683c8c2af0bf98c986d2B25dBA239DdFaa": PbtTokenABI,
      "0xcd012878cC015788767fb0B07ffba6a00b831B76": ReservePoolABI,
      "0x004E80Ae535360322b070c4d380308D1A0177b21": TellerABI,
      "0x1fC60084AdC09B7617BC3431F1008851AfaC03D6": TreasuryABI,
      "0x40c7009A2e026d596bB9E61C909d6F8eB255dcFa": VaultEngineABI
    }
  },
  // Songbird
  16: {
    AUREI: {
      address: "0x5322E9cE9DFc60372222F899D2B3683D45D9C167",
      abi: AureiABI.abi
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
    PBT_TOKEN: {
      address: "0x9E9600168c3b6FA0d3A779956969c41aaD21e1a1",
      abi: PbtTokenABI.abi
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
      "0x5322E9cE9DFc60372222F899D2B3683D45D9C167": AureiABI,
      "0x80584b42bC51219fB5556e27fa6c16ADbaEA1E53": AuctioneerABI,
      "0xfE850285031a976de274b969d098fBb9E94fc7bb": LiquidatorABI,
      "0x51D82d9d17fAdaC40cDef03cf9CB07b1Fb65563C": PriceFeedABI,
      "0x836BD8CBf5baFc971012397879490Ef7Ede64a38": NativeAssetManagerABI,
      "0xCA33D13E5D03b262C06E98244cb47328d5f890f3": RegistryABI,
      "0x9E9600168c3b6FA0d3A779956969c41aaD21e1a1": PbtTokenABI,
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
