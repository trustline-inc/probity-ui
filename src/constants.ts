import { BigNumber } from "ethers";
import AureiABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/Aurei.sol/Aurei.json";
import UsdABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/Usd.sol/USD.json";
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
      address: "0xE1185f92C6f9c3BC1584c3EC804FE4cC4f47B402",
      abi: AureiABI.abi
    },
    USD: {
      address: "0x58Be815054db1c21D3c9Dd74Cd3d5EF34Ce3e842",
      abi: UsdABI.abi
    },
    AUCTIONEER: {
      address: "0xAC068d62FaC56B714b4c3a37EF4179BEDcB782d2",
      abi: AuctioneerABI.abi
    },
    // NOTE: BRIDGE is deployed from https://github.com/trustline-inc/solaris-sdk
    BRIDGE: {
      address: "0xa40fE5844849349825363A535bfD4Bb06161dB25",
      abi: BridgeABI.abi
    },
    LIQUIDATOR: {
      address: "0x8A4D0222A7E885946DBeDDD90C39deB0a51dffdB",
      abi: LiquidatorABI.abi
    },
    PRICE_FEED: {
      address: "0xE66ddB9B843acb28440Cb8C33Ec73C3DF6edD3cB",
      abi: PriceFeedABI.abi
    },
    NATIVE_ASSET_MANAGER: {
      address: "0x2869f0082BD9230f54e04aCf3b221CfAE8C84332",
      abi: NativeAssetManagerABI.abi
    },
    REGISTRY: {
      address: "0x3Bca8187AEd677f74135C4d08bcD725b59992aDB",
      abi: RegistryABI.abi
    },
    PBT_TOKEN: {
      address: "0x8F75Cf0Ea581D4eCb88556Fb70736d5d6C5eF2CD",
      abi: PbtTokenABI.abi
    },
    RESERVE_POOL: {
      address: "0x8F4B8C8b40E93D3A1Bf9D7F370f7971E424Ba0c6",
      abi: ReservePoolABI.abi
    },
    TELLER: {
      address: "0xd583FD6b731E5CccA73cBe81c0edCb4604D68E7a",
      abi: TellerABI.abi
    },
    TREASURY: {
      address: "0xA3BEabA495129bfFbE716eaDE768041e8C76C851",
      abi: TreasuryABI.abi
    },
    VAULT_ENGINE: {
      address: "0x28290BD34d6957bB3DD5e899c2750069721615b3",
      abi: VaultEngineLimitedABI.abi
    },
    INTERFACES: {
      "0xE1185f92C6f9c3BC1584c3EC804FE4cC4f47B402": AureiABI,
      "0xAC068d62FaC56B714b4c3a37EF4179BEDcB782d2": AuctioneerABI,
      "0x8A4D0222A7E885946DBeDDD90C39deB0a51dffdB": LiquidatorABI,
      "0xE66ddB9B843acb28440Cb8C33Ec73C3DF6edD3cB": PriceFeedABI,
      "0x2869f0082BD9230f54e04aCf3b221CfAE8C84332": NativeAssetManagerABI,
      "0x3Bca8187AEd677f74135C4d08bcD725b59992aDB": RegistryABI,
      "0x8F75Cf0Ea581D4eCb88556Fb70736d5d6C5eF2CD": PbtTokenABI,
      "0x8F4B8C8b40E93D3A1Bf9D7F370f7971E424Ba0c6": ReservePoolABI,
      "0xd583FD6b731E5CccA73cBe81c0edCb4604D68E7a": TellerABI,
      "0xA3BEabA495129bfFbE716eaDE768041e8C76C851": TreasuryABI,
      "0x28290BD34d6957bB3DD5e899c2750069721615b3": VaultEngineLimitedABI
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
