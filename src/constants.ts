import { BigNumber } from "ethers";
import UsdABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/Usd.sol/USD.json";
import AuctioneerABI from "@trustline-inc/probity/artifacts/contracts/probity/Auctioneer.sol/Auctioneer.json";
import BridgeABI from "@trustline-inc/bridge/artifacts/contracts/Bridge.sol/Bridge.json";
import LiquidatorABI from "@trustline-inc/probity/artifacts/contracts/probity/Liquidator.sol/Liquidator.json";
import PriceFeedABI from "@trustline-inc/probity/artifacts/contracts/probity/PriceFeed.sol/PriceFeed.json";
import NativeAssetManagerABI from "@trustline-inc/probity/artifacts/contracts/probity/assets/NativeAssetManager.sol/NativeAssetManager.json";
import RegistryABI from "@trustline-inc/probity/artifacts/contracts/probity/Registry.sol/Registry.json";
import ReservePoolABI from "@trustline-inc/probity/artifacts/contracts/probity/ReservePool.sol/ReservePool.json";
import StateConnectorABI from "@trustline-inc/bridge/artifacts/contracts/test/StateConnector.sol/StateConnector.json"
import PbtABI from "@trustline-inc/probity/artifacts/contracts/probity/tokens/PbtToken.sol/PbtToken.json";
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
    USD: {
      address: "0x6f8cc11Faf43820DcC572D6e47844421b512985e",
      abi: UsdABI.abi
    },
    AUCTIONEER: {
      address: "0x104442279C5C1C16D46b95C212834B361eCE35FC",
      abi: AuctioneerABI.abi
    },
    // NOTE: BRIDGE is deployed from https://github.com/trustline-inc/solaris-sdk
    BRIDGE: {
      address: "",
      abi: null
    },
    LIQUIDATOR: {
      address: "0x4237527d98dc6D8CB751b48Bb3882c5C9a2f66D2",
      abi: LiquidatorABI.abi
    },
    PRICE_FEED: {
      address: "0xd6CD14E4323108ae6E0d1BfbBbfFC3F7aA287149",
      abi: PriceFeedABI.abi
    },
    NATIVE_ASSET_MANAGER: {
      address: "0xde67904D828863cBD66338934D662e8994F0dd6a",
      abi: NativeAssetManagerABI.abi
    },
    REGISTRY: {
      address: "0x3E39e49c6E4092E41Fa9aEd5087bd871a2960D67",
      abi: RegistryABI.abi
    },
    PBT: {
      address: "0xf5bc5A8f388d74A0916826622Ba04805BD20b1F3",
      abi: PbtABI.abi
    },
    RESERVE_POOL: {
      address: "0xF488e6E6e4F94d32F36549F58B372352B56Dd7ca",
      abi: ReservePoolABI.abi
    },
    TELLER: {
      address: "0xC7ffa2323f4A866D52D0061F15A8228548025bB2",
      abi: TellerABI.abi
    },
    TREASURY: {
      address: "0xD1045aE7De80dF3F1192a831C56f6513b7716dAA",
      abi: TreasuryABI.abi
    },
    VAULT_ENGINE: {
      address: "0xf7f57d12Fc09133A2b8cD2FA7E5BCfbBBc297238",
      abi: VaultEngineLimitedABI.abi
    },
    INTERFACES: {
      "0x6f8cc11Faf43820DcC572D6e47844421b512985e": UsdABI,
      "0x104442279C5C1C16D46b95C212834B361eCE35FC": AuctioneerABI,
      "0x4237527d98dc6D8CB751b48Bb3882c5C9a2f66D2": LiquidatorABI,
      "0xd6CD14E4323108ae6E0d1BfbBbfFC3F7aA287149": PriceFeedABI,
      "0xde67904D828863cBD66338934D662e8994F0dd6a": NativeAssetManagerABI,
      "0x3E39e49c6E4092E41Fa9aEd5087bd871a2960D67": RegistryABI,
      "0xf5bc5A8f388d74A0916826622Ba04805BD20b1F3": PbtABI,
      "0xF488e6E6e4F94d32F36549F58B372352B56Dd7ca": ReservePoolABI,
      "0xC7ffa2323f4A866D52D0061F15A8228548025bB2": TellerABI,
      "0xD1045aE7De80dF3F1192a831C56f6513b7716dAA": TreasuryABI,
      "0xf7f57d12Fc09133A2b8cD2FA7E5BCfbBBc297238": VaultEngineLimitedABI
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
  name: "Probity Vault",
  description: "A User-Managed Issuance, Yield, and Borrow Account",
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
