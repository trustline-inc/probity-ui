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
import VaultEngineLimitedABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngineLimited.sol/VaultEngineLimited.json";
import VaultEngineUnrestrictedABI from "@trustline-inc/probity/artifacts/contracts/probity/VaultEngineUnrestricted.sol/VaultEngineUnrestricted.json";

/**
 * Contract addresses
 */
export const CONTRACTS: { [key: number]: any } = {
  // Local
  1337: {
    USD: {
      address: "0x93e7D37d1c9FA8BF1F17f2F3c0B10381363F85c2",
      abi: UsdABI.abi
    },
    AUCTIONEER: {
      address: "0x88964D2c15E3ba46B1197215804Bed0913d40F51",
      abi: AuctioneerABI.abi
    },
    // NOTE: BRIDGE is deployed from https://github.com/trustline-inc/solaris-sdk
    BRIDGE: {
      address: "",
      abi: BridgeABI.abi
    },
    LIQUIDATOR: {
      address: "0x5A832354fBbe4e4D7AE9b8Ea3017CDdb0caCD6Ab",
      abi: LiquidatorABI.abi
    },
    PRICE_FEED: {
      address: "0xbbb8ab0D3D0c3b2614A06beb849F32C47D6666Fd",
      abi: PriceFeedABI.abi
    },
    NATIVE_ASSET_MANAGER: {
      address: "0x44f489e438072F8C92170FC338B3F74848a30393",
      abi: NativeAssetManagerABI.abi
    },
    REGISTRY: {
      address: "0x931d5c4737C72d10C7c54D1C6Ae56cde5ca309AC",
      abi: RegistryABI.abi
    },
    PBT: {
      address: "0x63A4ad63f5Cc067ac365f3fa74e02fB3806801bF",
      abi: PbtABI.abi
    },
    RESERVE_POOL: {
      address: "0xA24f5E41AB64697656d9A2Ce9cBAf8CcaB2989c0",
      abi: ReservePoolABI.abi
    },
    TELLER: {
      address: "0x4781Ed4dB83293b30032D555AA374A6224E1717f",
      abi: TellerABI.abi
    },
    TREASURY: {
      address: "0x5e3e6273604C120182b2e4d6Bfcf451F58477631",
      abi: TreasuryABI.abi
    },
    VAULT_ENGINE: {
      address: "0xa465e47422A8631C048d99622b93761c849588Ba",
      abi: VaultEngineLimitedABI.abi
    },
    INTERFACES: {
      "0x93e7D37d1c9FA8BF1F17f2F3c0B10381363F85c2": UsdABI,
      "0x88964D2c15E3ba46B1197215804Bed0913d40F51": AuctioneerABI,
      "0x5A832354fBbe4e4D7AE9b8Ea3017CDdb0caCD6Ab": LiquidatorABI,
      "0xbbb8ab0D3D0c3b2614A06beb849F32C47D6666Fd": PriceFeedABI,
      "0x44f489e438072F8C92170FC338B3F74848a30393": NativeAssetManagerABI,
      "0x931d5c4737C72d10C7c54D1C6Ae56cde5ca309AC": RegistryABI,
      "0x63A4ad63f5Cc067ac365f3fa74e02fB3806801bF": PbtABI,
      "0xA24f5E41AB64697656d9A2Ce9cBAf8CcaB2989c0": ReservePoolABI,
      "0x4781Ed4dB83293b30032D555AA374A6224E1717f": TellerABI,
      "0x5e3e6273604C120182b2e4d6Bfcf451F58477631": TreasuryABI,
      "0xa465e47422A8631C048d99622b93761c849588Ba": VaultEngineLimitedABI
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
